import { useState } from 'react';
import './App.css';
import { shouldBotMove, getBotMove, calculateWinner } from './botlogic';


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else if (!winner && squares.every(Boolean)) {
      nextSquares[i] = 'O';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = <span>Winner: {winner}</span>;
  } else if (squares.every(Boolean)) {
    status = <span>Draw!</span>;
  } else {
    status = <span className="next-player">Next player: {xIsNext ? 'X' : 'O'}</span>;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameMode, setGameMode] = useState(null); // null, '2P', or 'BOT'
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const handleModeChange = (e) => {
    setGameMode(e.target.value);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Bot logic moved to botlogic.jsx
    if (shouldBotMove(gameMode, nextSquares, nextHistory)) {
      setTimeout(() => {
        const botMove = getBotMove(nextSquares);
        if (botMove !== null) {
          const botSquares = nextSquares.slice();
          botSquares[botMove] = 'O';
          setHistory([...nextHistory, botSquares]);
          setCurrentMove(nextHistory.length);
        }
      }, 600);
    }
  }


  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button className="move-history-btn" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleToggleMode = () => setDarkMode((prev) => !prev);

  return (
    <>
      {!gameMode ? (
        <div className="front-page">
          <div className="welcome-box">
            <span className="game-icon" role="img" aria-label="TicTacToe">🎮</span>
            <h1 className="welcome-title">Welcome to TicTacToe!</h1>
            <p className="welcome-desc">Choose your game mode to start playing:</p>
            <div className="mode-selector">
              <select id="mode-select" defaultValue="" onChange={handleModeChange}>
                <option value="" disabled>-- Select Mode --</option>
                <option value="2P">2 Player</option>
                <option value="BOT">Play vs Bot</option>
              </select>
            </div>
            <footer className="footer-box">
              Developed by Akshat Kumar Tiwari<br />
              Credit -&gt; React Documentation
            </footer>
          </div>
        </div>
      ) : (
        <div className={`game-box${darkMode ? ' dark-mode' : ''}`}> 
          <div className="game-header-row">
            <span className="game-icon" role="img" aria-label="TicTacToe">🎮</span>
            <button className="toggle-mode-btn" onClick={handleToggleMode} title="Toggle Dark/Light Mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="mode-selector">
            <label htmlFor="mode-select" className="mode-label">Game Mode:</label>
            <select id="mode-select" value={gameMode} onChange={handleModeChange}>
              <option value="2P">2 Player</option>
              <option value="BOT">Play vs Bot</option>
            </select>
          </div>
          <h1 className="game-title">TicTacToe Game</h1>
          <div className="game">
            <div className="game-board">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
              <ol>{moves}</ol>
            </div>
          </div>
          {/* Footer moved to welcome page */}
        </div>
      )}
    </>
  );
}

