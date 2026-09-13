import Peer from "peerjs";

import { hashPlayerToken, isValidMatchToken, isValidRoomId } from "./match-url.js";

const otherPlayer = (player) => player === "X" ? "O" : "X";

export function playerForRole(roomId, role) {
  const hash = [...roomId].reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  const hostPlayer = hash % 2 === 0 ? "X" : "O";
  return role === "host" ? hostPlayer : otherPlayer(hostPlayer);
}

export function createOnlineState() {
  return {
    mode: "local",
    localPlayer: null,
    phase: "idle",
    connected: false,
    inviteUrl: "",
    error: "",
    audioEnabled: false,
    remoteAudioEnabled: false,
    audioConnected: false,
    audioBusy: false,
    audioError: "",
    networkOnline: typeof navigator === "undefined" || navigator.onLine,
  };
}

export class OnlineSession {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.mode = "local";
    this.localPlayer = null;
    this.phase = "idle";
    this.connected = false;
    this.inviteUrl = "";
    this.error = "";
    this.roomId = "";
    this.playerToken = "";
    this.acceptedPlayerTokenHash = "";
    this.peer = null;
    this.connection = null;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.reconnectEnabled = true;
    this.localStream = null;
    this.remoteAudioReady = false;
    this.call = null;
    this.audioConnected = false;
    this.audioBusy = false;
    this.audioError = "";
  }

  snapshot() {
    return {
      mode: this.mode,
      localPlayer: this.localPlayer,
      phase: this.phase,
      connected: this.connected,
      inviteUrl: this.inviteUrl,
      error: this.error,
      audioEnabled: Boolean(this.localStream),
      remoteAudioEnabled: this.remoteAudioReady,
      audioConnected: this.audioConnected,
      audioBusy: this.audioBusy,
      audioError: this.audioError,
      networkOnline: navigator.onLine,
    };
  }

  emit() {
    this.callbacks.onChange(this.snapshot());
  }

  host(roomId, inviteUrl, acceptedPlayerTokenHash = "") {
    this.configure("host", playerForRole(roomId, "host"), roomId, null, inviteUrl);
    this.acceptedPlayerTokenHash = acceptedPlayerTokenHash;
    if (!this.validateMatch()) return;
    this.startHostPeer();
  }

  join(roomId, playerToken) {
    this.configure("guest", playerForRole(roomId, "guest"), roomId, playerToken, "");
    if (!this.validateMatch()) return;
    this.startGuestPeer();
  }

  configure(mode, localPlayer, roomId, playerToken, inviteUrl) {
    this.stopCurrentSession();
    this.mode = mode;
    this.localPlayer = localPlayer;
    this.phase = mode === "host" ? "creating" : "connecting";
    this.connected = false;
    this.inviteUrl = inviteUrl;
    this.error = "";
    this.roomId = roomId;
    this.playerToken = playerToken;
    this.acceptedPlayerTokenHash = "";
    this.reconnectEnabled = true;
    this.audioError = "";
    this.emit();
  }

  validateMatch() {
    if (
      isValidRoomId(this.roomId)
      && (this.mode === "host" || isValidMatchToken(this.playerToken))
    ) return true;
    this.reconnectEnabled = false;
    this.showError("Линкът за двубоя е невалиден.");
    return false;
  }

  leave() {
    this.send({ type: "leave" });
    this.stopCurrentSession();
    this.mode = "local";
    this.localPlayer = null;
    this.phase = "idle";
    this.connected = false;
    this.inviteUrl = "";
    this.error = "";
    this.roomId = "";
    this.playerToken = "";
    this.acceptedPlayerTokenHash = "";
    this.reconnectEnabled = true;
    this.audioError = "";
    this.emit();
  }

  expire() {
    this.send({ type: "expired" });
    this.stopCurrentSession();
    this.phase = "expired";
    this.connected = false;
    this.inviteUrl = "";
    this.error = "Двубоят изтече след 24 часа без активност.";
    this.reconnectEnabled = false;
    this.emit();
  }

  destroy() {
    this.stopCurrentSession();
  }

  stopCurrentSession() {
    const peer = this.peer;
    const call = this.call;
    const stream = this.localStream;

    this.peer = null;
    this.connection = null;
    this.call = null;
    this.localStream = null;
    this.remoteAudioReady = false;
    this.audioConnected = false;
    this.audioBusy = false;
    this.clearReconnectTimer();
    this.clearHeartbeatTimer();

    if (call) call.close();
    if (stream) stream.getTracks().forEach((track) => track.stop());
    if (peer && !peer.destroyed) peer.destroy();

    const audio = this.callbacks.getRemoteAudio();
    if (audio) audio.srcObject = null;
  }

  send(message) {
    if (!this.connection?.open) return false;
    try {
      this.connection.send(message);
      return true;
    } catch {
      return false;
    }
  }

  broadcastState() {
    if (this.mode === "host") {
      this.send({ type: "state", state: this.callbacks.getGameState() });
    }
  }

  closeAudioCall() {
    const call = this.call;
    this.call = null;
    this.audioConnected = false;
    const audio = this.callbacks.getRemoteAudio();
    if (audio) audio.srcObject = null;
    if (call) call.close();
  }

  attachAudioCall(call) {
    this.closeAudioCall();
    this.call = call;

    call.on("stream", (stream) => {
      if (this.call !== call) return;
      const audio = this.callbacks.getRemoteAudio();
      if (!audio) return;
      audio.srcObject = stream;
      this.audioConnected = true;
      this.audioError = "";
      audio.play().catch(() => {
        this.audioError = "Докосни страницата, за да чуеш другия играч.";
        this.emit();
      });
      this.emit();
    });

    const endCall = () => {
      if (this.call !== call) return;
      this.call = null;
      this.audioConnected = false;
      const audio = this.callbacks.getRemoteAudio();
      if (audio) audio.srcObject = null;
      this.emit();
    };

    call.on("close", endCall);
    call.on("error", endCall);
  }

  handleIncomingCall = (call) => {
    const expectedPeer = this.connection?.peer;
    if (this.mode !== "guest" || !this.localStream || call.peer !== expectedPeer) {
      call.close();
      return;
    }

    call.answer(this.localStream);
    this.attachAudioCall(call);
  };

  maybeStartAudioCall() {
    if (
      this.mode !== "host"
      || !this.connected
      || !this.localStream
      || !this.remoteAudioReady
      || this.call
    ) return;

    this.attachAudioCall(this.peer.call(this.connection.peer, this.localStream));
  }

  async toggleAudio() {
    if (!this.connected) return;

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      this.audioError = "";
      this.send({ type: "audio-off" });
      this.closeAudioCall();
      this.emit();
      return;
    }

    this.audioBusy = true;
    this.audioError = "";
    this.emit();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!this.connected) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      this.localStream = stream;
      this.send({ type: "audio-ready" });
      this.maybeStartAudioCall();
    } catch {
      this.audioError = "Разреши достъп до микрофона и опитай отново.";
    } finally {
      this.audioBusy = false;
      this.emit();
    }
  }

  handleConnectionData(data) {
    if (!data || typeof data !== "object") return;

    if (this.mode === "host") this.callbacks.onActivity?.();

    if (data.type === "heartbeat") return;

    if (data.type === "leave") {
      this.reconnectEnabled = false;
      if (this.mode === "host") {
        this.acceptedPlayerTokenHash = "";
        this.callbacks.onRemoteLeave?.();
        this.connection?.close();
      } else {
        this.showError("Другият играч напусна двубоя.");
      }
      return;
    }

    if (data.type === "expired") {
      this.reconnectEnabled = false;
      this.stopCurrentSession();
      this.phase = "expired";
      this.connected = false;
      this.error = "Двубоят изтече след 24 часа без активност.";
      this.emit();
      return;
    }

    if (data.type === "audio-ready") {
      this.remoteAudioReady = true;
      this.maybeStartAudioCall();
      this.emit();
      return;
    }

    if (data.type === "audio-off") {
      this.remoteAudioReady = false;
      this.closeAudioCall();
      this.emit();
      return;
    }

    if (this.mode === "host") {
      if (data.type === "move") this.callbacks.onMove(data.index, otherPlayer(this.localPlayer));
      else if (data.type === "new-round") this.callbacks.onNewRound();
      else if (data.type === "reset-score") this.callbacks.onResetScore();
      else return;
      this.broadcastState();
    } else if (data.type === "state") {
      this.callbacks.onState(data.state);
    } else if (data.type === "full") {
      this.reconnectEnabled = false;
      this.showError("В този двубой вече има двама играчи.");
    } else if (data.type === "replaced") {
      this.reconnectEnabled = false;
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => track.stop());
        this.localStream = null;
      }
      this.closeAudioCall();
      this.showError("Двубоят продължава в другия браузър.");
    }
  }

  attachConnection(connection) {
    this.connection = connection;
    this.connected = false;
    this.remoteAudioReady = false;
    this.closeAudioCall();

    let activated = false;
    const activate = () => {
      if (this.connection !== connection) return;
      if (activated) return;
      activated = true;
      this.clearReconnectTimer();
      this.connected = true;
      this.phase = "connected";
      this.error = "";
      this.audioError = "";
      this.emit();
      this.broadcastState();
      if (this.mode === "host") this.callbacks.onActivity?.();
      else this.startHeartbeat();
      if (this.localStream) this.send({ type: "audio-ready" });
      this.maybeStartAudioCall();
    };
    connection.on("open", activate);
    connection.on("data", (data) => {
      if (this.connection === connection) this.handleConnectionData(data);
    });
    connection.on("close", () => this.handleConnectionEnd(connection));
    connection.on("error", () => this.handleConnectionEnd(connection));
    if (connection.open) activate();
  }

  handleConnectionEnd(connection) {
    if (this.connection !== connection) return;

    this.connection = null;
    this.connected = false;
    this.remoteAudioReady = false;
    this.clearHeartbeatTimer();
    this.closeAudioCall();

    if (this.mode === "host") {
      this.phase = navigator.onLine ? "waiting" : "reconnecting";
      this.error = "";
      if (!this.peer || this.peer.destroyed) this.scheduleHostReconnect(0);
      else if (this.peer.disconnected) this.reconnectSignaling(this.peer);
    } else if (this.mode === "guest") {
      if (this.reconnectEnabled) {
        this.scheduleGuestReconnect();
        return;
      }
      this.phase = "error";
      this.error ||= "Другият играч прекъсна връзката.";
    }

    this.emit();
  }

  rejectConnection(connection) {
    connection.on("open", () => {
      connection.send({ type: "full" });
      window.setTimeout(() => connection.close(), 150);
    });
  }

  async handleHostConnection(connection) {
    const playerToken = connection.metadata?.playerToken;
    if (!isValidMatchToken(playerToken)) {
      this.rejectConnection(connection);
      return;
    }

    const playerTokenHash = await hashPlayerToken(playerToken);
    if (this.mode !== "host") return connection.close();
    if (this.acceptedPlayerTokenHash && playerTokenHash !== this.acceptedPlayerTokenHash) {
      this.rejectConnection(connection);
      return;
    }
    if (!this.acceptedPlayerTokenHash) {
      this.acceptedPlayerTokenHash = playerTokenHash;
      this.callbacks.onOpponentAccepted?.(playerTokenHash);
    }

    if (this.connection) {
      const previousConnection = this.connection;
      if (previousConnection.open) {
        try {
          previousConnection.send({ type: "replaced" });
        } catch {}
        window.setTimeout(() => previousConnection.close(), 250);
      } else {
        previousConnection.close();
      }

      this.connection = null;
      this.connected = false;
      this.remoteAudioReady = false;
      this.closeAudioCall();
    }

    this.phase = "waiting";
    this.attachConnection(connection);
    this.callbacks.onActivity?.();
    this.emit();
  }

  showError(message) {
    this.clearReconnectTimer();
    this.connected = false;
    this.phase = "error";
    this.error = message;
    this.emit();
  }

  clearReconnectTimer() {
    if (!this.reconnectTimer) return;
    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  clearHeartbeatTimer() {
    if (!this.heartbeatTimer) return;
    window.clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  startHeartbeat() {
    this.clearHeartbeatTimer();
    this.heartbeatTimer = window.setInterval(() => this.send({ type: "heartbeat" }), 30000);
  }

  reconnectSignaling(peer) {
    window.setTimeout(() => {
      if (this.peer !== peer || peer.destroyed || !peer.disconnected) return;
      try {
        peer.reconnect();
      } catch {
        if (this.connected) return;
        if (this.mode === "host") this.scheduleHostReconnect();
        else if (this.mode === "guest") this.scheduleGuestReconnect();
      }
    }, 1000);
  }

  scheduleHostReconnect(delay = 1500) {
    if (this.mode !== "host" || this.connected || this.reconnectTimer) return;
    this.phase = this.inviteUrl ? "reconnecting" : "creating";
    this.emit();
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.startHostPeer();
    }, delay);
  }

  scheduleGuestReconnect(delay = 1500) {
    if (
      this.mode !== "guest"
      || this.connected
      || !this.reconnectEnabled
      || this.reconnectTimer
    ) return;
    this.phase = "reconnecting";
    this.error = "";
    this.emit();
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.startGuestPeer();
    }, delay);
  }

  replaceCurrentPeer(peer) {
    const previousPeer = this.peer;
    this.peer = peer;
    if (previousPeer && previousPeer !== peer && !previousPeer.destroyed) previousPeer.destroy();
  }

  startHostPeer() {
    if (this.mode !== "host" || this.connected) return;
    if (!navigator.onLine) {
      this.scheduleHostReconnect();
      return;
    }

    const peer = new Peer(this.roomId);
    this.replaceCurrentPeer(peer);

    peer.on("open", () => {
      if (this.peer !== peer) return;
      this.clearReconnectTimer();
      this.phase = this.connected ? "connected" : "waiting";
      this.emit();
    });
    peer.on("connection", (connection) => {
      if (this.peer !== peer) return connection.close();
      this.handleHostConnection(connection);
    });
    peer.on("call", this.handleIncomingCall);
    peer.on("disconnected", () => this.reconnectSignaling(peer));
    peer.on("close", () => {
      if (this.peer === peer && !this.connected) this.scheduleHostReconnect();
    });
    peer.on("error", () => {
      if (this.peer === peer && !this.connected) this.scheduleHostReconnect();
    });
  }

  startGuestPeer() {
    if (this.mode !== "guest" || this.connected || !this.reconnectEnabled) return;
    if (!navigator.onLine) {
      this.scheduleGuestReconnect();
      return;
    }

    const peer = new Peer();
    this.replaceCurrentPeer(peer);

    peer.on("open", () => {
      if (this.peer !== peer || this.connected) return;
      this.attachConnection(peer.connect(this.roomId, {
        reliable: true,
        metadata: { playerToken: this.playerToken },
      }));
    });
    peer.on("connection", (connection) => connection.close());
    peer.on("call", this.handleIncomingCall);
    peer.on("disconnected", () => this.reconnectSignaling(peer));
    peer.on("close", () => {
      if (this.peer === peer && !this.connected) this.scheduleGuestReconnect();
    });
    peer.on("error", () => {
      if (this.peer === peer && !this.connected) this.scheduleGuestReconnect();
    });
  }

  handleOnline() {
    if (this.mode === "host" && !this.connected) {
      this.clearReconnectTimer();
      if (this.peer?.disconnected && !this.peer.destroyed) this.reconnectSignaling(this.peer);
      else if (!this.peer || this.peer.destroyed) this.scheduleHostReconnect(0);
      else {
        this.phase = "waiting";
        this.emit();
      }
    } else if (this.mode === "guest" && !this.connected && this.reconnectEnabled) {
      this.clearReconnectTimer();
      this.scheduleGuestReconnect(0);
    } else {
      this.emit();
    }
  }

  handleOffline() {
    if (this.mode === "local") return this.emit();
    if (this.connection) this.connection.close();
    else {
      this.connected = false;
      this.phase = "reconnecting";
      this.closeAudioCall();
      this.emit();
    }
  }
}
