<script>
  let { online, onCreate, onShare, onLeave } = $props();
  let shareLabel = $state("Сподели линка");

  let copy = $derived.by(() => {
    if (online.mode === "local" && online.phase === "error") {
      return ["Онлайн режимът не се зареди", online.error || "Опитайте отново след малко."];
    }
    if (online.mode === "local") {
      return ["Играй с приятел", "Различни мрежи · нужен е интернет."];
    }
    if (online.phase === "creating") {
      return ["Създаваме двубоя…", "Това обикновено отнема няколко секунди."];
    }
    if (online.mode === "host" && online.phase === "waiting") {
      return ["Двубоят е готов", "Сподели линка и остави тази страница отворена."];
    }
    if (online.phase === "connecting" || online.phase === "reconnecting") {
      return [
        online.phase === "connecting" ? "Влизате в двубоя…" : "Възстановяваме връзката…",
        online.networkOnline ? "Двубоят ще продължи автоматично." : "Чакаме интернет връзка.",
      ];
    }
    if (online.phase === "connected") {
      if (online.audioError) return ["Играете онлайн", online.audioError];
      if (online.audioConnected) {
        return ["Играете онлайн", `Вие сте ${online.localPlayer === "X" ? "×" : "○"} · гласовата връзка е активна`];
      }
      if (online.audioEnabled) {
        return ["Играете онлайн", "Микрофонът е включен · чакаме другия играч"];
      }
      return ["Играете онлайн", `Вие сте ${online.localPlayer === "X" ? "×" : "○"} · връзката е активна`];
    }
    return ["Връзката прекъсна", online.error || "Другият играч е излязъл."];
  });

  async function share() {
    shareLabel = await onShare();
    window.setTimeout(() => {
      shareLabel = "Сподели линка";
    }, 1800);
  }
</script>

<section class="online-card phase-{online.phase}" aria-labelledby="online-title">
  <div class="online-summary">
    <span class="online-icon" aria-hidden="true">2P</span>
    <div>
      <p class="online-kicker">Онлайн игра</p>
      <h2 id="online-title">{copy[0]}</h2>
      <p id="online-description" aria-live="polite">{copy[1]}</p>
    </div>
  </div>
  <div class="online-actions">
    {#if online.mode === "local"}
      <button class="online-primary" type="button" onclick={onCreate}>Създай двубой</button>
    {/if}
    {#if online.mode === "host" && online.inviteUrl}
      <button class="online-primary" type="button" onclick={share}>{shareLabel}</button>
    {/if}
    {#if online.mode !== "local"}
      <button class="online-secondary" type="button" onclick={onLeave}>Излез</button>
    {/if}
  </div>
</section>
