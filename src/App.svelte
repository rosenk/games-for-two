<script>
  import { onMount, untrack } from "svelte";

  import GameBoard from "./components/GameBoard.svelte";
  import OnlinePanel from "./components/OnlinePanel.svelte";
  import Scoreboard from "./components/Scoreboard.svelte";
  import { computerDelay } from "./game/computer.ts";
  import {
    createGameState,
    makeMove,
    resetScore,
    restoreGame,
    serializeGame,
    startRound,
  } from "./game/game-state.ts";
  import "./game/views.ts";
  import { games, getGame, DEFAULT_GAME_KIND } from "./game/catalog.ts";
  import { getGameView } from "./game/view-registry.ts";
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
  let screen = $state("setup");
  let selectedGame = $state(DEFAULT_GAME_KIND);
  let selectedSizes = $state({});
  let selectedView = $derived(getGameView(selectedGame));
  let definition = $derived(getGame(game.kind));
  let selectedOpponent = $state("local");
  let selectedDotSide = $state("X");
  let computerGame = $state(false);
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
  let launchVersion = 0;

  let waiting = $derived(online.mode !== "local" && !online.connected);
  let canMove = $derived(
    !game.gameOver && definition.ready(game)
      && (computerGame ? definition.simultaneous || game.currentPlayer === selectedDotSide : online.mode === "local"
        || (online.connected && (definition.simultaneous || game.currentPlayer === online.localPlayer) && !movePending)),
  );
  let boardOnline = $derived(computerGame
    ? { ...online, mode: "computer", localPlayer: selectedDotSide, connected: true } : online);

  const chosenSize = () => selectedSizes[selectedGame] ?? getGame(selectedGame).defaultSize;

  $effect(() => {
    if (screen !== "play" || !computerGame || game.gameOver) return;
    if (definition.simultaneous ? !definition.ready(game) : game.currentPlayer === selectedDotSide) return;
    const player = selectedDotSide === "X" ? "O" : "X";
    const current = serializeGame(definition.view(game, player));
    const worker = new Worker(new URL("./game/computer.worker.ts", import.meta.url), { type: "module" });
    let ready = false;
    let move = null;
    const applyMove = () => {
      if (ready && move !== null) game = makeMove(game, move, player);
    };
    const timer = window.setTimeout(() => { ready = true; applyMove(); }, computerDelay(game, player));
    worker.onmessage = (event) => { move = event.data; applyMove(); };
    worker.postMessage(current);
    // A human answer, reset, new round or leaving cancels both thinking and delay.
    return () => { window.clearTimeout(timer); worker.terminate(); };
  });

  // Reveal the cards only when both players are present; no game clock is needed.
  $effect(() => {
    if (screen === "play" && !definition.ready(game)
      && online.mode !== "guest" && !waiting) {
      untrack(() => updateGame((current) => getGame(current.kind).reveal(current)));
    }
  });

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

  function playCell(index, player = game.currentPlayer) {
    if (!canMove) return;
    if (online.mode === "local") {
      game = makeMove(game, index, computerGame ? selectedDotSide : player);
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
    const restored = restoreGame(storedMatch?.game);
    game = restored?.kind === selectedGame && restored.boardSize === chosenSize()
      ? restored : createGameState(selectedGame, chosenSize());
    screen = "play";
    movePending = false;
    hostedRoomId = roomId;
    hostedPlayerTokenHash = storedMatch?.playerTokenHash || null;
    hostedMatchUpdatedAt = storedMatch?.updatedAt || 0;
    shareableMatch = shareable;

    const matchUrl = createMatchUrl(window.location.href, roomId, selectedGame, chosenSize());
    window.history.replaceState({}, "", matchPath(matchUrl));
    session.host(roomId, matchUrl, hostedPlayerTokenHash || "");
    if (!restored && shareable) {
      game = getGame(game.kind).configureHost(game, selectedDotSide, session.localPlayer);
    }
    persistHostedMatch();
  }

  async function createOnlineGame() {
    matchmaker.cancel();
    const version = launchVersion;
    const roomId = await createRoomId(tabSecret);
    if (version !== launchVersion) return;
    hostGame(roomId);
    await shareGame();
  }

  async function findOpponent() {
    const version = launchVersion;
    game = createGameState(selectedGame, chosenSize());
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;
    shareableMatch = false;
    const roomId = await createRoomId(tabSecret);
    if (version !== launchVersion) return;
    matchmaker.search(roomId, selectedGame, chosenSize());
  }

  async function joinGame(roomId) {
    game = createGameState(selectedGame, chosenSize());
    screen = "play";
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;

    const matchUrl = createMatchUrl(window.location.href, roomId, selectedGame, chosenSize());
    window.history.replaceState({}, "", matchPath(matchUrl));
    session.join(roomId, await playerTokenForRoom(tabSecret, roomId));
  }

  function leaveGame() {
    launchVersion += 1;
    computerGame = false;
    matchmaker.cancel();
    if (session.mode === "host") removeHostedMatch(localStorage, session.roomId);
    session.leave();
    game = createGameState(selectedGame, chosenSize());
    movePending = false;
    hostedRoomId = "";
    hostedPlayerTokenHash = null;
    hostedMatchUpdatedAt = 0;
    shareableMatch = true;
    window.history.replaceState({}, "", clearMatchPath(window.location.href));
  }

  function backToSetup() {
    leaveGame();
    screen = "setup";
  }

  function startGame() {
    computerGame = selectedOpponent === "computer";
    if (computerGame && selectedView.computerSide) selectedDotSide = selectedView.computerSide;
    game = createGameState(selectedGame, chosenSize());
    screen = "play";
    if (selectedOpponent === "invite") createOnlineGame();
    else if (selectedOpponent === "matching") findOpponent();
  }

  async function shareGame() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedView.shareTitle,
          text: selectedView.shareText,
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
    // iOS Safari needs a speech call within a gesture before delayed reminders.
    const unlockSpeech = () => {
      if (online.audioEnabled || online.audioBusy) return;
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
      const silence = new SpeechSynthesisUtterance(" ");
      silence.volume = 0;
      window.speechSynthesis.speak(silence);
      window.removeEventListener("click", unlockSpeech);
      window.removeEventListener("keydown", unlockSpeech);
    };
    window.addEventListener("click", unlockSpeech);
    window.addEventListener("keydown", unlockSpeech);

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
        screen = "setup";
      },
    });
    matchmakingAvailable = matchmaker.configured;

    session = new OnlineSession({
      getRemoteAudio: () => remoteAudio,
      getGameState: () => serializeGame(getGame(game.kind).view(game, session.localPlayer === "X" ? "O" : "X")),
      onChange: (state) => {
        online = state;
        if (!state.connected) movePending = false;
      },
      onState: (state) => {
        const restored = restoreGame(state, session.localPlayer);
        if (restored?.kind === selectedGame && restored.boardSize === chosenSize()) {
          game = restored;
          movePending = false;
        }
      },
      onMove: (index, player) => updateGame((current) => makeMove(current, index, player), false),
      onNewRound: () => { if (game.gameOver) updateGame(startRound, false); },
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
      if (route?.valid) {
        selectedGame = route.game;
        selectedSizes[route.game] = route.boardSize;
      }
      if (route?.valid && await isRoomHost(route.roomId, tabSecret)) {
        hostGame(route.roomId, loadHostedMatch(localStorage, route.roomId));
      }
      else if (route?.valid) await joinGame(route.roomId);
      else if (route) {
        screen = "play";
        session.join("", null);
      }
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
        game = createGameState(selectedGame, chosenSize());
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
      window.removeEventListener("click", unlockSpeech);
      window.removeEventListener("keydown", unlockSpeech);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.clearInterval(expiryTimer);
      matchmaker.cancel();
      session.destroy();
    };
  });
