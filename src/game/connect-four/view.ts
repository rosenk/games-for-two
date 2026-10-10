import Board from "./Board.svelte";
import { registerGameView } from "../view-registry.ts";

registerGameView({
  kind: "connect-four", Board, title: "Четири в редица", art: ["● ● ● ●"],
  description: "Пускай пулове и подреди четири на поле 7 × 6.", tagline: "Пусни пул · свържи четири · спечелени рундове",
  playTitle: () => "Четири в редица 7 × 6",
});
