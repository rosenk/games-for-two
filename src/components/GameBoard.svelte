<script>
  import HexBoard from "./HexBoard.svelte";
  import TicTacToeBoard from "./TicTacToeBoard.svelte";
  import DotsAndBoxesBoard from "./DotsAndBoxesBoard.svelte";
  import CommonSymbolBoard from "./CommonSymbolBoard.svelte";
  import { boxesWinner } from "../game/dots-and-boxes.ts";

  let { game, online, canMove, waiting, roundCountdown, onPlay, onNewRound } = $props();

  const mark = (player) => player === "X" ? "×" : "○";
  const name = (player) => player === "X" ? "Играч 1" : "Играч 2";
  const localTurnMessage = "Ваш ред";
  const displayName = (player) => {
    if (online.mode === "local" || online.mode === "matching") return name(player);
    return player === online.localPlayer ? "Вие" : "Противникът";
  };
  let reminderTurn = $derived(
    game.kind !== "common-symbol" && online.mode !== "local" && canMove
      ? `${online.localPlayer}:${game.currentPlayer}:${game.board.map((cell) => cell || "-").join("")}`
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
    const winner = game.kind === "common-symbol" ? boxesWinner(game.board) : game.kind === "dots-and-boxes" ? boxesWinner(game.boxes) : game.winningLine ? game.board[game.winningLine[0]] : null;
    if (game.gameOver && winner) {
      const message = online.mode === "local"
        ? `${name(winner)} печели!`
        : winner === online.localPlayer ? "Вие печелите!" : "Противникът печели!";
      return [message, mark(winner)];
    }
    if (game.gameOver) return ["Равенство — чудесна игра!", ""];
    if (game.kind === "common-symbol") return ["Кой ще открие символа пръв?", ""];
    if (online.mode === "local") return [`${name(game.currentPlayer)} е на ход`, mark(game.currentPlayer)];
    if (game.currentPlayer === online.localPlayer) return [localTurnMessage, mark(game.currentPlayer)];
    return ["Ход на противника", mark(game.currentPlayer)];
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

  {#if game.kind === "hex"}
    <HexBoard {game} {canMove} {displayName} {onPlay} />
  {:else if game.kind === "dots-and-boxes"}
    <DotsAndBoxesBoard {game} {canMove} {displayName} {onPlay} />
  {:else if game.kind === "common-symbol"}
    <CommonSymbolBoard {game} {online} {canMove} {displayName} {onPlay} />
  {:else}
    <TicTacToeBoard {game} {canMove} {displayName} {onPlay} />
  {/if}

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
