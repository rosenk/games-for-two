const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = [...document.querySelectorAll("[data-cell]")];
const playerCards = [...document.querySelectorAll("[data-player-card]")];
const status = document.querySelector("#game-status");
const turnIndicator = document.querySelector(".turn-indicator");
const newRoundButton = document.querySelector("#new-round");
const resetScoreButton = document.querySelector("#reset-score");
const onlineCard = document.querySelector("#online-card");
const onlineTitle = document.querySelector("#online-title");
const onlineDescription = document.querySelector("#online-description");
const createOnlineButton = document.querySelector("#create-online");
const shareButton = document.querySelector("#share-game");
const audioButton = document.querySelector("#audio-toggle");
const leaveButton = document.querySelector("#leave-game");
const remoteAudio = document.querySelector("#remote-audio");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draw: document.querySelector("#score-draw"),
};
const playerLabels = {
  X: document.querySelector("#label-x"),
  O: document.querySelector("#label-o"),
};

cells.forEach((cell) => {
  cell.dataset.baseLabel = cell.getAttribute("aria-label");
});

let board = Array(9).fill(null);
let currentPlayer = "X";
let nextStarter = "O";
let gameOver = false;
let winningLine = null;
let scores = { X: 0, O: 0, draw: 0 };
let movePending = false;
let online = createLocalSession();

function createLocalSession() {
  return {
    mode: "local",
    localPlayer: null,
    phase: "idle",
    peer: null,
    connection: null,
    connected: false,
    inviteUrl: "",
    error: "",
    roomId: "",
    guestToken: "",
    reconnectTimer: null,
    reconnectEnabled: true,
    localStream: null,
    remoteAudioReady: false,
    call: null,
    audioConnected: false,
    audioError: "",
  };
}

function playerName(player) {
  return player === "X" ? "Играч 1" : "Играч 2";
}

function playerMark(player) {
  return player === "X" ? "×" : "○";
}

