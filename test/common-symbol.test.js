import assert from "node:assert/strict";
import test from "node:test";
import { SYMBOL_CARDS, SYMBOLS, dealSymbolCards } from "../src/game/common-symbol.ts";
import { createGameState, makeMove, restoreGame, serializeGame, startRound, resetScore } from "../src/game/game-state.ts";
import { createMatchUrl, createRoomId, parseMatchRoute } from "../src/online/match-url.js";
import { matchmakerSocketUrl } from "../src/online/matchmaker.js";

const started = () => ({ ...createGameState("common-symbol"), started: true, deck: [0, 1] });
// Cards 0 and 1 have different residues modulo 7; their only shared symbol is 49.

test("all 1596 card pairs share exactly one symbol; each has eight unique symbols", () => {
  assert.equal(SYMBOLS.length, 57);
  assert.equal(new Set(SYMBOLS.map(([emoji]) => emoji)).size, 57);
  assert.equal(SYMBOL_CARDS.length, 57);
  for (const [i, card] of SYMBOL_CARDS.entries()) {
    assert.equal(card.length, 8);
    assert.equal(new Set(card).size, 8);
    assert.ok(card.every((symbol) => Number.isInteger(symbol) && symbol >= 0 && symbol < 57));
    for (const other of SYMBOL_CARDS.slice(i + 1)) assert.equal(card.filter((s) => other.includes(s)).length, 1);
  }
  const deck = dealSymbolCards();
  assert.equal(deck.length, 2);
  assert.equal(new Set(deck).size, 2);
  assert.ok(deck.every((card) => card >= 0 && card < 57));
});

test("either player can win first; the second claim on the same pair never scores or penalizes", () => {
  for (const [first, second] of [["O", "X"], ["X", "O"]]) {
    const game = started();
    const won = makeMove(game, 49, first);
    assert.deepEqual(won.board, [first]);
    assert.deepEqual(game.board, []);
    assert.equal(won.gameOver, false);
    const late = makeMove(won, 49, second);
    assert.equal(late, won);
    assert.deepEqual(late.scores, { X: 0, O: 0, draw: 0 });
  }
});

test("wrong choices on either card award the opponent and allow an immediate next answer", () => {
  for (const player of ["X", "O"]) {
    const opponent = player === "X" ? "O" : "X";
    for (const symbol of [0, 1]) {
      const game = started();
      const wrong = makeMove(game, symbol, player);
      assert.deepEqual(wrong.board, [opponent]);
      assert.deepEqual(game.board, []);
      assert.notEqual(wrong.deck, game.deck);
      assert.equal(makeMove(wrong, symbol, player), wrong);
      assert.deepEqual(makeMove({ ...wrong, deck: [0, 1] }, 106, player).board, [opponent, player]);
      assert.deepEqual(restoreGame(serializeGame(wrong)), wrong);
    }
  }
});

test("unstarted matches cannot be played; invalid or absent symbols do not penalize", () => {
  const waiting = createGameState("common-symbol");
  assert.equal(makeMove(waiting, 49, "X"), waiting);
  assert.equal(waiting.started, false);
  for (const index of [-1, 1.5, 57, 56, NaN, Infinity]) {
    const game = started();
    assert.equal(makeMove(game, index, "O"), game);
  }
});

