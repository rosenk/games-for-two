<script>
  let { game, online, waiting, onReset, onAudio } = $props();

  const label = (player) => {
    if (online.mode === "local") return player === "X" ? "Играч 1" : "Играч 2";
    return online.localPlayer === player ? "Вие" : "Противник";
  };

  const audioEnabled = (player) => (
    online.localPlayer === player ? online.audioEnabled : online.remoteAudioEnabled
  );
</script>

{#snippet microphoneIcon(enabled)}
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 15.25a3.25 3.25 0 0 0 3.25-3.25V7a3.25 3.25 0 0 0-6.5 0v5A3.25 3.25 0 0 0 12 15.25Z" />
    <path d="M6.75 11.5v.5a5.25 5.25 0 0 0 10.5 0v-.5M12 17.25V21M9.5 21h5" />
    {#if !enabled}<path class="mic-slash" d="m5 4 14 16" />{/if}
  </svg>
{/snippet}

{#snippet playerAudio(player)}
  {@const enabled = audioEnabled(player)}
  {#if online.mode !== "local" && online.connected}
    {#if online.localPlayer === player}
      <button
        class="player-audio"
        class:enabled
        type="button"
        onclick={onAudio}
        disabled={online.audioBusy}
        aria-label={enabled ? "Спри микрофона" : "Пусни микрофона"}
        aria-pressed={enabled}
        title={enabled ? "Спри микрофона" : "Пусни микрофона"}
      >
        {@render microphoneIcon(enabled)}
      </button>
    {:else}
      <span
        class="player-audio remote"
        class:enabled
        role="img"
        aria-label={enabled ? "Микрофонът на противника е включен" : "Микрофонът на противника е изключен"}
        title={enabled ? "Микрофонът на противника е включен" : "Микрофонът на противника е изключен"}
      >
        {@render microphoneIcon(enabled)}
      </span>
    {/if}
  {/if}
{/snippet}

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
    {@render playerAudio("X")}
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
    {@render playerAudio("O")}
  </article>
</section>
