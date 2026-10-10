import test from "node:test";
import assert from "node:assert/strict";
import { registerGame, registerComputer, getGame, findGame, games, DEFAULT_GAME_KIND } from "../src/game/catalog.ts";
import { createGameState, makeMove, startRound, resetScore, serializeGame, restoreGame, isGameKind, isBoardSize, defaultBoardSize, gameKinds } from "../src/game/game-state.ts";
import { chooseComputerMove, computerDelay } from "../src/game/computer.ts";

test("a self-registered game and computer work through every common public entry point", () => {
  const stock = games.map((game) => game.kind);
  const kind = "registry-contract-game";
  const definition = registerGame({
    kind, defaultSize: 2, boardLength: (size) => size,
    create: () => ({ contract: [1] }),
    play: (game, index, player) => ({ ...game, board: game.board.map((cell, i) => i === index ? player : cell), contract: [2] }),
    reset: () => ({ board: [null, null], contract: [3] }),
    serialize: (game) => ({ contract: [...game.contract] }),
    restore: (game) => Array.isArray(game.contract) ? { ...game, contract: [...game.contract] } : null,
  });
  registerComputer(kind, () => 1, (_game, _player, random) => 10 + random());
  assert.equal(getGame(kind), definition);
  assert.equal(gameKinds.at(-1), kind);
  assert.equal(isGameKind(kind), true);
  assert.equal(isBoardSize(kind, 2), true);
  assert.equal(defaultBoardSize(kind), 2);
  assert.equal(findGame({ kind }), undefined);
  assert.throws(() => getGame("unknown"), TypeError);
  assert.throws(() => createGameState("unknown"), TypeError);
  assert.equal(isBoardSize("unknown", 3), false);
  assert.equal(defaultBoardSize("unknown"), 3);
  let game = createGameState(kind);
  assert.deepEqual(game.contract, [1]);
  assert.equal(chooseComputerMove(game), 1);
  assert.equal(computerDelay(game, "X", () => 0.5), 10.5);
  game = makeMove(game, 1, "X");
  assert.deepEqual(game.board, [null, "X"]);
  assert.deepEqual(game.contract, [2]);
  const wire = serializeGame(game);
  assert.notEqual(wire.contract, game.contract);
  const restored = restoreGame(wire);
  assert.deepEqual(restored, game);
  assert.notEqual(restored.contract, wire.contract);
  assert.notEqual(restored.board, wire.board);
  assert.notEqual(restored.scores, wire.scores);
  assert.deepEqual(restoreGame({ ...wire, unexpected: ["untrusted"], deck: [0, 1] }), game);
  assert.equal(restoreGame({ ...wire, contract: null }), null);
  assert.equal(restoreGame({ ...wire, kind: "unknown" }), null);
  assert.equal(restoreGame({ ...wire, board: [] }), null);
  assert.deepEqual(startRound(game).contract, [3]);
  assert.deepEqual(resetScore({ ...game, scores: { X: 2, O: 1, draw: 3 } }).scores, { X: 0, O: 0, draw: 0 });
  assert.equal(chooseComputerMove({ ...game, gameOver: true }), null);
  assert.equal(definition.simultaneous, false);
  assert.equal(definition.ready(game), true);
  assert.equal(definition.reveal(game), game);
  assert.equal(definition.view(game, "X"), game);
  assert.equal(definition.configureHost(game, "X", "O"), game);
  assert.deepEqual(games.slice(0, -1).map((game) => game.kind), stock);
  assert.equal(createGameState().kind, DEFAULT_GAME_KIND);
});
