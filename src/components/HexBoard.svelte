<script lang="ts">
  import type { GameState, Player } from "../game/game-state.ts";

  let { game, canMove, displayName, onPlay }: {
    game: GameState;
    canMove: boolean;
    displayName: (player: Player) => string;
    onPlay: (index: number) => void;
  } = $props();

  const mark = (player: Player) => player === "X" ? "×" : "○";
</script>

<p class="hex-rules"><span>× Свържи горе ↕ долу</span><span>○ Свържи ляво ↔ дясно</span></p>
{#if game.boardSize > 5}<p class="hex-pan-hint">← Плъзни дъската, за да видиш всички клетки →</p>{/if}
<div class="hex-scroll" role="region" aria-label="Дъска за Hex, плъзга се хоризонтално">
  <div class="hex-board size-{game.boardSize}" role="grid" aria-label={`Дъска за Hex, ${game.boardSize} на ${game.boardSize}`}>
    {#each Array(game.boardSize) as _, row}
      <div class="hex-row" role="row" style={`--row: ${row}`}>
        {#each game.board.slice(row * game.boardSize, (row + 1) * game.boardSize) as value, col}
          {@const index = row * game.boardSize + col}
          <button
            class="hex-cell"
            class:x={value === "X"}
            class:o={value === "O"}
            class:winner={Boolean(game.winningLine?.includes(index))}
            type="button"
            role="gridcell"
            aria-label={`Ред ${row + 1}, колона ${col + 1}${value ? `: ${displayName(value)}` : ""}`}
            disabled={Boolean(value) || !canMove}
            onclick={() => onPlay(index)}
          ><span aria-hidden="true">{value ? mark(value) : ""}</span></button>
        {/each}
      </div>
    {/each}
  </div>
</div>
