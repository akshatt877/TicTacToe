// Bot logic for TicTacToe

export function shouldBotMove(gameMode, nextSquares, nextHistory) {
  const winner = calculateWinner(nextSquares);
  const isDraw = nextSquares.every(Boolean);
  // Bot moves only if game not over and it's bot's turn
  return (
    gameMode === 'BOT' &&
    !winner &&
    !isDraw &&
    ((nextHistory.length - 1) % 2 === 1)
  );
}

export function getBotMove(squares) {
  const emptyIndices = squares.map((v, i) => v === null ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return null;
  // You can improve this logic for smarter bot
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// Helper: winner logic (copied from App.jsx)
export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
