<script>
  import { onMount } from "svelte";

  import GameBoard from "./components/GameBoard.svelte";
  import OnlinePanel from "./components/OnlinePanel.svelte";
  import Scoreboard from "./components/Scoreboard.svelte";
  import {
    createGameState,
    makeMove,
    resetScore,
    restoreGame,
    serializeGame,
    startRound,
  } from "./game/game-state.js";
  import {
    clearMatchPath,
    createMatchUrls,
    createPlayerUrl,
    isValidMatchToken,
    matchPath,
    parseMatchRoute,
    roomIdForHostToken,
  } from "./online/match-url.js";
  import { createOnlineState, OnlineSession } from "./online/online-session.js";

  let game = $state(createGameState());
  let online = $state(createOnlineState());
  let movePending = $state(false);
  let remoteAudio = $state();
  let session;

  let waiting = $derived(online.mode !== "local" && !online.connected);
  let canMove = $derived(
    !game.gameOver
      && (online.mode === "local"
        || (online.connected && game.currentPlayer === online.localPlayer && !movePending)),
  );

  function randomToken(prefix) {
    if (crypto.randomUUID) return `${prefix}${crypto.randomUUID()}`;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return `${prefix}${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }

  function updateGame(change, broadcast = true) {
    game = change(game);
    movePending = false;
    if (broadcast) session?.broadcastState();
  }

  function playCell(index) {
    if (online.mode === "local") {
      game = makeMove(game, index, game.currentPlayer);
    } else if (!canMove) {
      return;
    } else if (online.mode === "host") {
      updateGame((current) => makeMove(current, index, online.localPlayer));
    } else if (session.send({ type: "move", index })) {
      movePending = true;
    }
  }

  function requestNewRound() {
    if (online.mode === "guest") session.send({ type: "new-round" });
    else updateGame(startRound, online.mode === "host");
  }

  function requestScoreReset() {
    if (online.mode === "guest") session.send({ type: "reset-score" });
    else updateGame(resetScore, online.mode === "host");
  }

  async function hostGame(roomId, hostToken) {
    game = createGameState();
    movePending = false;

    if (
      !isValidMatchToken(roomId)
      || !isValidMatchToken(hostToken)
      || await roomIdForHostToken(hostToken) !== roomId
    ) {
      session.host("", "");
      return;
    }

    const { hostUrl, inviteUrl } = createMatchUrls(window.location.href, { roomId, hostToken });
    window.history.replaceState({}, "", matchPath(hostUrl));
    session.host(roomId, inviteUrl);
  }

  async function createOnlineGame() {
    const hostToken = randomToken("h-");
    await hostGame(await roomIdForHostToken(hostToken), hostToken);
  }

  function joinGame(roomId, guestToken) {
    game = createGameState();
    movePending = false;

    if (isValidMatchToken(roomId) && guestToken === null) {
      guestToken = randomToken("p-");
    }
    if (isValidMatchToken(roomId) && isValidMatchToken(guestToken)) {
      const playerUrl = createPlayerUrl(window.location.href, {
        roomId,
        playerToken: guestToken,
      });
      window.history.replaceState({}, "", matchPath(playerUrl));
    }
    session.join(roomId, guestToken);
  }

  function leaveGame() {
    session.leave();
    game = createGameState();
    movePending = false;
    window.history.replaceState({}, "", clearMatchPath(window.location.href));
  }

  async function shareGame() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Морски шах",
          text: "Играй морски шах с мен!",
          url: online.inviteUrl,
        });
        return "Линкът е споделен ✓";
      }
      await copyInviteLink();
      return "Линкът е копиран ✓";
    } catch (error) {
      return error.name === "AbortError" ? "Сподели линка" : "Неуспешно — опитай пак";
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

  onMount(() => {
    session = new OnlineSession({
      getRemoteAudio: () => remoteAudio,
      getGameState: () => serializeGame(game),
      onChange: (state) => {
        online = state;
        if (!state.connected) movePending = false;
      },
      onState: (state) => {
        const restored = restoreGame(state);
        if (restored) {
          game = restored;
          movePending = false;
        }
      },
      onMove: (index, player) => updateGame((current) => makeMove(current, index, player), false),
      onNewRound: () => updateGame(startRound, false),
      onResetScore: () => updateGame(resetScore, false),
    });

    const route = parseMatchRoute(window.location.search);
    if (route?.valid && route.role === "host") hostGame(route.roomId, route.hostToken);
    else if (route?.valid) joinGame(route.roomId, route.guestToken);
    else if (route) session.join("", null);

    const handleOnline = () => session.handleOnline();
    const handleOffline = () => session.handleOffline();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      session.destroy();
    };
  });
</script>

<main class="game-shell">
  <Scoreboard
    {game}
    {online}
    {waiting}
    onReset={requestScoreReset}
    onAudio={() => session.toggleAudio()}
  />
  <OnlinePanel
    {online}
    onCreate={createOnlineGame}
    onShare={shareGame}
    onLeave={leaveGame}
  />
  <GameBoard {game} {online} {canMove} {waiting} onPlay={playCell} onNewRound={requestNewRound} />
</main>

<div class="background-shape shape-one" aria-hidden="true"></div>
<div class="background-shape shape-two" aria-hidden="true"></div>
<audio id="remote-audio" autoplay playsinline bind:this={remoteAudio}></audio>
