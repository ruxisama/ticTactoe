import { useState } from "react";

function Square({ value, onSquareClick }) {

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>);
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = '0';
    }
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;

  } else {
    status = "Next Player:" + (xIsNext ? 'X' : '0');
  }

  const boardLength = 3;
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const i = boardLength * row + col;
      return (
        <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
      )
    })
    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )

  })
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const displayOrder = ascending ? "Ascending" : "Descending";
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);

  }
  function toggleDisplayOrder() {
    setAscending(!ascending);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'You are at move #' + move;
      return (
        <li key={move} onClick={() => jumpTo(move)}>
          {description}
        </li>
      )

    } else {
      description = 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )

    }

  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div><button onClick={toggleDisplayOrder}>{displayOrder}</button></div>
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>

      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }

  }
  return null;
}
