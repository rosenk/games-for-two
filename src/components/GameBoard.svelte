<script>
  import "../game/views.ts";
  import { getGame } from "../game/catalog.ts";
  import { getGameView } from "../game/view-registry.ts";

  let { game, online, canMove, waiting, roundCountdown, onPlay, onNewRound } = $props();
  let view = $derived(getGameView(game.kind));
  let definition = $derived(getGame(game.kind));
  let Board = $derived(view.Board);

  const mark = (player) => player === "X" ? "×" : "○";
  const name = (player) => view.roleName(game, player);
  const localTurnMessage = "Ваш ред";
  const displayName = (player) => {
    if (online.mode === "local" || online.mode === "matching") return name(player);
    return player === online.localPlayer ? "Вие" : online.mode === "computer" ? "Компютърът" : "Противникът";
  };
  let reminderTurn = $derived(
    !definition.simultaneous && online.mode !== "local" && canMove
      && !online.audioEnabled && !online.audioBusy
      ? `${online.localPlayer}:${game.currentPlayer}:${view.reminderKey(game)}`
      : "",
  );

  let status = $derived.by(() => {
    if (waiting) {
      if (online.phase === "matching") return ["Търсим противник…", ""];
      if (online.phase === "creating") return ["Създаваме двубоя…", ""];
      if (online.mode === "host" && online.phase === "waiting") return ["Чакаме другия играч…", ""];
      if (online.phase === "joining") return ["Другият играч се включва…", ""];
      if (online.phase === "expired") return ["Двубоят изтече.", ""];
      if (online.phase === "error") return ["Няма връзка с двубоя.", ""];
      return ["Свързваме ви с двубоя…", ""];
    }
    const winner = view.winner(game);
    if (game.gameOver && winner) {
      const message = online.mode === "local"
        ? `${name(winner)} печели!`
        : winner === online.localPlayer ? "Вие печелите!" : online.mode === "computer" ? "Компютърът печели!" : "Противникът печели!";
      return [message, mark(winner)];
    }
    if (game.gameOver) return ["Равенство — чудесна игра!", ""];
    if (definition.simultaneous) return [view.simultaneousStatus, ""];
    if (online.mode === "local") return [`${name(game.currentPlayer)} е на ход`, mark(game.currentPlayer)];
    if (game.currentPlayer === online.localPlayer) return [localTurnMessage, mark(game.currentPlayer)];
    return [online.mode === "computer" ? "Компютърът мисли…" : "Ход на противника", mark(game.currentPlayer)];
  });

  $effect(() => {
    if (!reminderTurn) return;

    let reminder;
    const timer = window.setTimeout(() => {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
      reminder = new SpeechSynthesisUtterance(localTurnMessage);
      reminder.lang = "bg-BG";
      window.speechSynthesis.speak(reminder);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
      if (reminder) window.speechSynthesis.cancel();
    };
  });
</script>

<section class="play-area" aria-labelledby="game-status">
  <div
    class="turn-indicator"
    class:player-o={game.currentPlayer === "O"}
    class:finished={game.gameOver}
    class:waiting
  >
    <span class="turn-dot" aria-hidden="true"></span>
    <p id="game-status" aria-live="polite">
      {status[0]}{#if status[1]}{" "}<strong>{status[1]}</strong>{/if}
    </p>
  </div>

  <Board {game} {online} {canMove} {displayName} {onPlay} />

  <button
    class="new-round"
    type="button"
    hidden={!game.gameOver}
    onclick={onNewRound}
    disabled={waiting || !game.gameOver}
    aria-label={game.gameOver ? `Нов рунд след ${roundCountdown} секунди` : "Нов рунд"}
  >
    <span>{game.gameOver ? "Нов рунд след" : "Нов рунд"}</span>
    <span class="round-timer" aria-hidden="true">{game.gameOver ? `${roundCountdown} сек.` : "→"}</span>
  </button>
</section>
