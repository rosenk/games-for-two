<script>
  import { FLEET, shipCells, canPlace } from "./rules.ts";
  let { game, online, canMove, displayName, onPlay } = $props();
  let vertical = $state(false);
  let revealed = $state("");
  let hovered = $state(null);
  const other = (p) => p === "X" ? "O" : "X";
  const coordinate = (i) => `${"ABCDEFGHIJ"[i % 10]}${Math.floor(i / 10) + 1}`;
  const shotName = (shot) => shot === "miss" ? "вода" : shot === "hit" ? "попадение" : shot === "sunk" ? "потопен" : "необстрелвано";
  let b = $derived(game.battle);
  let viewer = $derived(online.mode === "local" ? game.currentPlayer : online.localPlayer ?? game.currentPlayer);
  let fleet = $derived(b.fleets[viewer] || []);
  let placing = $derived(!b.ready[viewer]);
  let turnKey = $derived(`${b.starter}:${game.nextStarter}:${b.ready.X}:${b.ready.O}:${b.shots.X.filter(Boolean).length}:${b.shots.O.filter(Boolean).length}:${game.scores.X}:${game.scores.O}`);
  let covered = $derived(online.mode === "local" && revealed !== turnKey);
  let preview = $derived(placing && hovered !== null && fleet.length < 5
    ? shipCells(hovered + (vertical ? 100 : 0), FLEET[fleet.length]) : null);
  function play(index) {
    hovered = null;
    onPlay(index);
  }
</script>

