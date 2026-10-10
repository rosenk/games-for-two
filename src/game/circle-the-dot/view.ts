import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "circle-the-dot", Board, title: "Огради точката", art: ["🟠 🔵 🟠"],
  description: "Ограждай или бягай. Сам или с приятел.", tagline: "Ограда срещу точка · спечелени рундове", supportsDraw: false,
  winner: (game) => game.gameOver ? game.dotGame!.result === "trapped" ? game.dotGame!.blocker : game.dotGame!.blocker === "X" ? "O" : "X" : null,
  roleName: (game, player) => player === game.dotGame!.blocker ? "Ограждащият" : "Точката",
  roleSuffix: (game, player) => player === game.dotGame!.blocker ? " · Ограда" : " · Точка",
  reminderKey: (game) => JSON.stringify(game.dotGame),
  computerDescription: "Избери оградата или точката",
  sidePicker: (opponent) => opponent === "computer" || opponent === "invite",
  sideLabels: { X: "🟠 Ограждай", O: "🔵 Бягай" },
  sideHint: "Ограждащият винаги започва. Точката се мести с една стъпка.",
});
