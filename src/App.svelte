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
  import { DEFAULT_HEX_SIZE, HEX_SIZES } from "./game/hex.ts";
  import { DOTS_SIZES } from "./game/dots-and-boxes.ts";
  import { SYMBOL_TARGET } from "./game/common-symbol.ts";
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
  let selectedGame = $state("tic-tac-toe");
  let selectedHexSize = $state(DEFAULT_HEX_SIZE);
  let selectedDotsSize = $state(3);
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
    !game.gameOver
      && (computerGame ? game.kind === "common-symbol" || game.currentPlayer === selectedDotSide : online.mode === "local"
        || (online.connected && (game.kind === "common-symbol" || game.currentPlayer === online.localPlayer) && !movePending)),
  );
  let boardOnline = $derived(computerGame
    ? { ...online, mode: "computer", localPlayer: selectedDotSide, connected: true } : online);

  const chosenSize = () => selectedGame === "hex" ? selectedHexSize : selectedGame === "dots-and-boxes" ? selectedDotsSize : 3;

  $effect(() => {
    if (screen !== "play" || !computerGame || game.gameOver) return;
    const simultaneous = game.kind === "common-symbol";
    if (simultaneous ? !game.started : game.currentPlayer === selectedDotSide) return;
    const current = serializeGame(game);
    const player = selectedDotSide === "X" ? "O" : "X";
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
    if (screen === "play" && game.kind === "common-symbol" && !game.started
      && online.mode !== "guest" && !waiting) {
      untrack(() => updateGame((current) => ({ ...current, started: true })));
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
    if (selectedGame === "circle-the-dot" && !restored && shareable) {
      const blocker = selectedDotSide === "X" ? session.localPlayer : session.localPlayer === "X" ? "O" : "X";
      game = { ...game, dotGame: { ...game.dotGame, blocker }, currentPlayer: blocker };
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
    if (computerGame && selectedGame === "common-symbol") selectedDotSide = "X";
    game = createGameState(selectedGame, chosenSize());
    screen = "play";
    if (selectedOpponent === "invite") createOnlineGame();
    else if (selectedOpponent === "matching") findOpponent();
  }

  async function shareGame() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedGame === "circle-the-dot" ? "Огради точката" : selectedGame === "common-symbol" ? "Общ символ" : selectedGame === "dots-and-boxes" ? "Точки и квадратчета" : selectedGame === "hex" ? "Hex" : "Морски шах",
          text: `Играй ${selectedGame === "circle-the-dot" ? "Огради точката" : selectedGame === "common-symbol" ? "Общ символ" : selectedGame === "dots-and-boxes" ? "Точки и квадратчета" : selectedGame === "hex" ? "Hex" : "морски шах"} с мен!`,
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
      getGameState: () => serializeGame(game),
      onChange: (state) => {
        online = state;
        if (!state.connected) movePending = false;
      },
      onState: (state) => {
        const restored = restoreGame(state);
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
        if (route.game === "hex") selectedHexSize = route.boardSize;
        if (route.game === "dots-and-boxes") selectedDotsSize = route.boardSize;
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

<main class="game-shell">
  {#if screen === "setup"}
    <div class="setup-header">
      <p class="eyebrow">Пет игри · заедно или сам</p>
      <h1>Хайде да играем<span>.</span></h1>
      <p>Избери игра — с приятел или срещу компютъра.</p>
      {#if online.phase === "error"}<p class="setup-error" role="alert">{online.error}</p>{/if}
    </div>
    <section class="setup-section" aria-labelledby="choose-game">
      <div class="section-heading"><span>01</span><h2 id="choose-game">Избери игра</h2></div>
      <div class="game-options">
        <button class:selected={selectedGame === "tic-tac-toe"} aria-pressed={selectedGame === "tic-tac-toe"} type="button" onclick={() => selectedGame = "tic-tac-toe"}>
          <span class="option-art tic-art" aria-hidden="true">× ○<br />○ ×</span>
          <strong>Морски шах</strong><small>Подреди три знака в редица на поле 3 × 3.</small>
        </button>
        <button class:selected={selectedGame === "hex"} aria-pressed={selectedGame === "hex"} type="button" onclick={() => selectedGame = "hex"}>
          <span class="option-art hex-art" aria-hidden="true">⬡ ⬡<br /> ⬡ ⬡</span>
          <strong>Hex</strong><small>Свържи срещуположните страни.</small>
        </button>
        <button class:selected={selectedGame === "dots-and-boxes"} aria-pressed={selectedGame === "dots-and-boxes"} type="button" onclick={() => selectedGame = "dots-and-boxes"}>
          <span class="option-art" aria-hidden="true">•—•<br />•—•</span>
          <strong>Точки и квадратчета</strong><small>Затвори квадратче и играй пак.</small>
        </button>
        <button class:selected={selectedGame === "common-symbol"} aria-pressed={selectedGame === "common-symbol"} type="button" onclick={() => selectedGame = "common-symbol"}>
          <span class="option-art" aria-hidden="true">☀️ 🌸</span>
          <strong>Общ символ</strong><small>8 символа. Първи до {SYMBOL_TARGET} точки!</small>
        </button>
        <button class:selected={selectedGame === "circle-the-dot"} aria-pressed={selectedGame === "circle-the-dot"} type="button" onclick={() => selectedGame = "circle-the-dot"}>
          <span class="option-art" aria-hidden="true">🟠 🔵 🟠</span>
          <strong>Огради точката</strong><small>Ограждай или бягай. Сам или с приятел.</small>
        </button>
      </div>
      {#if selectedGame === "hex" || selectedGame === "dots-and-boxes"}
        <div class="size-picker" role="group" aria-label={selectedGame === "hex" ? "Размер на дъската за Hex" : "Размер на дъската за Точки и квадратчета"}>
          <span>{selectedGame === "hex" ? "Размер на дъската" : "Брой точки на страна"}</span>
          <div class="size-options">
            {#each selectedGame === "hex" ? HEX_SIZES : DOTS_SIZES as size}
              {@const points = selectedGame === "hex" ? size : size + 1}
              <button type="button" class:selected={chosenSize() === size} aria-pressed={chosenSize() === size} onclick={() => selectedGame === "hex" ? selectedHexSize = size : selectedDotsSize = size}>{points} × {points}</button>
            {/each}
          </div>
          {#if selectedGame === "dots-and-boxes"}<small>{selectedDotsSize ** 2} квадратчета за завладяване.</small>{/if}
          <small>По-големите дъски се плъзгат хоризонтално на тесен екран.</small>
        </div>
      {/if}
    </section>
    <section class="setup-section" aria-labelledby="choose-opponent">
      <div class="section-heading"><span>02</span><h2 id="choose-opponent">С кого ще играеш?</h2></div>
      <div class="opponent-options">
        <button class:selected={selectedOpponent === "computer"} aria-pressed={selectedOpponent === "computer"} type="button" onclick={() => selectedOpponent = "computer"}><strong>Срещу компютъра</strong><small>{selectedGame === "common-symbol" ? "Умен бот с човешко темпо" : selectedGame === "circle-the-dot" ? "Избери оградата или точката" : "Силен бот, който мисли напред"}</small></button>
        <button class:selected={selectedOpponent === "local"} aria-pressed={selectedOpponent === "local"} type="button" onclick={() => selectedOpponent = "local"}><strong>На един екран</strong><small>{selectedGame === "common-symbol" ? "Играйте едновременно, всеки в своята зона" : "Редувайте се на това устройство"}</small></button>
        <button class:selected={selectedOpponent === "invite"} aria-pressed={selectedOpponent === "invite"} type="button" onclick={() => selectedOpponent = "invite"}><strong>Покани приятел</strong><small>Сподели линк за онлайн игра</small></button>
        {#if matchmakingAvailable}<button class:selected={selectedOpponent === "matching"} aria-pressed={selectedOpponent === "matching"} type="button" onclick={() => selectedOpponent = "matching"}><strong>Намери играч</strong><small>Срещни непознат онлайн</small></button>{/if}
      </div>
    </section>
    {#if (selectedOpponent === "computer" && selectedGame !== "common-symbol") || (selectedGame === "circle-the-dot" && selectedOpponent === "invite")}
      <div class="size-picker" role="group" aria-label="Твоята страна">
        <span>Твоята страна</span>
        <div class="size-options" style="grid-template-columns: repeat(2, 1fr)">
          <button type="button" class:selected={selectedDotSide === "X"} aria-pressed={selectedDotSide === "X"} onclick={() => selectedDotSide = "X"}>{selectedGame === "circle-the-dot" ? "🟠 Ограждай" : "× Играй с X"}</button>
          <button type="button" class:selected={selectedDotSide === "O"} aria-pressed={selectedDotSide === "O"} onclick={() => selectedDotSide = "O"}>{selectedGame === "circle-the-dot" ? "🔵 Бягай" : "○ Играй с O"}</button>
        </div>
        <small>{selectedGame === "circle-the-dot" ? "Ограждащият винаги започва. Точката се мести с една стъпка." : "X започва първия рунд. После се редувате кой започва."}</small>
      </div>
    {/if}
    <button class="start-button" type="button" onclick={startGame}>Започни игра <span aria-hidden="true">→</span></button>
  {:else}
    <div class="play-topbar">
      <button type="button" class="back-button" onclick={backToSetup}>← Към игрите</button>
      <span>{game.kind === "circle-the-dot" ? "Огради точката" : game.kind === "common-symbol" ? "Общ символ" : game.kind === "dots-and-boxes" ? `Точки и квадратчета ${game.boardSize + 1} × ${game.boardSize + 1}` : game.kind === "hex" ? `Hex ${game.boardSize} × ${game.boardSize}` : "Морски шах"} <span aria-hidden="true">·</span> {computerGame ? "Срещу компютъра" : online.mode === "local" ? "На един екран" : shareableMatch ? "С приятел онлайн" : "С непознат онлайн"}</span>
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
