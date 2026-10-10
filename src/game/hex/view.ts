import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "hex", Board, title: "Hex", art: ["⬡ ⬡", " ⬡ ⬡"], artClass: "hex-art",
  description: "Свържи срещуположните страни.", tagline: "Свържи страните", supportsDraw: false,
  playTitle: (game) => `Hex ${game.boardSize} × ${game.boardSize}`,
  sizePicker: { label: "Размер на дъската", ariaLabel: "Размер на дъската за Hex", displaySize: (size) => size },
});
