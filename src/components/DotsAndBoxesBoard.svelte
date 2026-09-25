<script lang="ts">
  import type { GameState, Player } from "../game/game-state.ts";
  import { boxScore } from "../game/dots-and-boxes.ts";

  let { game, canMove, displayName, onPlay }: {
    game: GameState;
    canMove: boolean;
    displayName: (player: Player) => string;
    onPlay: (index: number) => void;
  } = $props();

  let lastMove = $state<number | null>(null);
  const step = 56;
  const inset = 14;
  let extent = $derived(game.boardSize * step + inset * 2);
  let previousBoard: GameState["board"] = [];
  $effect(() => {
    const board = game.board;
    const changed = board.flatMap((owner, index) => owner !== previousBoard[index] ? [index] : []);
    if (changed.length) {
      // Only identify a move we observed, not an arbitrary edge from a restored board.
      lastMove = changed.length === 1 && board[changed[0]] ? changed[0] : null;
    }
    previousBoard = [...board];
  });
</script>

<p class="rules">Свържи две точки. Затвори квадратче за 1 точка и още един ход.</p>
<p class="box-score" aria-live="polite">
  <span>× {boxScore(game.boxes!, "X")}</span>
  <span class="score-label">Квадратчета в рунда</span>
  <span>○ {boxScore(game.boxes!, "O")}</span>
</p>
<p class="move-hint">Последният ход е с бял контур.</p>
{#if game.boardSize > 4}<p class="pan-hint">← На тесен екран плъзни дъската →</p>{/if}
<div class="dots-scroll" role="region" aria-label="Дъска, плъзга се хоризонтално">
<svg class="dots-board" viewBox={`0 0 ${extent} ${extent}`} style={`min-width: ${extent}px`} role="group" aria-label={`Точки и квадратчета, ${game.boardSize + 1} на ${game.boardSize + 1} точки`}>
  {#each game.boxes! as owner, index}
    {@const x = inset + (index % game.boardSize + .5) * step}
    {@const y = inset + (Math.floor(index / game.boardSize) + .5) * step}
    <g class="box" class:x={owner === "X"} class:o={owner === "O"} role="img"
      aria-label={`Квадратче ${index + 1}${owner ? `: ${displayName(owner)}` : ": свободно"}`}>
      {#if owner}
        <rect x={x - 15} y={y - 15} width="30" height="30" rx="7" />
        {#if owner === "X"}
          <path d={`M${x - 6} ${y - 6}l12 12m0 -12l-12 12`} />
        {:else}
          <circle cx={x} cy={y} r="8" />
        {/if}
      {/if}
    </g>
  {/each}
  {#each game.board as owner, index}
    {@const horizontal = index < game.boardSize * (game.boardSize + 1)}
    {@const offset = horizontal ? index : index - game.boardSize * (game.boardSize + 1)}
    {@const row = Math.floor(offset / (horizontal ? game.boardSize : game.boardSize + 1))}
    {@const col = offset % (horizontal ? game.boardSize : game.boardSize + 1)}
    {@const x = inset + col * step}
    {@const y = inset + row * step}
    {@const path = horizontal ? `M${x + 12} ${y}h${step - 24}` : `M${x} ${y + 12}v${step - 24}`}
    {@const disabled = Boolean(owner) || !canMove}
    <g class="edge" class:horizontal class:x={owner === "X"} class:o={owner === "O"} class:last-move={index === lastMove}
      role="button" tabindex={disabled ? -1 : 0} aria-disabled={disabled}
      aria-label={`${horizontal ? "Хоризонтална" : "Вертикална"} чертичка, ред ${row + 1}, колона ${col + 1}${owner ? `: ${displayName(owner)}` : ""}${index === lastMove ? ", последен ход" : ""}`}
      onclick={() => { if (!disabled) onPlay(index); }}
      onkeydown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!disabled) onPlay(index);
        }
      }}>
      <rect class="hit" x={horizontal ? x + 8 : x - 14} y={horizontal ? y - 14 : y + 8}
        width={horizontal ? step - 16 : 28} height={horizontal ? 28 : step - 16} rx="6" />
      {#if index === lastMove}<path class="halo" d={path} />{/if}
      <path class="stroke" d={path} />
    </g>
  {/each}
  {#each Array((game.boardSize + 1) ** 2) as _, index}
    <circle class="dot" aria-hidden="true" cx={inset + index % (game.boardSize + 1) * step}
      cy={inset + Math.floor(index / (game.boardSize + 1)) * step} r="5" />
  {/each}
</svg>
</div>

<style>
  .rules { margin: 0 auto 16px; max-width: 400px; text-align: center; color: var(--muted); font-size: .85rem; line-height: 1.6; }
  .box-score { display: flex; justify-content: space-between; align-items: center; gap: 12px; max-width: 400px; margin: 0 auto 16px; font-size: 1.4rem; font-weight: 800; }
  .box-score > :first-child { color: var(--x); }
  .box-score > :last-child { color: var(--o); }
  .score-label { color: var(--muted); font-size: .7rem; font-weight: 600; }
  .move-hint { text-align: center; color: var(--muted); font-size: .7rem; margin: 0 0 8px; }
  .pan-hint { text-align: center; color: var(--muted); font-size: .7rem; margin: 0 0 8px; }
  .dots-scroll { width: 100%; overflow-x: auto; overscroll-behavior-x: contain; }
  .dots-board { display: block; width: min(100%, 400px); aspect-ratio: 1; margin: auto; }
  .dot { fill: #dbe5f1; pointer-events: none; }
  .edge { cursor: pointer; outline: none; color: #354458; }
  .x { color: var(--x); }
  .o { color: var(--o); }
  .hit { fill: transparent; }
  .edge path { fill: none; stroke-linecap: round; pointer-events: none; }
  .stroke { stroke: currentColor; stroke-width: 5; }
  .halo { stroke: #fff; stroke-width: 9; }
  .edge[aria-disabled="true"] { cursor: default; }
  .edge[aria-disabled="false"]:hover .stroke { stroke: #dbe5f1; }
  .edge:focus-visible .hit { stroke: var(--o); stroke-width: 2; }
  .box { pointer-events: none; }
  .box rect { fill: currentColor; fill-opacity: .15; }
  .box path, .box circle { fill: none; stroke: currentColor; stroke-width: 2.5; }
</style>
