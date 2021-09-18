import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={() => onClick()}>
      {value}
    </button>
  );
};

const Board = ({ squares, onClick }) => {
  const renderSquare = (i) => {
    return <Square key={i} value={squares[i]} onClick={() => onClick(i)} />;
  };
  return (
    <div>
      {Array(3)
        .fill(0)
        .map((_, i) => {
          return (
            <div className="board-row" key={i}>
              {Array(3)
                .fill(0)
                .map((_, j) => {
                  return renderSquare(i * 3 + j);
                })}
            </div>
          );
        })}
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);

  const handleClick = (i) => {
    const _history = history.slice(0, stepNumber + 1);
    const current = _history[_history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(_history.concat([{ squares: squares }]));
    setStepNumber(_history.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const _history = history;
  const current = _history[stepNumber];
  const winner = calculateWinner(current.squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const moves = _history.map((board, move) => {
    const desc = move ? "Go to move #" + move : "Let's start a new game";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
