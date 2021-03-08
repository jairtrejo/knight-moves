import React, { useCallback, useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import {Chess, ChessInstance} from "chess.js";

const queenSquare = 'd5';
const startingPosition = '7N/8/8/3q4/8/8/8/8 w - - 0 1';

function resetTurn(fen: string, color: string) {
  const [pieces, _activeColor, castling, enpassant, halfmove, fullmove] = fen.split(' ');
  return [pieces, color, castling, enpassant, halfmove, fullmove].join(' ');
}

export default function App() {
  const [position, setPosition] = useState<string>(startingPosition);

  const [chess, setChess] = useState<ChessInstance>(new Chess(startingPosition));
  useEffect(() => setChess(new Chess(position)), [setChess, position]);

  const allowDrag = useCallback(
    ({ piece }) => {
      return piece === "wN";
    }, []);

  const onDrop = useCallback(({ sourceSquare, targetSquare }) => {
    const prevPosition = chess.fen();
    const knightMove = chess.move({ from: sourceSquare, to: targetSquare });
    const isCheating =
      targetSquare === "d5" ||
      chess
        .moves({ square: queenSquare })
        .find((move) => move === `Qx${targetSquare}`);

    if (knightMove && !isCheating) {
      const nextPosition = resetTurn(chess.fen(), "w");
      setPosition(nextPosition);
    } else {
      chess.undo();
    }

  }, [chess]);

  const reset = useCallback(() => setPosition(startingPosition), [setPosition]);

  return (
    <>
      <h2>Ain't it funny</h2>
      <h1>How the knight moves?</h1>
      <p>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </p>
      <Chessboard allowDrag={allowDrag} onDrop={onDrop} position={position} />
    </>
  );
}
