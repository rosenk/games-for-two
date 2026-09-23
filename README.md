# Морски шах

Игра за двама на един екран или онлайн — с покана чрез линк или търсене на противник.

```sh
npm ci
npm run dev
```

`npm run check` проверява Svelte, тестовете, production сборката и Cloudflare Worker конфигурацията. Онлайн играта използва PeerJS, а услугата за търсене на противник е описана в [matchmaker/README.md](matchmaker/README.md).

Значимите архитектурни решения и заменените им предшественици са в [индекса на ADR](docs/adr/README.md); [0001](docs/adr/0001-record-architecture-decisions.md) описва правилото за воденето им.
