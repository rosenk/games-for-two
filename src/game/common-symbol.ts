import type { GameState, Player } from "./game-state.ts";
import { boxScore } from "./dots-and-boxes.ts";

export const SYMBOL_TARGET = 10;

// Projective plane of order 7: 57 cards, eight symbols per card,
// with exactly one shared symbol between any two distinct cards.
export const SYMBOLS = [
  ["☀️", "Слънце"], ["🌙", "Луна"], ["⭐", "Звезда"],
  ["🍎", "Ябълка"], ["🍋", "Лимон"], ["🍇", "Грозде"],
  ["🐱", "Котка"], ["🐶", "Куче"], ["🦋", "Пеперуда"],
  ["🌸", "Цвете"], ["🚀", "Ракета"], ["🎸", "Китара"], ["👑", "Корона"],
  ["🍒", "Череши"], ["🍉", "Диня"], ["🍍", "Ананас"], ["🥕", "Морков"],
  ["🍄", "Гъба"], ["🌵", "Кактус"], ["🌲", "Елха"], ["🍀", "Детелина"],
  ["🐸", "Жаба"], ["🐟", "Риба"], ["🐢", "Костенурка"], ["🐝", "Пчела"],
  ["🐘", "Слон"], ["🦊", "Лисица"], ["🐧", "Пингвин"], ["🦉", "Бухал"],
  ["🐙", "Октопод"], ["🦀", "Рак"], ["🐬", "Делфин"], ["🐌", "Охлюв"],
  ["⚽", "Топка"], ["🎲", "Зар"], ["🎯", "Мишена"], ["🎁", "Подарък"],
  ["🔑", "Ключ"], ["🔔", "Камбана"], ["💎", "Диамант"], ["💡", "Крушка"],
  ["⏰", "Будилник"], ["✂️", "Ножица"], ["⚓", "Котва"], ["🌈", "Дъга"],
  ["⚡", "Светкавица"], ["🔥", "Огън"], ["❄️", "Снежинка"], ["☂️", "Чадър"],
  ["🎈", "Балон"], ["🚲", "Колело"], ["🚗", "Кола"], ["✈️", "Самолет"],
  ["🏠", "Къща"], ["⛵", "Лодка"], ["📚", "Книги"], ["🍦", "Сладолед"],
] as const;

export const SYMBOL_CARDS: number[][] = [
  ...Array.from({ length: 49 }, (_, i) => {
    const slope = Math.floor(i / 7);
    const intercept = i % 7;
    return [...Array.from({ length: 7 }, (_, x) => x * 7 + (slope * x + intercept) % 7), 49 + slope];
  }),
  ...Array.from({ length: 7 }, (_, x) => [...Array.from({ length: 7 }, (_, y) => x * 7 + y), 56]),
  [49, 50, 51, 52, 53, 54, 55, 56],
];

export function dealSymbolCards(): number[] {
  const deck = SYMBOL_CARDS.map((_, index) => index);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, 2);
}

export function makeSymbolMove(game: GameState, index: number, player: Player): GameState {
  if (game.gameOver || !game.started) return game;
  if (!Number.isSafeInteger(index) || index < 0
    || Math.floor(index / SYMBOLS.length) !== game.board.length) return game;
  const symbol = index % SYMBOLS.length;
  const left = SYMBOL_CARDS[game.deck![0]];
  const right = SYMBOL_CARDS[game.deck![1]];
  if (!left.includes(symbol) && !right.includes(symbol)) return game;
  const recipient = left.includes(symbol) && right.includes(symbol) ? player : player === "X" ? "O" : "X";
  const board = [...game.board, recipient];
  const gameOver = boxScore(board, recipient) === SYMBOL_TARGET;
  const scores = { ...game.scores };
  if (gameOver) scores[recipient] += 1;
  return { ...game, board, gameOver, scores, deck: gameOver ? game.deck : dealSymbolCards() };
}
