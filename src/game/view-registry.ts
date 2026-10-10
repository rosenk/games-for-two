import type { Component } from "svelte";
import type { GameState, Player } from "./game-state.ts";

export interface GameView {
  kind: string;
  Board: Component<any>;
  title: string;
  art: string[];
  artClass: string;
  description: string;
  tagline: string;
  supportsDraw: boolean;
  playTitle: (game: GameState) => string;
  winner: (game: GameState) => Player | null;
  roleName: (game: GameState, player: Player) => string;
  roleSuffix: (game: GameState, player: Player) => string;
  reminderKey: (game: GameState) => string;
  simultaneousStatus: string;
  sizePicker?: { label: string; ariaLabel: string; displaySize: (size: number) => number; hint?: (size: number) => string };
  computerDescription: string;
  localDescription: string;
  computerSide: Player | null;
  sidePicker: (opponent: string) => boolean;
  sideLabels: Record<Player, string>;
  sideHint: string;
  shareTitle: string;
  shareText: string;
}

const registered = new Map<string, GameView>();
export const gameViews: GameView[] = [];

export function registerGameView(view: Pick<GameView, "kind" | "Board" | "title" | "art" | "description" | "tagline"> & Partial<GameView>): void {
  if (registered.has(view.kind)) throw new Error(`Duplicate game view: ${view.kind}`);
  const normalized: GameView = {
    artClass: "", supportsDraw: true,
    playTitle: () => view.title,
    winner: (game) => game.winningLine ? game.board[game.winningLine[0]] : null,
    roleName: (_game, player) => player === "X" ? "Играч 1" : "Играч 2",
    roleSuffix: () => "",
    reminderKey: (game) => game.board.map((cell) => cell || "-").join(""),
    simultaneousStatus: "",
    computerDescription: "Силен бот, който мисли напред",
    localDescription: "Редувайте се на това устройство",
    computerSide: null,
    sidePicker: (opponent) => opponent === "computer",
    sideLabels: { X: "× Играй с X", O: "○ Играй с O" },
    sideHint: "X започва първия рунд. После се редувате кой започва.",
    shareTitle: view.title, shareText: `Играй ${view.title} с мен!`,
    ...view,
  };
  registered.set(view.kind, normalized);
  gameViews.push(normalized);
}

export function getGameView(kind: string): GameView {
  const view = registered.get(kind);
  if (!view) throw new Error(`Unknown game view: ${kind}`);
  return view;
}