</script>

<main class="game-shell" class:arena={screen !== "setup"}>
  {#if screen === "setup"}
    <div class="setup-header">
      <p class="eyebrow">{games.length} игри · заедно или сам</p>
      <h1>Хайде да играем<span>.</span></h1>
      <p>Избери игра — с приятел или срещу компютъра.</p>
      {#if online.phase === "error"}<p class="setup-error" role="alert">{online.error}</p>{/if}
    </div>
    <section class="setup-section" aria-labelledby="choose-game">
      <div class="section-heading"><span>01</span><h2 id="choose-game">Избери игра</h2></div>
      <div class="game-options">
        {#each games as choice (choice.kind)}
          {@const view = getGameView(choice.kind)}
          <button class:selected={selectedGame === choice.kind} aria-pressed={selectedGame === choice.kind} type="button" onclick={() => selectedGame = choice.kind}>
            <span class={`option-art ${view.artClass}`} aria-hidden="true">{#each view.art as line, index}{#if index}<br />{/if}{line}{/each}</span>
            <strong>{view.title}</strong><small>{view.description}</small>
          </button>
        {/each}
      </div>
      {#if selectedView.sizePicker}
        <div class="size-picker" role="group" aria-label={selectedView.sizePicker.ariaLabel}>
          <span>{selectedView.sizePicker.label}</span>
          <div class="size-options">
            {#each getGame(selectedGame).sizes as size}
              {@const points = selectedView.sizePicker.displaySize(size)}
              <button type="button" class:selected={chosenSize() === size} aria-pressed={chosenSize() === size} onclick={() => selectedSizes[selectedGame] = size}>{points} × {points}</button>
            {/each}
          </div>
          {#if selectedView.sizePicker.hint}<small>{selectedView.sizePicker.hint(chosenSize())}</small>{/if}
          <small>По-големите дъски се плъзгат хоризонтално на тесен екран.</small>
        </div>
      {/if}
    </section>
    <section class="setup-section" aria-labelledby="choose-opponent">
      <div class="section-heading"><span>02</span><h2 id="choose-opponent">С кого ще играеш?</h2></div>
      <div class="opponent-options">
        <button class:selected={selectedOpponent === "computer"} aria-pressed={selectedOpponent === "computer"} type="button" onclick={() => selectedOpponent = "computer"}><strong>Срещу компютъра</strong><small>{selectedView.computerDescription}</small></button>
        <button class:selected={selectedOpponent === "local"} aria-pressed={selectedOpponent === "local"} type="button" onclick={() => selectedOpponent = "local"}><strong>На един екран</strong><small>{selectedView.localDescription}</small></button>
        <button class:selected={selectedOpponent === "invite"} aria-pressed={selectedOpponent === "invite"} type="button" onclick={() => selectedOpponent = "invite"}><strong>Покани приятел</strong><small>Сподели линк за онлайн игра</small></button>
        {#if matchmakingAvailable}<button class:selected={selectedOpponent === "matching"} aria-pressed={selectedOpponent === "matching"} type="button" onclick={() => selectedOpponent = "matching"}><strong>Намери играч</strong><small>Срещни непознат онлайн</small></button>{/if}
      </div>
    </section>
    {#if selectedView.sidePicker(selectedOpponent)}
      <div class="size-picker" role="group" aria-label="Твоята страна">
        <span>Твоята страна</span>
        <div class="size-options" style="grid-template-columns: repeat(2, 1fr)">
          <button type="button" class:selected={selectedDotSide === "X"} aria-pressed={selectedDotSide === "X"} onclick={() => selectedDotSide = "X"}>{selectedView.sideLabels.X}</button>
          <button type="button" class:selected={selectedDotSide === "O"} aria-pressed={selectedDotSide === "O"} onclick={() => selectedDotSide = "O"}>{selectedView.sideLabels.O}</button>
        </div>
        <small>{selectedView.sideHint}</small>
      </div>
    {/if}
    <button class="start-button" type="button" onclick={startGame}>Започни игра <span aria-hidden="true">→</span></button>
  {:else}
    <div class="play-topbar">
      <button type="button" class="back-button" onclick={backToSetup}>← Към игрите</button>
      <span>{getGameView(game.kind).playTitle(game)} <span aria-hidden="true">·</span> {computerGame ? "Срещу компютъра" : online.mode === "local" ? "На един екран" : shareableMatch ? "С приятел онлайн" : "С непознат онлайн"}</span>
    </div>
    <Scoreboard {game} online={boardOnline} {waiting} onReset={requestScoreReset} onAudio={() => session.toggleAudio()} />
    {#if online.mode !== "local"}
      <OnlinePanel {online} {matchmakingAvailable} {shareableMatch} onCreate={createOnlineGame} onFind={findOpponent} onShare={shareGame} onLeave={backToSetup} />
    {/if}
    <GameBoard {game} online={boardOnline} {canMove} {waiting} {roundCountdown} onPlay={playCell} onNewRound={requestNewRound} />
  {/if}
</main>

<div class="background-shape shape-one" aria-hidden="true"></div>
<div class="background-shape shape-two" aria-hidden="true"></div>
<audio id="remote-audio" autoplay playsinline bind:this={remoteAudio}></audio>
