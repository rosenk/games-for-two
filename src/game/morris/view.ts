import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "morris", Board, title: "Дама", art: ["●—●—●"],
  description: "9 пула. Образувай тройки и надхитри противника.", tagline: "Девет пула · тройки · спечелени рундове",
  winner: (game) => game.morris!.result === "draw" ? null : game.morris!.result,
});
