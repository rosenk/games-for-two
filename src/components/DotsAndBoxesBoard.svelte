<script lang="ts">
  import type { GameState, Player } from "../game/game-state.ts";
  import { boxScore } from "../game/dots-and-boxes.ts";

  let { game, canMove, displayName, onPlay }: {
    game: GameState;
    canMove: boolean;
    displayName: (player: Player) => string;
    onPlay: (index: number) => void;
  } = $props();
</script>

<p class="rules">Свържи две точки. Затвори квадратче за 1 точка и още един ход.</p>
<p class="box-score" aria-live="polite">
  <span>× {boxScore(game.boxes!, "X")}</span>
  <span class="score-label">Квадратчета в рунда</span>
  <span>○ {boxScore(game.boxes!, "O")}</span>
</p>
{#if game.boardSize > 4}<p class="pan-hint">← На тесен екран плъзни дъската →</p>{/if}
<div class="dots-scroll" role="region" aria-label="Дъска, плъзга се хоризонтално">
<div class="dots-board" style={`--size: ${game.boardSize}; min-width: ${game.boardSize * 56 + 28}px`} role="group" aria-label={`Точки и квадратчета, ${game.boardSize + 1} на ${game.boardSize + 1} точки`}>
  {#each game.boxes! as owner, index}
    <div class="box" class:x={owner === "X"} class:o={owner === "O"}
      style={`grid-row: ${Math.floor(index / game.boardSize) * 2 + 2}; grid-column: ${index % game.boardSize * 2 + 2}`}
      aria-label={`Квадратче ${index + 1}${owner ? `: ${displayName(owner)}` : ": свободно"}`}>
      {owner === "X" ? "×" : owner === "O" ? "○" : ""}
    </div>
  {/each}
  {#each game.board as owner, index}
    {@const horizontal = index < game.boardSize * (game.boardSize + 1)}
    {@const offset = horizontal ? index : index - game.boardSize * (game.boardSize + 1)}
    {@const row = Math.floor(offset / (horizontal ? game.boardSize : game.boardSize + 1))}
    {@const col = offset % (horizontal ? game.boardSize : game.boardSize + 1)}
    <button type="button" class="edge" class:horizontal class:x={owner === "X"} class:o={owner === "O"}
      style={`grid-row: ${row * 2 + (horizontal ? 1 : 2)}; grid-column: ${col * 2 + (horizontal ? 2 : 1)}`}
      aria-label={`${horizontal ? "Хоризонтална" : "Вертикална"} чертичка, ред ${row + 1}, колона ${col + 1}${owner ? `: ${displayName(owner)}` : ""}`}
      disabled={Boolean(owner) || !canMove} onclick={() => onPlay(index)}><span></span></button>
  {/each}
  {#each Array((game.boardSize + 1) ** 2) as _, index}
    <span class="dot" aria-hidden="true" style={`grid-row: ${Math.floor(index / (game.boardSize + 1)) * 2 + 1}; grid-column: ${index % (game.boardSize + 1) * 2 + 1}`}></span>
  {/each}
</div>
</div>

<style>
  .rules { margin: 0 auto 16px; max-width: 400px; text-align: center; color: var(--muted); font-size: .85rem; line-height: 1.6; }
  .box-score { display: flex; justify-content: space-between; align-items: center; gap: 12px; max-width: 400px; margin: 0 auto 16px; font-size: 1.4rem; font-weight: 800; }
  .box-score > :first-child { color: var(--x); }
  .box-score > :last-child { color: var(--o); }
  .score-label { color: var(--muted); font-size: .7rem; font-weight: 600; }
  .pan-hint { text-align: center; color: var(--muted); font-size: .7rem; margin: 0 0 8px; }
  .dots-scroll { width: 100%; overflow-x: auto; overscroll-behavior-x: contain; }
  .dots-board { display: grid; grid-template-columns: repeat(var(--size), 28px 1fr) 28px; grid-template-rows: repeat(var(--size), 28px 1fr) 28px; width: min(100%, 400px); aspect-ratio: 1; margin: auto; }
  .dot { width: 10px; height: 10px; place-self: center; border-radius: 50%; background: #dbe5f1; pointer-events: none; z-index: 1; }
  .edge { display: grid; place-items: center; border: 0; padding: 0; background: transparent; cursor: pointer; border-radius: 6px; }
  .edge span { height: 100%; width: 5px; background: #354458; border-radius: 4px; }
  .edge.horizontal span { width: 100%; height: 5px; }
  .edge.x span { background: var(--x); }
  .edge.o span { background: var(--o); }
  .edge:disabled { cursor: default; }
  .edge:not(:disabled):hover span { background: #dbe5f1; }
  .edge:focus-visible { outline: 2px solid var(--o); outline-offset: 1px; }
  .box { display: grid; place-items: center; border-radius: 8px; font-size: 2rem; }
  .box.x { color: var(--x); background: color-mix(in srgb, var(--x) 15%, transparent); }
  .box.o { color: var(--o); background: color-mix(in srgb, var(--o) 15%, transparent); }
</style>
