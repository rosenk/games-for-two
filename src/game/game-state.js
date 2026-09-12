export const cellLabels = [
  "Горе вляво",
  "Горе в средата",
  "Горе вдясно",
  "В средата вляво",
  "В центъра",
  "В средата вдясно",
  "Долу вляво",
  "Долу в средата",
  "Долу вдясно",
];

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createGameState() {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    nextStarter: "O",
    gameOver: false,
    winningLine: null,
    scores: { X: 0, O: 0, draw: 0 },
  };
}

export function findWinningLine(board) {
  return winningLines.find(([a, b, c]) => (
    board[a] && board[a] === board[b] && board[a] === board[c]
  )) || null;
}

export function makeMove(game, index, player) {
  if (!Number.isInteger(index) || index < 0 || index > 8) return game;
  if (game.gameOver || game.board[index] || player !== game.currentPlayer) return game;

  const board = [...game.board];
  const scores = { ...game.scores };
  board[index] = player;
  const winningLine = findWinningLine(board);
  const draw = !winningLine && board.every(Boolean);

  if (winningLine) scores[player] += 1;
  else if (draw) scores.draw += 1;

  return {
    ...game,
    board,
    scores,
    winningLine,
    gameOver: Boolean(winningLine || draw),
    currentPlayer: winningLine || draw
      ? game.currentPlayer
      : game.currentPlayer === "X" ? "O" : "X",
  };
}

export function startRound(game) {
  return {
    ...game,
    board: Array(9).fill(null),
    currentPlayer: game.nextStarter,
    nextStarter: game.nextStarter === "X" ? "O" : "X",
    gameOver: false,
    winningLine: null,
  };
}

export function resetScore(game) {
  return startRound({
    ...game,
    scores: { X: 0, O: 0, draw: 0 },
    nextStarter: "X",
  });
}

export function serializeGame(game) {
  return {
    board: [...game.board],
    currentPlayer: game.currentPlayer,
    nextStarter: game.nextStarter,
    gameOver: game.gameOver,
    scores: { ...game.scores },
  };
}

export function restoreGame(state) {
  const validCell = (value) => value === null || value === "X" || value === "O";
  const validScore = (value) => Number.isInteger(value) && value >= 0;
  const valid = state
    && Array.isArray(state.board)
    && state.board.length === 9
    && state.board.every(validCell)
    && (state.currentPlayer === "X" || state.currentPlayer === "O")
    && (state.nextStarter === "X" || state.nextStarter === "O")
    && typeof state.gameOver === "boolean"
    && state.scores
    && validScore(state.scores.X)
    && validScore(state.scores.O)
    && validScore(state.scores.draw);

  if (!valid) return null;
  return {
    ...state,
    board: [...state.board],
    scores: { ...state.scores },
    winningLine: findWinningLine(state.board),
  };
}
