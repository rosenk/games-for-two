import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "battleship", Board, title: "Морски бой", art: ["🚢"],
  description: "Скрий флота си и потопи чуждите кораби.", tagline: "Скрий флота · стреляй · потопи корабите", supportsDraw: false,
  playTitle: () => "Морски бой 10 × 10", winner: (game) => game.gameOver ? game.currentPlayer : null,
});
