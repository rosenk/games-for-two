import test from "node:test";
import assert from "node:assert/strict";
import { chooseComputerMove, computerDelay } from "../src/game/computer.ts";
import { createGameState, makeMove, startRound } from "../src/game/game-state.ts";
import { boxScore } from "../src/game/dots-and-boxes/rules.ts";
import { SYMBOL_CARDS, SYMBOLS } from "../src/game/common-symbol/rules.ts";

test("tic-tac-toe computer cannot lose against any human move, as either side", () => {
  for (const bot of ["X", "O"]) {
    const visited = new Set();
    function explore(game) {
      if (game.gameOver) {
        assert.equal(game.scores[bot === "X" ? "O" : "X"], 0);
        assert.equal(chooseComputerMove(game), null);
        return;
      }
      const key = game.board.join("-") + game.currentPlayer;
      if (visited.has(key)) return;
      visited.add(key);
      if (game.currentPlayer === bot) {
        const snapshot = structuredClone(game);
        const move = chooseComputerMove(game);
        assert.deepEqual(game, snapshot);
        const next = makeMove(game, move, bot);
        assert.notEqual(next, game);
        explore(next);
      } else {
        for (let i = 0; i < 9; i++) if (!game.board[i]) explore(makeMove(game, i, game.currentPlayer));
      }
    }
    explore(createGameState());
    explore(startRound(createGameState()));
  }
});

test("Hex wins immediately or blocks the opposing connection, on every size and axis", () => {
  for (const size of [5, 7, 9, 11]) {
    for (const player of ["X", "O"]) {
      const path = Array.from({ length: size }, (_, n) => player === "X" ? n * size + 1 : size + n);
      const gap = path[2];
      const game = createGameState("hex", size);
      for (const index of path) if (index !== gap) game.board[index] = player;
      game.currentPlayer = player;
      assert.equal(chooseComputerMove(game), gap);
      assert.equal(makeMove(game, gap, player).gameOver, true);
      game.currentPlayer = player === "X" ? "O" : "X";
      const before = structuredClone(game);
      assert.equal(chooseComputerMove(game), gap);
      assert.deepEqual(game, before);
    }
  }
});

test("boxes computer optimizes the final box margin, including extra turns", () => {
  let game = createGameState("dots-and-boxes", 3);
  for (const index of [10, 4, 17, 23, 21, 1, 18, 9, 3, 0, 20, 6, 7, 2, 19, 12]) {
    game = makeMove(game, index, game.currentPlayer);
  }
  const bot = game.currentPlayer;
  const rival = bot === "X" ? "O" : "X";
  // Independent exhaustive oracle through the actual game rules and final score,
  // rather than the computer's heuristic or internal capture-count helper.
  const memo = new Map();
  function outcome(state) {
    if (state.gameOver) return boxScore(state.boxes, bot) - boxScore(state.boxes, rival);
    const key = state.board.join("-") + state.boxes.join("-") + state.currentPlayer;
    if (memo.has(key)) return memo.get(key);
    const values = state.board.flatMap((cell, index) => cell ? [] : [outcome(makeMove(state, index, state.currentPlayer))]);
    const result = state.currentPlayer === bot ? Math.max(...values) : Math.min(...values);
    memo.set(key, result);
    return result;
  }
  const expected = outcome(game);
  assert.equal(expected, 1); // X can take five boxes against O's four.
  assert.equal(outcome(makeMove(game, 13, bot)), -1); // Greedy capture loses 4–5.
  const before = structuredClone(game);
  const next = makeMove(game, chooseComputerMove(game), bot);
  assert.equal(outcome(next), expected);
  assert.deepEqual(game, before);
});

test("symbol computer answers correctly, respects pair IDs and gives human reaction time", () => {
  let game = createGameState("common-symbol");
  assert.equal(chooseComputerMove(game), null);
  game = { ...game, started: true, deck: [4, 53] };
  const answer = chooseComputerMove(game);
  assert.ok(SYMBOL_CARDS[4].includes(answer % SYMBOLS.length));
  assert.ok(SYMBOL_CARDS[53].includes(answer % SYMBOLS.length));
  game = makeMove(game, answer, "O");
  assert.deepEqual(game.board, ["O"]);
  const nextAnswer = chooseComputerMove(game);
  assert.equal(Math.floor(nextAnswer / SYMBOLS.length), 1);
  assert.equal(makeMove(game, answer, "O"), game);
  const equal = { ...game, board: [] };
  const leading = { ...game, board: Array(8).fill("O") };
  const trailing = { ...game, board: Array(8).fill("X") };
  for (const random of [() => 0, () => .999]) {
    assert.ok(computerDelay(leading, "O", random) > computerDelay(equal, "O", random));
    assert.ok(computerDelay(trailing, "O", random) < computerDelay(equal, "O", random));
    assert.ok(computerDelay(trailing, "O", random) >= 2500);
    assert.ok(computerDelay(leading, "O", random) <= 7500);
  }
});