function randomToken(prefix) {
  if (crypto.randomUUID) return `${prefix}${crypto.randomUUID()}`;

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return `${prefix}${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function displayName(player) {
  if (online.mode === "local") return playerName(player);
  return player === online.localPlayer ? "Вие" : "Противникът";
}

function findWinningLine(candidateBoard = board) {
  return winningLines.find(([a, b, c]) => {
    return candidateBoard[a] && candidateBoard[a] === candidateBoard[b] && candidateBoard[a] === candidateBoard[c];
  }) || null;
}

function setStatus(message, mark = "") {
  status.replaceChildren(document.createTextNode(message));
  if (!mark) return;

  status.append(" ");
  const strong = document.createElement("strong");
  strong.textContent = mark;
  status.append(strong);
}

function canLocalPlayerMove() {
  if (gameOver) return false;
  if (online.mode === "local") return true;
  return online.connected && currentPlayer === online.localPlayer && !movePending;
}

function renderGame() {
  const canMove = canLocalPlayerMove();

  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value ? playerMark(value) : "";
    cell.classList.toggle("x", value === "X");
    cell.classList.toggle("o", value === "O");
    cell.classList.toggle("marked", Boolean(value));
    cell.classList.toggle("winner", Boolean(winningLine?.includes(index)));
    cell.disabled = Boolean(value) || !canMove;

    const label = value
      ? `${cell.dataset.baseLabel}: ${displayName(value)} ${playerMark(value)}`
      : cell.dataset.baseLabel;
    cell.setAttribute("aria-label", label);
  });

  Object.entries(scoreElements).forEach(([key, element]) => {
    element.textContent = scores[key];
  });

  if (online.mode === "local") {
    playerLabels.X.textContent = "Играч 1";
    playerLabels.O.textContent = "Играч 2";
  } else {
    playerLabels.X.textContent = online.localPlayer === "X" ? "Вие" : "Противник";
    playerLabels.O.textContent = online.localPlayer === "O" ? "Вие" : "Противник";
  }

  const waitingForConnection = online.mode !== "local" && !online.connected;
  playerCards.forEach((card) => {
    card.classList.toggle(
      "active",
      card.dataset.playerCard === currentPlayer && !gameOver && !waitingForConnection,
    );
  });

  turnIndicator.classList.toggle("player-o", currentPlayer === "O");
  turnIndicator.classList.toggle("finished", gameOver);
  turnIndicator.classList.toggle("waiting", waitingForConnection);

  if (waitingForConnection) {
    if (online.phase === "creating") setStatus("Създаваме двубоя…");
    else if (online.mode === "host" && online.phase === "waiting") setStatus("Чакаме другия играч…");
    else if (online.phase === "error") setStatus("Няма връзка с двубоя.");
    else setStatus("Свързваме ви с двубоя…");
  } else if (gameOver && winningLine) {
    const winner = board[winningLine[0]];
    const message = online.mode === "local"
      ? `${playerName(winner)} печели!`
      : winner === online.localPlayer ? "Вие печелите!" : "Противникът печели!";
    setStatus(message, playerMark(winner));
  } else if (gameOver) {
    setStatus("Равенство — чудесна игра!");
  } else if (online.mode === "local") {
    setStatus(`${playerName(currentPlayer)} е на ход`, playerMark(currentPlayer));
  } else if (currentPlayer === online.localPlayer) {
    setStatus("Ваш ред", playerMark(currentPlayer));
  } else {
    setStatus("Ход на противника", playerMark(currentPlayer));
  }

  newRoundButton.disabled = waitingForConnection;
  resetScoreButton.disabled = waitingForConnection;
}

function renderOnline() {
  onlineCard.className = `online-card phase-${online.phase}`;
  createOnlineButton.hidden = online.mode !== "local";
  shareButton.hidden = online.mode !== "host" || !online.inviteUrl;
  audioButton.hidden = !online.connected;
  leaveButton.hidden = online.mode === "local";
  audioButton.classList.toggle("active", Boolean(online.localStream));
  audioButton.textContent = online.localStream ? "Спри микрофона" : "Микрофон";
  audioButton.setAttribute("aria-pressed", String(Boolean(online.localStream)));

  if (online.mode === "local" && online.phase === "error") {
    onlineTitle.textContent = "Онлайн режимът не се зареди";
    onlineDescription.textContent = online.error || "Опитайте отново след малко.";
  } else if (online.mode === "local") {
    onlineTitle.textContent = "Играй с приятел";
    onlineDescription.textContent = "Различни мрежи · нужен е интернет.";
  } else if (online.phase === "creating") {
    onlineTitle.textContent = "Създаваме двубоя…";
    onlineDescription.textContent = "Това обикновено отнема няколко секунди.";
  } else if (online.mode === "host" && online.phase === "waiting") {
    onlineTitle.textContent = "Двубоят е готов";
    onlineDescription.textContent = "Сподели линка и остави тази страница отворена.";
  } else if (online.phase === "connecting" || online.phase === "reconnecting") {
    onlineTitle.textContent = online.phase === "connecting"
      ? "Влизате в двубоя…"
      : "Възстановяваме връзката…";
    onlineDescription.textContent = navigator.onLine
      ? "Двубоят ще продължи автоматично."
      : "Чакаме интернет връзка.";
  } else if (online.phase === "connected") {
    onlineTitle.textContent = "Играете онлайн";
    if (online.audioError) {
      onlineDescription.textContent = online.audioError;
    } else if (online.audioConnected) {
      onlineDescription.textContent = `Вие сте ${playerMark(online.localPlayer)} · гласовата връзка е активна`;
    } else if (online.localStream) {
      onlineDescription.textContent = "Микрофонът е включен · чакаме другия играч";
    } else {
      onlineDescription.textContent = `Вие сте ${playerMark(online.localPlayer)} · връзката е активна`;
    }
  } else {
    onlineTitle.textContent = "Връзката прекъсна";
    onlineDescription.textContent = online.error || "Другият играч е излязъл.";
  }
}

function gameState() {
  return {
    board: [...board],
    currentPlayer,
    nextStarter,
    gameOver,
    scores: { ...scores },
  };
}

function isValidState(state) {
  const validCell = (value) => value === null || value === "X" || value === "O";
  const validScore = (value) => Number.isInteger(value) && value >= 0;

  return state
    && Array.isArray(state.board)
    && state.board.length === 9
    && state.board.every(validCell)
    && (state.currentPlayer === "X" || state.currentPlayer === "O")
    && (state.nextStarter === "X" || state.nextStarter === "O")
    && typeof state.gameOver === "boolean"
    && state.scores
    && validScore(state.scores.X)
    && validScore(state.scores.O)
    && validScore(state.scores.draw);
}

function applyRemoteState(state) {
  if (!isValidState(state)) return;

  board = [...state.board];
  currentPlayer = state.currentPlayer;
  nextStarter = state.nextStarter;
  gameOver = state.gameOver;
  scores = { ...state.scores };
  winningLine = findWinningLine();
  movePending = false;
  renderGame();
}

function sendMessage(message) {
  if (!online.connection?.open) return false;
  try {
    online.connection.send(message);
    return true;
  } catch {
    return false;
  }
}

function broadcastState() {
  if (online.mode === "host") {
    sendMessage({ type: "state", state: gameState() });
  }
}

function makeMove(index, player) {
  if (!Number.isInteger(index) || index < 0 || index > 8) return;
  if (gameOver || board[index] || player !== currentPlayer) return;

  board[index] = player;
  winningLine = findWinningLine();

  if (winningLine) {
    gameOver = true;
    scores[player] += 1;
  } else if (board.every(Boolean)) {
    gameOver = true;
    scores.draw += 1;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  renderGame();
  broadcastState();
}

function playCell(event) {
  const index = Number(event.currentTarget.dataset.cell);

  if (online.mode === "local") {
    makeMove(index, currentPlayer);
  } else if (!canLocalPlayerMove()) {
    return;
  } else if (online.mode === "host") {
    makeMove(index, online.localPlayer);
  } else if (sendMessage({ type: "move", index })) {
    movePending = true;
    renderGame();
  }
}

function startRound() {
  board = Array(9).fill(null);
  gameOver = false;
  winningLine = null;
  movePending = false;
  currentPlayer = nextStarter;
  nextStarter = nextStarter === "X" ? "O" : "X";
  renderGame();
  broadcastState();
}

function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  nextStarter = "X";
  startRound();
}

function resetMatch() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  nextStarter = "O";
  gameOver = false;
  winningLine = null;
  scores = { X: 0, O: 0, draw: 0 };
  movePending = false;
  renderGame();
}

function requestNewRound() {
  if (online.mode === "guest") sendMessage({ type: "new-round" });
  else startRound();
}

function requestScoreReset() {
  if (online.mode === "guest") sendMessage({ type: "reset-score" });
  else resetScore();
}

function closeAudioCall() {
  const call = online.call;
  online.call = null;
  online.audioConnected = false;
  remoteAudio.srcObject = null;
  if (call) call.close();
}

function attachAudioCall(call) {
  closeAudioCall();
  online.call = call;

  call.on("stream", (stream) => {
    if (online.call !== call) return;
    remoteAudio.srcObject = stream;
    online.audioConnected = true;
    online.audioError = "";
    remoteAudio.play().catch(() => {
      online.audioError = "Докосни страницата, за да чуеш другия играч.";
      renderOnline();
    });
    renderOnline();
  });

  const endCall = () => {
    if (online.call !== call) return;
    online.call = null;
    online.audioConnected = false;
    remoteAudio.srcObject = null;
    renderOnline();
  };

  call.on("close", endCall);
  call.on("error", endCall);
}

function handleIncomingCall(call) {
  const expectedPeer = online.connection?.peer;
  if (online.mode !== "guest" || !online.localStream || call.peer !== expectedPeer) {
    call.close();
    return;
  }

  call.answer(online.localStream);
  attachAudioCall(call);
}

function maybeStartAudioCall() {
  if (
    online.mode !== "host"
    || !online.connected
    || !online.localStream
    || !online.remoteAudioReady
    || online.call
  ) return;

  const call = online.peer.call(online.connection.peer, online.localStream);
  attachAudioCall(call);
}

async function toggleAudio() {
  if (!online.connected) return;

  if (online.localStream) {
    online.localStream.getTracks().forEach((track) => track.stop());
    online.localStream = null;
    online.audioError = "";
    sendMessage({ type: "audio-off" });
    closeAudioCall();
    renderOnline();
    return;
  }

  audioButton.disabled = true;
  online.audioError = "";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    if (!online.connected) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    online.localStream = stream;
    sendMessage({ type: "audio-ready" });
    maybeStartAudioCall();
  } catch {
    online.audioError = "Разреши достъп до микрофона и опитай отново.";
  } finally {
    audioButton.disabled = false;
    renderOnline();
  }
}

function handleConnectionData(data) {
  if (!data || typeof data !== "object") return;

  if (data.type === "audio-ready") {
    online.remoteAudioReady = true;
    maybeStartAudioCall();
    renderOnline();
    return;
  }

  if (data.type === "audio-off") {
    online.remoteAudioReady = false;
    closeAudioCall();
    renderOnline();
    return;
  }

  if (online.mode === "host") {
    if (data.type === "move") makeMove(data.index, "O");
    else if (data.type === "new-round") startRound();
    else if (data.type === "reset-score") resetScore();
  } else if (data.type === "state") {
    applyRemoteState(data.state);
  } else if (data.type === "full") {
    online.reconnectEnabled = false;
    showOnlineError("В този двубой вече има двама играчи.");
  } else if (data.type === "replaced") {
    online.reconnectEnabled = false;
    if (online.localStream) {
      online.localStream.getTracks().forEach((track) => track.stop());
      online.localStream = null;
    }
    closeAudioCall();
    showOnlineError("Двубоят продължава в другия браузър.");
  }
}

function handleConnectionEnd(connection) {
  if (online.connection !== connection) return;

  online.connection = null;
  online.connected = false;
  online.remoteAudioReady = false;
  movePending = false;
  closeAudioCall();

  if (online.mode === "host") {
    online.phase = navigator.onLine ? "waiting" : "reconnecting";
    online.error = "";
    if (!online.peer || online.peer.destroyed) scheduleHostReconnect(0);
    else if (online.peer.disconnected) reconnectSignaling(online.peer);
  } else if (online.mode === "guest") {
    if (online.reconnectEnabled) {
      scheduleGuestReconnect();
      return;
    }
    online.phase = "error";
    online.error ||= "Другият играч прекъсна връзката.";
  }

  renderOnline();
  renderGame();
}

function attachConnection(connection) {
  online.connection = connection;
  online.connected = false;
  online.remoteAudioReady = false;
  closeAudioCall();

  connection.on("open", () => {
    if (online.connection !== connection) return;
    clearReconnectTimer();
    online.connected = true;
    online.phase = "connected";
    online.error = "";
    online.audioError = "";
    renderOnline();
    renderGame();
    broadcastState();
    if (online.localStream) sendMessage({ type: "audio-ready" });
    maybeStartAudioCall();
  });

  connection.on("data", (data) => {
    if (online.connection === connection) handleConnectionData(data);
  });
  connection.on("close", () => handleConnectionEnd(connection));
  connection.on("error", () => handleConnectionEnd(connection));
}

function rejectConnection(connection) {
  connection.on("open", () => {
    connection.send({ type: "full" });
    window.setTimeout(() => connection.close(), 150);
  });
}

function clearReconnectTimer(session = online) {
  if (!session.reconnectTimer) return;
  window.clearTimeout(session.reconnectTimer);
  session.reconnectTimer = null;
}

function reconnectSignaling(peer) {
  window.setTimeout(() => {
    if (online.peer !== peer || peer.destroyed || !peer.disconnected) return;

    try {
      peer.reconnect();
    } catch {
      if (online.connected) return;
      if (online.mode === "host") scheduleHostReconnect();
      else if (online.mode === "guest") scheduleGuestReconnect();
    }
  }, 1000);
}

function scheduleHostReconnect(delay = 1500) {
  if (online.mode !== "host" || online.connected || online.reconnectTimer) return;

  online.phase = online.inviteUrl ? "reconnecting" : "creating";
  renderOnline();
  renderGame();
  online.reconnectTimer = window.setTimeout(() => {
    online.reconnectTimer = null;
    startHostPeer();
  }, delay);
}

function scheduleGuestReconnect(delay = 1500) {
  if (
    online.mode !== "guest"
    || online.connected
    || !online.reconnectEnabled
    || online.reconnectTimer
  ) return;

  online.phase = "reconnecting";
  online.error = "";
  renderOnline();
  renderGame();
  online.reconnectTimer = window.setTimeout(() => {
    online.reconnectTimer = null;
    startGuestPeer();
  }, delay);
}

function replaceCurrentPeer(peer) {
  const previousPeer = online.peer;
  online.peer = peer;
  if (previousPeer && previousPeer !== peer && !previousPeer.destroyed) {
    previousPeer.destroy();
  }
}

function handleHostConnection(connection) {
  if (connection.metadata?.playerToken !== online.guestToken) {
    rejectConnection(connection);
    return;
  }

  if (online.connection) {
    const previousConnection = online.connection;
    if (previousConnection.open) {
      try {
        previousConnection.send({ type: "replaced" });
      } catch {}
      window.setTimeout(() => previousConnection.close(), 250);
    } else {
      previousConnection.close();
    }

    online.connection = null;
    online.connected = false;
    online.remoteAudioReady = false;
    closeAudioCall();
  }

  online.phase = "waiting";
  attachConnection(connection);
  renderOnline();
  renderGame();
}

function showOnlineError(message) {
  clearReconnectTimer();
  online.connected = false;
  online.phase = "error";
  online.error = message;
  movePending = false;
  renderOnline();
  renderGame();
}

function startHostPeer() {
  if (online.mode !== "host" || online.connected) return;
  if (!navigator.onLine) {
    scheduleHostReconnect();
    return;
  }

  const peer = new window.Peer(online.roomId);
  replaceCurrentPeer(peer);

  peer.on("open", () => {
    if (online.peer !== peer) return;
    clearReconnectTimer();

    if (!online.inviteUrl) {
      const inviteUrl = new URL(window.location.href);
      inviteUrl.search = "";
      inviteUrl.hash = "";
      inviteUrl.searchParams.set("room", online.roomId);
      inviteUrl.searchParams.set("player", online.guestToken);
      online.inviteUrl = inviteUrl.toString();
    }

    online.phase = online.connected ? "connected" : "waiting";
    renderOnline();
    renderGame();
  });

  peer.on("connection", (connection) => {
    if (online.peer !== peer) return connection.close();
    handleHostConnection(connection);
  });
  peer.on("call", handleIncomingCall);
  peer.on("disconnected", () => reconnectSignaling(peer));
  peer.on("close", () => {
    if (online.peer === peer && !online.connected) scheduleHostReconnect();
  });
  peer.on("error", () => {
    if (online.peer === peer && !online.connected) scheduleHostReconnect();
  });
}

function createOnlineGame() {
  leaveOnlineGame(false);
  online.mode = "host";
  online.localPlayer = "X";
  online.phase = "creating";
  online.roomId = randomToken("ttt-");
  online.guestToken = randomToken("p-");
  resetMatch();
  renderOnline();

  if (typeof window.Peer !== "function") {
    leaveOnlineGame(false);
    online.phase = "error";
    online.error = "Провери интернет връзката и опитай отново.";
    renderOnline();
    return;
  }

  startHostPeer();
}

function startGuestPeer() {
  if (online.mode !== "guest" || online.connected || !online.reconnectEnabled) return;
  if (!navigator.onLine) {
    scheduleGuestReconnect();
    return;
  }

  const peer = new window.Peer();
  replaceCurrentPeer(peer);

  peer.on("open", () => {
    if (online.peer !== peer || online.connected) return;
    const connection = peer.connect(online.roomId, {
      reliable: true,
      metadata: { playerToken: online.guestToken },
    });
    attachConnection(connection);
  });

  peer.on("connection", (connection) => connection.close());
  peer.on("call", handleIncomingCall);
  peer.on("disconnected", () => reconnectSignaling(peer));
  peer.on("close", () => {
    if (online.peer === peer && !online.connected) scheduleGuestReconnect();
  });
  peer.on("error", () => {
    if (online.peer === peer && !online.connected) scheduleGuestReconnect();
  });
}

function joinOnlineGame(roomId, guestToken) {
  leaveOnlineGame(false);
  online.mode = "guest";
  online.localPlayer = "O";
  online.phase = "connecting";
  online.roomId = roomId;
  online.guestToken = guestToken;
  resetMatch();
  renderOnline();

  const validToken = (value) => /^[A-Za-z0-9_-]{1,100}$/.test(value || "");
  if (!validToken(roomId) || !validToken(guestToken) || typeof window.Peer !== "function") {
    online.reconnectEnabled = false;
    showOnlineError("Линкът за двубоя е невалиден.");
    return;
  }

  startGuestPeer();
}

function leaveOnlineGame(updateUrl = true) {
  const previousOnline = online;
  online = createLocalSession();

  clearReconnectTimer(previousOnline);
  if (previousOnline.call) previousOnline.call.close();
  if (previousOnline.localStream) {
    previousOnline.localStream.getTracks().forEach((track) => track.stop());
  }
  if (previousOnline.peer && !previousOnline.peer.destroyed) previousOnline.peer.destroy();
  remoteAudio.srcObject = null;

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.delete("room");
    url.searchParams.delete("player");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  resetMatch();
  renderOnline();
}

async function shareGame() {
  if (!online.inviteUrl) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Морски шах",
        text: "Играй морски шах с мен!",
        url: online.inviteUrl,
      });
      showShareFeedback("Линкът е споделен ✓");
    } else {
      await copyInviteLink();
      showShareFeedback("Линкът е копиран ✓");
    }
  } catch (error) {
    if (error.name !== "AbortError") showShareFeedback("Неуспешно — опитай пак");
  }
}

async function copyInviteLink() {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(online.inviteUrl);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = online.inviteUrl;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy failed");
}

function showShareFeedback(message) {
  const previousText = shareButton.textContent;
  shareButton.textContent = message;
  window.setTimeout(() => {
    shareButton.textContent = previousText;
  }, 1800);
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
newRoundButton.addEventListener("click", requestNewRound);
resetScoreButton.addEventListener("click", requestScoreReset);
createOnlineButton.addEventListener("click", createOnlineGame);
shareButton.addEventListener("click", shareGame);
audioButton.addEventListener("click", toggleAudio);
leaveButton.addEventListener("click", () => leaveOnlineGame());

window.addEventListener("online", () => {
  if (online.mode === "host" && !online.connected) {
    clearReconnectTimer();
    if (online.peer?.disconnected && !online.peer.destroyed) reconnectSignaling(online.peer);
    else if (!online.peer || online.peer.destroyed) scheduleHostReconnect(0);
    else {
      online.phase = "waiting";
      renderOnline();
      renderGame();
    }
  } else if (online.mode === "guest" && !online.connected && online.reconnectEnabled) {
    clearReconnectTimer();
    scheduleGuestReconnect(0);
  }
});

window.addEventListener("offline", () => {
  if (online.mode === "local") return;
  if (online.connection) online.connection.close();
  else {
    online.connected = false;
    online.phase = "reconnecting";
    closeAudioCall();
    renderOnline();
    renderGame();
  }
});

renderGame();
renderOnline();

const urlParams = new URLSearchParams(window.location.search);
const requestedRoom = urlParams.get("room");
if (requestedRoom) joinOnlineGame(requestedRoom, urlParams.get("player"));
