<script lang="ts">
  import type { GameState, Player } from "../game-state.ts";
  import { CONNECT_COLUMNS, CONNECT_ROWS } from "./rules.ts";

  let { game, canMove, displayName, onPlay }: {
    game: GameState; canMove: boolean; displayName: (player: Player) => string; onPlay: (column: number) => void;
  } = $props();
</script>

<div class="connect-game">
  <p class="instructions">Избери колона. Четири пула в редица печелят.</p>
  <div class="connect-board" role="group" aria-label="Четири в редица: 7 колони и 6 реда">
    {#each Array(CONNECT_COLUMNS) as _, column}
      <button type="button" class="column" disabled={!canMove || Boolean(game.board[column])}
        aria-label={`Пусни пул в колона ${column + 1}${game.board[column] ? " — пълна" : ""}`}
        onclick={() => onPlay(column)}>
        <span class="arrow" aria-hidden="true">↓</span>
        {#each Array(CONNECT_ROWS) as _, row}
          {@const index = row * CONNECT_COLUMNS + column}
          {@const owner = game.board[index]}
          <span class="slot" class:x={owner === "X"} class:o={owner === "O"}
            class:winner={Boolean(game.winningLine?.includes(index))}
            aria-label={`Ред ${row + 1}: ${owner ? displayName(owner) : "свободно"}`}>
            {#key owner}
              {#if owner}<span class="disc" style={`--drop: ${row + 1}`} aria-hidden="true">{owner === "X" ? "×" : "○"}</span>{/if}
            {/key}
          </span>
        {/each}
      </button>
    {/each}
  </div>
  <details>
    <summary>Как се играе?</summary>
    <p>Редувайте се да пускате по един пул в свободна колона. Пулът пада до най-ниското свободно място.
      Печели първият с четири свои пула хоризонтално, вертикално или диагонално.
      Ако полето се запълни без победител, рундът е равен.</p>
  </details>
</div>

<style>
  .connect-game { width: 100%; max-width: 500px; margin: auto; }
  .instructions { text-align: center; color: var(--muted); font-size: .9rem; line-height: 1.5; margin: 14px 0; }
  .connect-board { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; padding: 10px; border: 1px solid #557881; border-radius: 22px; background: linear-gradient(135deg, #34545d, #1b343e); box-shadow: inset 0 2px 0 #ffffff25, 0 10px 0 #0a1b24, 0 20px 30px #0005; }
  .column { display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 0; padding: 4px 2px 8px; border: 0; border-radius: 10px; background: transparent; color: #b8ccec; cursor: pointer; touch-action: manipulation; }
  .arrow { font-size: 24px; line-height: 1.2; }
  .slot { display: grid; place-items: center; width: 100%; aspect-ratio: 1; border-radius: 50%; background: #0a1520; box-shadow: inset 0 4px 8px #0009, 0 1px 0 #ffffff20; font-size: clamp(18px, 5vw, 32px); font-weight: 700; }
  .disc { display: grid; place-items: center; width: 94%; aspect-ratio: 1; border-radius: 50%; box-shadow: inset 0 2px 3px #ffffff70, inset 0 -4px 3px #0003, 0 3px 5px #0006; animation: drop-disc 360ms cubic-bezier(.3,.7,.4,1); }
  .slot.x .disc { background: radial-gradient(circle at 35% 25%, #ffba91, var(--x) 70%); color: #702d23; }
  .slot.o .disc { background: radial-gradient(circle at 35% 25%, #b2f6e8, var(--o) 70%); color: #14564d; }
  @keyframes drop-disc { from { transform: translateY(calc(var(--drop) * -110%)); opacity: .4; } to { transform: translateY(0); opacity: 1; } }
  .slot.winner { outline: 3px solid #fff; outline-offset: -3px; box-shadow: 0 0 12px #ffffff70; }
  .column:enabled:hover { background: #ffffff12; }
  .column:enabled:hover .arrow { color: white; }
  .column:focus-visible { outline: 2px solid white; outline-offset: 2px; }
  .column:disabled { cursor: default; }
  .column:disabled .arrow { opacity: .25; }
  details { margin: 18px 8px; color: var(--muted); font-size: .82rem; line-height: 1.6; }
  summary { cursor: pointer; color: #d2dbea; }
</style>
