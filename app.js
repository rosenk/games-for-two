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

const cells = [...document.querySelectorAll("[data-cell]")];
const playerCards = [...document.querySelectorAll("[data-player-card]")];
const status = document.querySelector("#game-status");
const turnIndicator = document.querySelector(".turn-indicator");
const newRoundButton = document.querySelector("#new-round");
const resetScoreButton = document.querySelector("#reset-score");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draw: document.querySelector("#score-draw"),
};

let board = Array(9).fill(null);
let currentPlayer = "X";
let nextStarter = "O";
let gameOver = false;
let scores = { X: 0, O: 0, draw: 0 };

function playerName(player) {
  return player === "X" ? "Играч 1" : "Играч 2";
}

function playerMark(player) {
  return player === "X" ? "×" : "○";
}

function findWinningLine() {
  return winningLines.find(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function updateTurnUI() {
  playerCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.playerCard === currentPlayer && !gameOver);
  });

  turnIndicator.classList.toggle("player-o", currentPlayer === "O");
  turnIndicator.classList.toggle("finished", gameOver);
}

function setTurnMessage() {
  status.innerHTML = `${playerName(currentPlayer)} е на ход <strong>${playerMark(currentPlayer)}</strong>`;
  updateTurnUI();
}

function finishGame(winningLine) {
  gameOver = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (winningLine) {
    scores[currentPlayer] += 1;
    winningLine.forEach((index) => cells[index].classList.add("winner"));
    status.innerHTML = `<strong>${playerMark(currentPlayer)}</strong> ${playerName(currentPlayer)} печели!`;
  } else {
    scores.draw += 1;
    status.textContent = "Равенство — чудесна игра!";
  }

  Object.entries(scoreElements).forEach(([key, element]) => {
    element.textContent = scores[key];
  });
  updateTurnUI();
}

function playCell(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);

  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = playerMark(currentPlayer);
  cell.classList.add(currentPlayer.toLowerCase(), "marked");
  cell.disabled = true;
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}: ${playerName(currentPlayer)} ${playerMark(currentPlayer)}`);

  const winningLine = findWinningLine();
  if (winningLine) {
    finishGame(winningLine);
    return;
  }

  if (board.every(Boolean)) {
    finishGame(null);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setTurnMessage();
}

function startRound() {
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = nextStarter;
  nextStarter = nextStarter === "X" ? "O" : "X";

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("x", "o", "marked", "winner");
    cell.setAttribute("aria-label", cell.getAttribute("aria-label").split(":")[0]);
  });

  setTurnMessage();
}

function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  Object.values(scoreElements).forEach((element) => {
    element.textContent = "0";
  });
  nextStarter = "X";
  startRound();
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
newRoundButton.addEventListener("click", startRound);
resetScoreButton.addEventListener("click", resetScore);
