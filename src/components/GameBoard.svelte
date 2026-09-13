<script>
  import { cellLabels } from "../game/game-state.js";

  let { game, online, canMove, waiting, roundCountdown, onPlay, onNewRound } = $props();

  const mark = (player) => player === "X" ? "×" : "○";
  const name = (player) => player === "X" ? "Играч 1" : "Играч 2";
  const displayName = (player) => {
    if (online.mode === "local" || online.mode === "matching") return name(player);
    return player === online.localPlayer ? "Вие" : "Противникът";
  };

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
    if (game.gameOver && game.winningLine) {
      const winner = game.board[game.winningLine[0]];
      const message = online.mode === "local"
        ? `${name(winner)} печели!`
        : winner === online.localPlayer ? "Вие печелите!" : "Противникът печели!";
      return [message, mark(winner)];
    }
    if (game.gameOver) return ["Равенство — чудесна игра!", ""];
    if (online.mode === "local") return [`${name(game.currentPlayer)} е на ход`, mark(game.currentPlayer)];
    if (game.currentPlayer === online.localPlayer) return ["Ваш ред", mark(game.currentPlayer)];
    return ["Ход на противника", mark(game.currentPlayer)];
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

  <div class="board" role="grid" aria-label="Дъска за морски шах">
    {#each game.board as value, index}
      <button
        class="cell"
        class:x={value === "X"}
        class:o={value === "O"}
        class:marked={Boolean(value)}
        class:winner={Boolean(game.winningLine?.includes(index))}
        type="button"
        role="gridcell"
        aria-label={value ? `${cellLabels[index]}: ${displayName(value)} ${mark(value)}` : cellLabels[index]}
        disabled={Boolean(value) || !canMove}
        onclick={() => onPlay(index)}
      >{value ? mark(value) : ""}</button>
    {/each}
  </div>

  <button
    class="new-round"
    type="button"
    onclick={onNewRound}
    disabled={waiting || !game.gameOver}
    aria-label={game.gameOver ? `Нов рунд след ${roundCountdown} секунди` : "Нов рунд"}
  >
    <span>{game.gameOver ? "Нов рунд след" : "Нов рунд"}</span>
    <span class="round-timer" aria-hidden="true">{game.gameOver ? `${roundCountdown} сек.` : "→"}</span>
  </button>
</section>
