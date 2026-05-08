const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const human = 'X';
const ai = 'O';

const winningConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);

function handleCellClick(event) {
  const clickedCell = event.target;
  const index = clickedCell.getAttribute('data-index');

  if (board[index] !== '' || !gameActive) {
    return;
  }

  makeMove(index, human);

  if (gameActive) {
    statusText.innerText = 'AI Thinking...';

    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].innerText = player;
  cells[index].classList.add(player.toLowerCase());

  checkResult(player);
}

function aiMove() {

  // 1. Try to win
  for (let condition of winningConditions) {
    let [a, b, c] = condition;

    let values = [board[a], board[b], board[c]];

    if (values.filter(v => v === ai).length === 2 && values.includes('')) {
      let emptyIndex = condition[values.indexOf('')];
      makeMove(emptyIndex, ai);
      statusText.innerText = 'Your Turn (X)';
      return;
    }
  }

  // 2. Block player from winning
  for (let condition of winningConditions) {
    let [a, b, c] = condition;

    let values = [board[a], board[b], board[c]];

    if (values.filter(v => v === human).length === 2 && values.includes('')) {
      let emptyIndex = condition[values.indexOf('')];
      makeMove(emptyIndex, ai);
      statusText.innerText = 'Your Turn (X)';
      return;
    }
  }

  // 3. Take center if available
  if (board[4] === '') {
    makeMove(4, ai);
    statusText.innerText = 'Your Turn (X)';
    return;
  }

  // 4. Pick random remaining spot
  let emptyCells = [];

  board.forEach((cell, index) => {
    if (cell === '') {
      emptyCells.push(index);
    }
  });

  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex, ai);
  }

  statusText.innerText = 'Your Turn (X)';
}
function checkResult(player) {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const condition = winningConditions[i];

    const a = board[condition[0]];
    const b = board[condition[1]];
    const c = board[condition[2]];

    if (a === '' || b === '' || c === '') {
      continue;
    }

    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.innerText = `${player} Wins! 🎉`;
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    statusText.innerText = 'Draw Game 🤝';
    gameActive = false;
    return;
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;

  statusText.innerText = 'Your Turn (X)';

  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('x');
    cell.classList.remove('o');
  });
}