<div class="naval">
  {#if covered}
    <div class="handoff">
      <span aria-hidden="true">🚢</span>
      <h2>Предай устройството на {displayName(viewer)}</h2>
      <p>Другият играч да не гледа. Корабите остават скрити.</p>
      <button type="button" onclick={() => revealed = turnKey}>Готов съм — покажи моето поле</button>
    </div>
  {:else}
    <p class="instruction" aria-live="polite">{placing ? canMove ? fleet.length === 5 ? "Флотът е подреден. Потвърди, когато си готов." : `Постави кораб с ${FLEET[fleet.length]} полета. Избери началната му клетка.` : "Изчакай противника да подреди флота си." : !b.ready[other(viewer)] ? "Твоят флот е готов. Противникът подрежда." : game.gameOver ? "Всички кораби на губещия са потопени." : canMove ? "Стреляй по координата в противниковото поле." : "Изчакай изстрела на противника."}</p>
    {#if placing}
      <div class="fleet-list" aria-label="Кораби за подреждане">
        {#each FLEET as length, i}<span class:placed={i < fleet.length} class:next={i === fleet.length}>{"▪".repeat(length)} <small>{length}</small></span>{/each}
      </div>
      <div class="naval-controls">
        <button type="button" disabled={!canMove} aria-pressed={vertical} onclick={() => vertical = !vertical}>Завърти: {vertical ? "вертикално ↓" : "хоризонтално →"}</button>
        <button type="button" disabled={!canMove} onclick={() => play(200)}>Случаен флот</button>
        <button type="button" disabled={!canMove || !fleet.length} onclick={() => play(201)}>Върни последния</button>
        <button type="button" disabled={!canMove || fleet.length !== 5} onclick={() => play(202)}>Готово — скрий флота</button>
      </div>
    {/if}
    <div class="seas" class:single={placing || !b.ready[other(viewer)]}>
      {#if !placing && b.ready[other(viewer)]}
        <section aria-label="Противниково поле">
          <h2>Прицел <small>{b.shots[viewer].filter((s) => s === "sunk").length} / 17 потопени полета</small></h2>
          <div class="sea">
            <span></span>{#each [..."ABCDEFGHIJ"] as letter}<span class="axis">{letter}</span>{/each}
            {#each Array(10) as _, row}
              <span class="axis">{row + 1}</span>
              {#each Array(10) as _, col}
                {@const i = row * 10 + col}
                {@const shot = b.shots[viewer][i]}
                <button type="button" class:miss={shot === "miss"} class:hit={shot === "hit"} class:sunk={shot === "sunk"}
                  aria-label={`Стреляй ${coordinate(i)}: ${shotName(shot)}`} disabled={!canMove || !!shot} onclick={() => play(i)}>{shot === "miss" ? "·" : shot ? "×" : ""}</button>
              {/each}
            {/each}
          </div>
        </section>
      {/if}
      <section aria-label="Моят флот">
        <h2>Твоят флот <small>{placing ? `${fleet.length} / 5 кораба` : "кораби и чужди изстрели"}</small></h2>
        <div class="sea">
          <span></span>{#each [..."ABCDEFGHIJ"] as letter}<span class="axis">{letter}</span>{/each}
          {#each Array(10) as _, row}
            <span class="axis">{row + 1}</span>
            {#each Array(10) as _, col}
              {@const i = row * 10 + col}
              {@const ship = fleet.some((cells) => cells.includes(i))}
              {@const shot = b.shots[other(viewer)][i]}
              <button type="button" class:ship class:miss={shot === "miss"} class:hit={shot === "hit"} class:sunk={shot === "sunk"}
                class:preview={preview?.includes(i) && canPlace(fleet, preview)}
                aria-label={`Моят флот ${coordinate(i)}: ${ship ? "кораб" : "вода"}${shot ? `, ${shotName(shot)}` : ""}`}
                disabled={!placing || !canMove || fleet.length === 5 || !canPlace(fleet, shipCells(i + (vertical ? 100 : 0), FLEET[fleet.length]))}
                onpointerenter={() => hovered = i} onpointerleave={() => hovered = null} onfocus={() => hovered = i} onblur={() => hovered = null}
                onclick={() => play(i + (vertical ? 100 : 0))}>{shot === "miss" ? "·" : shot ? "×" : ship ? "▪" : ""}</button>
            {/each}
          {/each}
        </div>
      </section>
    </div>
    <p class="legend">▪ Кораб <span>· Вода</span> <span>× Попадение</span> <strong>× Потопен</strong></p>
  {/if}
  <details><summary>Как се играе Морски бой?</summary><p>Всеки има поле 10 × 10 и пет кораба: 5, 4, 3, 3 и 2 клетки. Подреди ги хоризонтално или вертикално — без допиране, дори по диагонал. Можеш да завърташ, връщаш последния кораб или да генерираш случаен флот. Потвърди с „Готово“.</p><p>После се редувате с по един изстрел, включително след попадение. Потопените кораби се оцветяват в червено. Печели първият потопил целия чужд флот. Началният играч се редува между рундовете.</p><p>На един екран предавайте устройството при скрито поле. Онлайн играта е приятелска: домакинът обработва ходовете и пази двата флота; няма защита от домакин, който инспектира паметта на браузъра.</p></details>
</div>

<style>
  .naval { width: 100%; margin: 1.25rem auto; }
  .instruction, .legend { text-align: center; color: var(--muted, #a8b5cb); }
  .naval-controls, .fleet-list { display: flex; justify-content: center; flex-wrap: wrap; gap: .6rem; margin: 1rem 0; }
  .naval-controls button, .handoff button { border: 1px solid #37516d; border-radius: .7rem; background: #18314b; color: #edf5ff; padding: .7rem 1rem; cursor: pointer; font: inherit; }
  button:disabled { cursor: default; }
  .naval-controls button:disabled { opacity: .4; }
  .fleet-list span { padding: .5rem; border: 1px solid #37516d; border-radius: .5rem; color: #9caec4; }
  .fleet-list .placed { color: #56cebb; } .fleet-list .next { color: #fff; border-color: #60a5fa; }
  .seas { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .seas.single { grid-template-columns: minmax(0, 430px); justify-content: center; }
  h2 { font-size: 1rem; margin: .8rem 0; } h2 small { display: block; margin-top: .3rem; font-size: .75rem; font-weight: 500; color: #a8b5cb; }
  .sea { display: grid; grid-template-columns: 1.1rem repeat(10, minmax(0, 1fr)); gap: 3px; padding: 8px; border: 1px solid #3c6477; border-radius: 12px; background: radial-gradient(ellipse at 30% 20%, #234d5c, #102e40); box-shadow: inset 0 1px 0 #ffffff20, 0 7px 0 #071925, 0 16px 24px #0004; }
  .axis { display: flex; align-items: center; justify-content: center; color: #a8b5cb; font-size: .7rem; }
  .sea button { aspect-ratio: 1; min-width: 0; padding: 0; border: 1px solid #294664; border-radius: 4px; background: #102940; color: #edf5ff; font-size: 1.15rem; cursor: crosshair; }
  .sea button:not(:disabled):hover, .sea button.preview { background: #265479; border-color: #85bfff; }
  .sea button.ship { background: linear-gradient(135deg, #85a5b9, #40657a); box-shadow: inset 0 2px 0 #ffffff35; } .sea button.miss { color: #a8b5cb; background: #172535; }
  .sea button.hit { background: radial-gradient(circle, #ffd591, #b66a25); animation: impact 260ms ease-out; } .sea button.sunk { background: #963d52; }
  @keyframes impact { from { box-shadow: 0 0 18px #ffc475; transform: scale(1.12); } to { box-shadow: none; transform: scale(1); } }
  button:focus-visible { outline: 3px solid #f6cc79; outline-offset: 2px; }
  .legend { font-size: .8rem; display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; } .legend strong { color: #ff91a7; }
  .handoff { text-align: center; padding: 3rem 1rem; border: 1px dashed #37516d; border-radius: 1rem; } .handoff > span { font-size: 3rem; } .handoff h2 { font-size: 1.2rem; } .handoff p { color: #a8b5cb; }
  details { margin-top: 1.2rem; color: #a8b5cb; font-size: .85rem; line-height: 1.7; } summary { cursor: pointer; color: #edf5ff; }
  @media (max-width: 600px) { .seas { grid-template-columns: 1fr; gap: .6rem; } .sea { gap: 2px; } .naval-controls button { font-size: .8rem; padding: .6rem; } }
</style>
