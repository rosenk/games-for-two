import Board from "./Board.svelte";
import { boxesWinner } from "./rules.ts";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "dots-and-boxes", Board, title: "Точки и квадратчета", art: ["•—•", "•—•"],
  description: "Затвори квадратче и играй пак.", tagline: "Затвори квадратчетата · спечелени рундове",
  winner: (game) => boxesWinner(game.boxes!),
  playTitle: (game) => `Точки и квадратчета ${game.boardSize + 1} × ${game.boardSize + 1}`,
  sizePicker: { label: "Брой точки на страна", ariaLabel: "Размер на дъската за Точки и квадратчета", displaySize: (size) => size + 1, hint: (size) => `${size ** 2} квадратчета за завладяване.` },
});
