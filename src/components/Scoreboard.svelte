<script>
  let { game, online, waiting, onReset } = $props();

  const label = (player) => {
    if (online.mode === "local") return player === "X" ? "Играч 1" : "Играч 2";
    return online.localPlayer === player ? "Вие" : "Противник";
  };
</script>

<header class="game-header">
  <div>
    <p class="eyebrow">На един или два телефона</p>
    <h1>Морски шах<span aria-hidden="true">.</span></h1>
  </div>
  <button class="icon-button" type="button" onclick={onReset} disabled={waiting}>
    <span aria-hidden="true">↻</span>
    Нулирай резултата
  </button>
</header>

<section class="scoreboard" aria-label="Резултат">
  <article
    class="player-card player-x"
    class:active={game.currentPlayer === "X" && !game.gameOver && !waiting}
  >
    <span class="player-symbol" aria-hidden="true">×</span>
    <div>
      <span class="player-label">{label("X")}</span>
      <strong>{game.scores.X}</strong>
    </div>
  </article>

  <div class="draw-score">
    <span>Равни</span>
    <strong>{game.scores.draw}</strong>
  </div>

  <article
    class="player-card player-o"
    class:active={game.currentPlayer === "O" && !game.gameOver && !waiting}
  >
    <span class="player-symbol" aria-hidden="true">○</span>
    <div>
      <span class="player-label">{label("O")}</span>
      <strong>{game.scores.O}</strong>
    </div>
  </article>
</section>
