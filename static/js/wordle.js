// wordle.js

let wordleSecret = "CACAS";
let wordleRow    = 0;
let gameOver     = false;

/**
 * @param {Document|HTMLElement} container
 */
function loadWordleGame(container = document) {
  wordleRow = 0;
  gameOver = false;

  // pick the grid & message & input/button _inside_ our container or fallback to page
  const grid    = container.querySelector('#wordle-grid')    || document.getElementById('wordle-grid');
  const msg     = container.querySelector('#wordle-message') || document.getElementById('wordle-message');
  const input   = container.querySelector('#wordle-input')   || document.getElementById('wordle-input');
  const guessBtn= container.querySelector("button[onclick='submitGuess()']") ||
                  document.querySelector("button[onclick='submitGuess()']");

  // reset UI
  grid.innerHTML    = '';
  msg.textContent   = '';
  input.value       = '';
  input.disabled    = false;
  guessBtn.disabled = false;

  // build 6×5 grid
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      grid.appendChild(tile);
    }
  }
}

function submitGuess() {
  if (gameOver) return;

  const input = document.getElementById("wordle-input");
  const guess = input.value.toUpperCase();
  if (guess.length !== 5 || wordleRow >= 6) return;

  const grid = document.getElementById("wordle-grid");
  // fill row
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    const tile   = grid.children[wordleRow * 5 + i];
    tile.textContent = letter;
    if      (letter === wordleSecret[i])       tile.classList.add("correct");
    else if (wordleSecret.includes(letter))    tile.classList.add("present");
    else                                        tile.classList.add("absent");
  }

  const msg = document.getElementById("wordle-message");
  if (guess === wordleSecret) {
    msg.textContent = "🎉 Bien joué, mon vieux!";
    gameOver = true;
  } else if (wordleRow === 5) {
    msg.textContent = `💀 Le mot était ${wordleSecret}`;
    gameOver = true;
  }

  // disable input+button on game over
  if (gameOver) {
    document.getElementById("wordle-input").disabled = true;
    document.querySelector("button[onclick='submitGuess()']").disabled = true;
  }

  wordleRow++;
  input.value = "";
}

// export
window.loadWordleGame = loadWordleGame;
window.submitGuess    = submitGuess;
