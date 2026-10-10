<script lang="ts">
  import { MORRIS_POINTS, MORRIS_MILLS, morrisActions, morrisMovement } from "./rules.ts";
  import type { GameState } from "../game-state.ts";
  let { game, canMove, displayName, onPlay }: {
    game: GameState; canMove: boolean; displayName: (player: string) => string; onPlay: (action: number) => void;
  } = $props();
  let selected = $state<number | null>(null);
  let m = $derived(game.morris!);
  let actions = $derived(morrisActions(game));
  let placing = $derived(m.reserve[game.currentPlayer] > 0);
  let flying = $derived(!placing && game.board.filter((c) => c === game.currentPlayer).length === 3);
  $effect(() => { game; canMove; selected = null; });
  const selectable = (index: number) => actions.some((a) => a >= 24 && Math.floor((a - 24) / 24) === index);
  const destination = (index: number) => selected !== null && actions.includes(morrisMovement(selected, index));
  function click(index: number) {
    if (!canMove) return;
    if (m.capture || placing) onPlay(index);
    else if (game.board[index] === game.currentPlayer) selected = selected === index ? null : index;
    else if (selected !== null && destination(index)) onPlay(morrisMovement(selected, index));
  }
</script>

<div class="morris-game">
  <p class="phase" role="status">{game.gameOver ? m.result === "draw" ? "Рундът завърши наравно." : "Рундът приключи."
    : m.capture ? `${displayName(game.currentPlayer)}: отнемане — избери очертан противников пул.`
    : placing ? `${displayName(game.currentPlayer)}: поставяне — избери свободно място.`
    : flying ? `${displayName(game.currentPlayer)}: летене — избери свой пул, после свободно място.`
    : `${displayName(game.currentPlayer)}: местене — избери свой пул, после съсед по линия.`}</p>
  <div class="reserves" aria-label="Пулове за поставяне">
    <span>× {displayName("X")}: <strong>{m.reserve.X}</strong> в ръка</span>
    <span>○ {displayName("O")}: <strong>{m.reserve.O}</strong> в ръка</span>
  </div>
  <div class="morris-board" role="group" aria-label="Дъска за Дама с 24 позиции">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {#each MORRIS_MILLS as line}
        <line x1={MORRIS_POINTS[line[0]][0]} y1={MORRIS_POINTS[line[0]][1]}
          x2={MORRIS_POINTS[line[2]][0]} y2={MORRIS_POINTS[line[2]][1]} />
      {/each}
    </svg>
    {#each MORRIS_POINTS as [x, y], index}
      {@const owner = game.board[index]}
      {@const target = m.capture ? actions.includes(index) : !placing && destination(index)}
      <button type="button" style={`left:${x}%;top:${y}%`}
        class:x={owner === "X"} class:o={owner === "O"} class:selected={selected === index} class:target
        disabled={!canMove || (m.capture || placing ? !actions.includes(index) : !(selectable(index) || destination(index)))}
        aria-label={`Позиция ${index + 1}: ${owner ? `${displayName(owner)} ${owner === "X" ? "×" : "○"}` : "свободна"}${target ? m.capture ? ", за отнемане" : ", възможен ход" : ""}`}
        aria-pressed={selected === index} onclick={() => click(index)}>
        <span aria-hidden="true">{owner === "X" ? "×" : owner === "O" ? "○" : ""}</span>
      </button>
    {/each}
  </div>
  <details class="morris-rules">
    <summary>Как се играе Дама?</summary>
    <p>Всеки има 9 пула. Редувайте се да ги поставяте. След това местете по един свой пул до свободен съсед по линия.
      При 3 останали пула можете да „летите“ до всяко свободно място.</p>
    <p>Нова тройка по линия позволява да отнемете един противников пул. Пул от тройка е защитен, освен ако всички противникови пулове са в тройки.
      Две тройки с един ход дават едно отнемане. Можете да разтворите и отново да затворите тройка.</p>
    <p>Печелите, ако противникът остане с под 3 пула след поставянето или няма ход.
      Трето повторение на позицията със същия играч на ход или 50 хода на всеки без отнемане води до равенство.</p>
  </details>
</div>

<style>
  .morris-game { width: 100%; max-width: 500px; margin: auto; }
  .phase { min-height: 2.8em; text-align: center; line-height: 1.5; font-size: .9rem; margin: 12px 0; }
  .reserves { display: flex; justify-content: space-between; gap: 8px; font-size: .8rem; color: var(--muted); margin: 0 8px 18px; }
  .morris-board { position: relative; aspect-ratio: 1; margin: 0 8px; border-radius: 22px; background: radial-gradient(ellipse at 30% 20%, #405449, #23352e 70%); box-shadow: inset 0 0 0 2px #ffffff12, 0 8px 0 #101d18, 0 18px 30px #0004; }
  svg { width: 100%; height: 100%; position: absolute; pointer-events: none; }
  line { stroke: #afba9b; stroke-width: .8; }
  button { position: absolute; transform: translate(-50%, -50%); width: 11%; aspect-ratio: 1; padding: 0; border: 0; background: transparent; border-radius: 50%; display: grid; place-items: center; cursor: pointer; touch-action: manipulation; }
  button span { display: grid; place-items: center; width: 72%; aspect-ratio: 1; border-radius: 50%; background: #253348; border: 2px solid #65748a; font-size: clamp(16px, 5vw, 30px); line-height: 1; font-weight: 700; }
  button.x span { background: radial-gradient(circle at 30% 20%, #ffbf9e, var(--x)); color: #702d23; border-color: #ffac8a; box-shadow: inset 0 -3px 2px #0003, 0 3px 4px #0005; animation: seat-piece 220ms ease-out; }
  button.o span { background: radial-gradient(circle at 30% 20%, #c0fae8, var(--o)); color: #14564d; border-color: #a4edde; box-shadow: inset 0 -3px 2px #0003, 0 3px 4px #0005; animation: seat-piece 220ms ease-out; }
  @keyframes seat-piece { from { transform: scale(1.25); opacity: .3; } to { transform: scale(1); opacity: 1; } }
  button:disabled { cursor: default; }
  button.selected span { box-shadow: 0 0 0 4px #fff; }
  button.target span { box-shadow: 0 0 0 3px #85d9b6; }
  button:enabled:hover span { filter: brightness(1.35); }
  button:focus-visible { outline: 2px solid white; outline-offset: 1px; }
  .morris-rules { color: var(--muted); font-size: .82rem; line-height: 1.6; margin: 20px 8px; }
  summary { cursor: pointer; color: #d2dbea; }
</style>
