<script lang="ts">
  import type { GameState, Player } from "../game/game-state.ts";
  import { SYMBOL_CARDS, SYMBOLS, SYMBOL_TARGET } from "../game/common-symbol.ts";
  import { boxScore } from "../game/dots-and-boxes.ts";

  let { game, online, canMove, displayName, onPlay }: {
    game: GameState;
    online: { mode: string; localPlayer: Player };
    canMove: boolean;
    displayName: (player: Player) => string;
    onPlay: (index: number, player: Player) => void;
  } = $props();
  // Permute positions per card and pair identically on both clients.
  const symbols = (side: number) => {
    const card = SYMBOL_CARDS[game.deck![side]];
    const offset = (game.deck![side] + game.board.length * 3) % 8;
    return Array.from({ length: 8 }, (_, i) => card[(i * 3 + offset) % 8]);
  };
</script>

<div class="symbol-game">
  <p class="rules">Намерете общия символ едновременно! Верен избор: точка за теб; грешен: точка за противника.
    След всеки избор — нови карти. Първият с {SYMBOL_TARGET} точки печели.
    {online.mode === "local" ? "Всеки натиска само своята карта." : "Натисни на която и да е карта."}</p>
  <div class="round-score">
    <span aria-label="Точки на играч 1">× {boxScore(game.board, "X")}</span>
    <strong class="target">Първи до {SYMBOL_TARGET}</strong>
    <span aria-label="Точки на играч 2">○ {boxScore(game.board, "O")}</span>
  </div>
  <div class="cards">
    {#each [0, 1] as side}
      {@const player: Player = online.mode === "local" ? (side === 0 ? "X" : "O") : online.localPlayer}
      <div class="zone" class:player-o={side === 1}>
        <div class="symbol-card" role="group" aria-label={`Карта ${side + 1}`}>
          {#if game.started}
            {#each symbols(side) as symbol, position}
              <button type="button" disabled={!canMove} aria-label={SYMBOLS[symbol][1]}
                style={`--tilt: ${(symbol * 17 + game.board.length * 11 + side * 23) % 71 - 35}deg; --scale: ${.72 + ((symbol + position + side) % 4) * .09}; grid-area: ${Math.floor((position < 4 ? position : position + 1) / 3) + 1} / ${(position < 4 ? position : position + 1) % 3 + 1}`}
                onpointerdown={(event) => { if (event.button === 0) { event.preventDefault(); onPlay(game.board.length * SYMBOLS.length + symbol, player); } }}
                onclick={(event) => { if (event.detail === 0) onPlay(game.board.length * SYMBOLS.length + symbol, player); }}>
                <span aria-hidden="true">{SYMBOLS[symbol][0]}</span>
              </button>
            {/each}
          {:else}<span class="waiting-card">?</span>{/if}
        </div>
      </div>
    {/each}
  </div>
  <p class="feedback" aria-live="polite">
    {game.gameOver ? `${displayName(game.board.at(-1)!)} достигна ${SYMBOL_TARGET} точки!` : game.board.length ? `Последна точка: ${displayName(game.board.at(-1)!)}.` : "Първият верен избор печели точката."}
  </p>
</div>

<style>
  .symbol-game { width: 100%; max-width: 620px; margin: auto; }
  .rules, .feedback { color: #aeb9ca; text-align: center; font-size: .8rem; line-height: 1.5; }
  .rules { margin: 0 0 12px; }
  .round-score { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 1.6rem; font-weight: 800; }
  .round-score > span:first-child { color: var(--x); }
  .round-score > span:last-child { color: var(--o); }
  .target { font-size: .85rem; color: var(--muted); }
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .zone { min-width: 0; color: var(--x); }
  .player-o { color: var(--o); }
  .symbol-card { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); aspect-ratio: 1; border-radius: 50%; background: #fff5df; padding: 9%; box-shadow: 0 0 0 3px currentColor; }
  .player-o .symbol-card { background: #e1f6f0; }
  button { border: 0; background: transparent; border-radius: 14px; padding: 0; min-width: 0; min-height: 44px; cursor: pointer; touch-action: none; user-select: none; }
  button span { display: block; font-size: clamp(1.6rem, 5.5vw, 3.1rem); transform: rotate(var(--tilt)) scale(var(--scale)); pointer-events: none; }
  button:enabled:hover { background: #0001; }
  button:focus-visible { outline: 3px solid #315d79; }
  button:disabled { cursor: default; }
  .waiting-card { grid-area: 2 / 2; text-align: center; font-size: 2rem; }
  .feedback { margin: 8px 0 0; }
  @media (max-width: 420px) {
    .cards { gap: 10px; }
    .symbol-card { padding: 5%; }
    .rules { font-size: .72rem; }
    button { min-height: 40px; }
  }
</style>