test("nine points are not enough; first to ten wins once, even with competing claims at 9–9", () => {
  for (const winner of ["X", "O"]) {
    const other = winner === "X" ? "O" : "X";
    let game = started();
    for (let point = 0; point < 18; point++) {
      game = makeMove({ ...game, deck: [0, 1] }, point * 57 + 49, point % 2 ? "O" : "X");
      assert.equal(game.gameOver, false);
      assert.deepEqual(game.scores, { X: 0, O: 0, draw: 0 });
      assert.deepEqual(restoreGame(serializeGame(game)), game);
    }
    const finished = makeMove({ ...game, deck: [0, 1] }, 18 * 57 + 49, winner);
    assert.equal(finished.gameOver, true);
    assert.equal(finished.board.filter((owner) => owner === winner).length, 10);
    assert.equal(finished.board.filter((owner) => owner === other).length, 9);
    assert.equal(finished.scores[winner], 1);
    assert.equal(finished.scores[other], 0);
    assert.equal(finished.scores.draw, 0);
    assert.deepEqual(restoreGame(serializeGame(finished)), finished);
    assert.equal(makeMove(finished, 18 * 57 + 49, other), finished);
    assert.equal(makeMove(finished, 19 * 57 + 49, winner), finished);
    const next = startRound(finished);
    assert.deepEqual(next.board, []);
    assert.equal(next.started, false);
    assert.deepEqual(next.scores, finished.scores);
    assert.deepEqual(resetScore(finished).scores, { X: 0, O: 0, draw: 0 });
  }
});

test("a 10–0 victory ends immediately without waiting for more cards", () => {
  let game = started();
  for (let point = 0; point < 10; point++) {
    game = makeMove({ ...game, deck: [0, 1] }, point * 57 + 49, "O");
    assert.equal(game.gameOver, point === 9);
  }
  assert.deepEqual(game.board, Array(10).fill("O"));
  assert.deepEqual(game.scores, { X: 0, O: 1, draw: 0 });
  assert.deepEqual(restoreGame(serializeGame(game)), game);
});

test("a mistake can give the opponent their tenth point and the round win", () => {
  for (const player of ["X", "O"]) {
    const opponent = player === "X" ? "O" : "X";
    const game = { ...started(), board: Array(9).fill(opponent) };
    const finished = makeMove(game, 9 * 57, player);
    assert.equal(finished.gameOver, true);
    assert.deepEqual(finished.board, Array(10).fill(opponent));
    assert.equal(finished.scores[opponent], 1);
    assert.equal(finished.scores[player], 0);
    assert.equal(finished.scores.draw, 0);
    assert.equal(makeMove(finished, 9 * 57 + 49, opponent), finished);
    assert.deepEqual(restoreGame(serializeGame(finished)), finished);
  }
});

test("wire state preserves points and cards and rejects old or corrupt state", () => {
  const game = makeMove(started(), 1, "O");
  const wire = serializeGame(game);
  assert.deepEqual(restoreGame(wire), game);
  wire.board[0] = "O";
  wire.deck[0] = -1;
  assert.equal(game.board[0], "X");
  assert.ok(game.deck[0] >= 0);
  const state = serializeGame(started());
  for (const deck of [undefined, [], [0, 0], [0, 57], [0, 1.5], Array(10).fill(0)]) assert.equal(restoreGame({ ...state, deck }), null);
  for (const started of [undefined, null, 0, "true"]) assert.equal(restoreGame({ ...state, started }), null);
  assert.equal(restoreGame({ ...state, started: false, board: ["X"] }), null);
  assert.equal(restoreGame({ ...state, board: [null] }), null);
  assert.equal(restoreGame({ ...state, gameOver: true }), null);
  assert.equal(restoreGame({ ...state, board: Array(10).fill("X") }), null);
  for (const board of [Array(11).fill("X"), [...Array(10).fill("X"), "O"], [...Array(10).fill("X"), ...Array(10).fill("O")]]) {
    assert.equal(restoreGame({ ...state, board, gameOver: true }), null);
  }
  const waiting = createGameState("common-symbol");
  assert.deepEqual(restoreGame(serializeGame(waiting)), waiting);
});

test("invitations and matchmaking preserve the game identity", async () => {
  const room = await createRoomId("a".repeat(43), "b".repeat(32));
  const url = new URL(createMatchUrl("https://example.com/", room, "common-symbol"));
  assert.deepEqual(parseMatchRoute(url.search), { roomId: room, game: "common-symbol", boardSize: 3, valid: true });
  assert.equal(matchmakerSocketUrl("https://match.example", room, "common-symbol"), `wss://match.example/match?room=${room}&game=common-symbol`);
});
