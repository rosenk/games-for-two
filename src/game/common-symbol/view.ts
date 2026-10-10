import Board from "./Board.svelte";
import { SYMBOL_TARGET } from "./rules.ts";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "common-symbol", Board, title: "Общ символ", art: ["☀️ 🌸"],
  description: `8 символа. Първи до ${SYMBOL_TARGET} точки!`, tagline: "Открий съвпадението · спечелени рундове", supportsDraw: false,
  winner: (game) => {
    const difference = game.board.filter((owner) => owner === "X").length - game.board.filter((owner) => owner === "O").length;
    return difference === 0 ? null : difference > 0 ? "X" : "O";
  },
  simultaneousStatus: "Кой ще открие символа пръв?",
  computerDescription: "Умен бот с човешко темпо", localDescription: "Играйте едновременно, всеки в своята зона",
  computerSide: "X", sidePicker: () => false,
});
