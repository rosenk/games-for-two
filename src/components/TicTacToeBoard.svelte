<script lang="ts">
  import type { GameState, Player } from "../game/game-state.ts";
  import { cellLabels } from "../game/tic-tac-toe.ts";

  let { game, canMove, displayName, onPlay }: {
    game: GameState;
    canMove: boolean;
    displayName: (player: Player) => string;
    onPlay: (index: number) => void;
  } = $props();

  const mark = (player: Player) => player === "X" ? "×" : "○";
</script>

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
