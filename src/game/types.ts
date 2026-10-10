export type GameKind = string;
export type Player = "X" | "O";
export type Cell = Player | null;
export interface GameState {
  kind: GameKind;
  boardSize: number;
  board: Cell[];
  currentPlayer: Player;
  nextStarter: Player;
  gameOver: boolean;
  winningLine: number[] | null;
  scores: Record<Player | "draw", number>;
}

export interface GameDefinition {
  kind: string;
  defaultSize: number;
  sizes: readonly number[];
  allowSizeParameter: boolean;
  boardLength(size: number): number | null;
  create(size: number): Partial<GameState>;
  play(game: GameState, index: number, player: Player): GameState;
  reset(game: GameState): Partial<GameState>;
  serialize(game: GameState): Partial<GameState>;
  restore(game: GameState, viewer?: Player): GameState | null;
  simultaneous: boolean;
  ready(game: GameState): boolean;
  reveal(game: GameState): GameState;
  view(game: GameState, viewer: Player): GameState;
  configureHost(game: GameState, selectedSide: Player, hostPlayer: Player): GameState;
}
