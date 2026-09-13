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
    createMatchUrl,
    createRoomId,
    getOrCreateTabSecret,
    isRoomHost,
    matchPath,
    parseMatchRoute,
    playerTokenForRoom,
  } from "./online/match-url.js";
  import {
    loadHostedMatch,
    MATCH_INACTIVITY_TIMEOUT,
    pruneHostedMatches,
    removeHostedMatch,
    saveHostedMatch,
  } from "./online/match-store.js";
  import { Matchmaker } from "./online/matchmaker.js";
  import { createOnlineState, OnlineSession } from "./online/online-session.js";

  let game = $state(createGameState());
  let online = $state(createOnlineState());
  let matchmakingAvailable = $state(false);
  let movePending = $state(false);
  let roundCountdown = $state(5);
  let remoteAudio = $state();
  let session;
  let matchmaker;
  let tabSecret;
  let hostedRoomId = "";
  let hostedPlayerTokenHash = null;
  let hostedMatchUpdatedAt = 0;
  let shareableMatch = $state(true);

  let waiting = $derived(online.mode !== "local" && !online.connected);
  let canMove = $derived(
    !game.gameOver
      && (online.mode === "local"
        || (online.connected && game.currentPlayer === online.localPlayer && !movePending)),
  );

  $effect(() => {
    if (!game.gameOver || waiting) {
      roundCountdown = 5;
      return;
    }

    let secondsRemaining = 5;
    roundCountdown = secondsRemaining;
    const timer = window.setInterval(() => {
      secondsRemaining -= 1;
      roundCountdown = secondsRemaining;
      if (secondsRemaining === 0) {
        window.clearInterval(timer);
        if (online.mode !== "guest") requestNewRound();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  });

  function updateGame(change, broadcast = true) {
    game = change(game);
    movePending = false;
    if (session?.mode === "host") persistHostedMatch();
    if (broadcast) session?.broadcastState();
  }

  function persistHostedMatch() {
    if (!hostedRoomId) return;
    const record = saveHostedMatch(localStorage, hostedRoomId, {
      playerTokenHash: hostedPlayerTokenHash,
      game: serializeGame(game),
    });
    if (record) hostedMatchUpdatedAt = record.updatedAt;
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
    if (!game.gameOver) return;
    if (online.mode === "guest") session.send({ type: "new-round" });
    else updateGame(startRound, online.mode === "host");
  }

  function requestScoreReset() {
    if (online.mode === "guest") session.send({ type: "reset-score" });
    else updateGame(resetScore, online.mode === "host");
  }

  function hostGame(roomId, storedMatch = null, shareable = true) {
    game = restoreGame(storedMatch?.game) || createGameState();
    movePending = false;
    hostedRoomId = roomId;
    hostedPlayerTokenHash = storedMatch?.playerTokenHash || null;
    hostedMatchUpdatedAt = storedMatch?.updatedAt || 0;
    shareableMatch = shareable;

    const matchUrl = createMatchUrl(window.location.href, roomId);
    window.history.replaceState({}, "", matchPath(matchUrl));
    session.host(roomId, matchUrl, hostedPlayerTokenHash || "");
    persistHostedMatch();
  }

  async function createOnlineGame() {
    matchmaker.cancel();
    hostGame(await createRoomId(tabSecret));
    await shareGame();
  }

  async function findOpponent() {
    game = createGameState();
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;
    shareableMatch = false;
    matchmaker.search(await createRoomId(tabSecret));
  }

  async function joinGame(roomId) {
    game = createGameState();
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;

    const matchUrl = createMatchUrl(window.location.href, roomId);
    window.history.replaceState({}, "", matchPath(matchUrl));
    session.join(roomId, await playerTokenForRoom(tabSecret, roomId));
  }

  function leaveGame() {
    matchmaker.cancel();
    if (session.mode === "host") removeHostedMatch(localStorage, session.roomId);
    session.leave();
    game = createGameState();
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;
    shareableMatch = true;
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
    matchmaker = new Matchmaker({
      onWaiting: () => {
        online = { ...createOnlineState(), mode: "matching", phase: "matching" };
      },
      onMatched: ({ role, roomId }) => {
        if (role === "host") hostGame(roomId, null, false);
        else joinGame(roomId);
      },
      onError: (error) => {
        online = { ...createOnlineState(), phase: "error", error };
      },
    });
    matchmakingAvailable = matchmaker.configured;

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
      onOpponentAccepted: (playerTokenHash) => {
        hostedPlayerTokenHash = playerTokenHash;
        persistHostedMatch();
      },
      onActivity: persistHostedMatch,
      onRemoteLeave: () => {
        const findAnotherOpponent = !shareableMatch;
        leaveGame();
        if (findAnotherOpponent) findOpponent();
      },
    });

    tabSecret = getOrCreateTabSecret(sessionStorage);
    pruneHostedMatches(localStorage);
    const openMatchRoute = async () => {
      const route = parseMatchRoute(window.location.search);
      if (route?.valid && await isRoomHost(route.roomId, tabSecret)) {
        hostGame(route.roomId, loadHostedMatch(localStorage, route.roomId));
      }
      else if (route?.valid) await joinGame(route.roomId);
      else if (route) session.join("", null);
    };
    openMatchRoute();

    const expireInactiveMatch = () => {
      if (
        session.mode === "host"
        && hostedMatchUpdatedAt
        && Date.now() - hostedMatchUpdatedAt >= MATCH_INACTIVITY_TIMEOUT
      ) {
        removeHostedMatch(localStorage, hostedRoomId);
        hostedRoomId = "";
        hostedPlayerTokenHash = null;
        hostedMatchUpdatedAt = 0;
        game = createGameState();
        session.expire();
      }
    };
    const expiryTimer = window.setInterval(expireInactiveMatch, 60000);

    const handleOnline = () => {
      if (!matchmaker.active) session.handleOnline();
    };
    const handleOffline = () => {
      if (!matchmaker.active) session.handleOffline();
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.clearInterval(expiryTimer);
      matchmaker.cancel();
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
    {matchmakingAvailable}
    {shareableMatch}
    onCreate={createOnlineGame}
    onFind={findOpponent}
    onShare={shareGame}
    onLeave={leaveGame}
  />
  <GameBoard
    {game}
    {online}
    {canMove}
    {waiting}
    {roundCountdown}
    onPlay={playCell}
    onNewRound={requestNewRound}
  />
</main>

<div class="background-shape shape-one" aria-hidden="true"></div>
<div class="background-shape shape-two" aria-hidden="true"></div>
<audio id="remote-audio" autoplay playsinline bind:this={remoteAudio}></audio>
