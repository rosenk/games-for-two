<script lang="ts">
  import { dotNeighbors, DOT_SIZE } from "../game/circle-the-dot.ts";
  import type { GameState } from "../game/game-state.ts";
  let { game, canMove, onPlay }: {
    game: GameState; canMove: boolean; onPlay: (index: number) => void;
  } = $props();
  let dot = $derived(game.dotGame!);
  let blocking = $derived(game.currentPlayer === dot.blocker);
  let neighbors = $derived(dotNeighbors(dot.dot));
</script>

<div class="dot-game">
  <p class="rules">Ограждащият блокира едно сиво кръгче, после точката се мести до свободен съсед.
    Ограждащият печели, ако прекъсне всички пътища за бягство; точката — ако стигне края.</p>
  <div class="dot-board" role="group" aria-label="Поле с 11 реда и 11 колони">
    {#each Array(DOT_SIZE) as _, row}
      <div class="dot-row" class:offset={row % 2 === 1}>
        {#each Array(DOT_SIZE) as _, col}
          {@const index = row * DOT_SIZE + col}
          <button type="button" class:blocked={dot.blocked[index]} class:blue={dot.dot === index}
            class:destination={!blocking && !dot.blocked[index] && neighbors.includes(index)}
            disabled={!canMove || game.gameOver || dot.blocked[index] || dot.dot === index || (!blocking && !neighbors.includes(index))}
            aria-label={`Ред ${row + 1}, колона ${col + 1}: ${dot.dot === index ? "синя точка" : dot.blocked[index] ? "блокирано" : "свободно"}`}
            onclick={() => onPlay(index)}><span aria-hidden="true"></span></button>
        {/each}
      </div>
    {/each}
  </div>
  <div class="feedback" role="status">
    <strong>{dot.result === "trapped" ? "Точката е оградена!" : dot.result === "escaped" ? "Точката избяга!" : blocking ? "Блокирай свободно кръгче." : "Премести точката в очертано кръгче."}</strong>
    <span>Блокирани ходове: {dot.moves}</span>
  </div>
</div>

<style>
  .dot-game { width: 100%; }
  .rules { color: #aeb9ca; font-size: .82rem; line-height: 1.5; }
  .rules { max-width: 500px; margin: 12px auto 18px; text-align: center; }
  .dot-board { --step: min(40px, calc((100vw - 82px) / 11.5)); width: max-content; margin: auto; padding-right: calc(var(--step) / 2); }
  .dot-row { display: flex; }
  .offset { margin-left: calc(var(--step) / 2); }
  .dot-row button { display: grid; place-items: center; width: var(--step); height: calc(var(--step) * .87); padding: 0; border: 0; border-radius: 50%; background: transparent; cursor: pointer; touch-action: manipulation; }
  .dot-row button span { width: 78%; aspect-ratio: 1; border-radius: 50%; background: #8591a3; }
  .dot-row button:enabled:hover span { background: #c4cfdf; }
  button.blocked span { background: #ff9e52; }
  button.blue span { background: #58adff; box-shadow: 0 0 0 3px #58adff30; }
  button.destination span { box-shadow: 0 0 0 2px #58adff; }
  button:disabled { cursor: default; }
  .feedback { display: flex; flex-direction: column; gap: 6px; margin: 18px 0; text-align: center; }
  .feedback strong { font-size: .95rem; }
  .feedback > span { color: var(--muted); font-size: .8rem; }
</style>
