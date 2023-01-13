const responseElement = document.getElementById('response');
const guessElement = document.getElementById('guess');
const submitGuessButton = document.getElementById('submitGuessButton');
const startButton = document.getElementById('startButton');

async function startGame() {
  const response = await fetch('/start');
  const text = await response.text();

  responseElement.innerHTML = text;
  startButton.disabled = true;
  guessElement.disabled = false;
  submitGuessButton.disabled = false;
}

async function submitGuess() {
  const response = await fetch('/guess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guess: guessElement.value,
    }),
  });

  const text = await response.text();

  responseElement.innerHTML = text;
  guessElement.value = '';
}
