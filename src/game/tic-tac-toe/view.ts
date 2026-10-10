import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "tic-tac-toe", Board, title: "Морски шах", art: ["× ○", "○ ×"], artClass: "tic-art",
  description: "Подреди три знака в редица на поле 3 × 3.", tagline: "Три в редица",
  shareText: "Играй морски шах с мен!",
});
