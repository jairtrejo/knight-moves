import { useCallback, useMemo, useRef, useReducer } from "react";
import { Chess, ChessInstance, Square } from "chess.js";

const queenSquare = "d5";
const startingPosition = "7N/8/8/3q4/8/8/8/8 w - - 0 1";
const attackedByQueenSquares = new Set([
  "d8",
  "d7",
  "d6",
  "d4",
  "d3",
  "d2",
  "d1",
  "g8",
  "f7",
  "e6",
  "c4",
  "b3",
  "a2",
  "h5",
  "g5",
  "f5",
  "e5",
  "c5",
  "b5",
  "a5",
  "h1",
  "g2",
  "f3",
  "e4",
  "c6",
  "b7",
  "a8",
]);
const targetSquares = "87654321"
  .split("")
  .map((rank) => "hgfedcba".split("").map((file) => `${file}${rank}`))
  .reduce((prev, curr) => prev.concat(curr), [])
  .filter(
    (square) => square !== queenSquare && !attackedByQueenSquares.has(square)
  ) as Square[];

//const targetSquares = ['h8', 'f8', 'g6'] as const;

function resetTurn(fen: string, color: "w" | "b") {
  const [pieces, , castling, enpassant, , ,] = fen.split(" ");
  return [pieces, color, castling, enpassant, "0", "1"].join(" ");
}

type PuzzleState = {
  position: string;
  nextSquareIndex: number;
  progress: number;
  nextSquare?: Square;
  startTime?: Date;
  stopTime?: Date;
};

enum ActionTypes {
  PlaceKnight = "PLACE_KNIGHT",
  ResetGame = "RESET_GAME",
}

type Action =
  | { type: ActionTypes.PlaceKnight; square: Square }
  | { type: ActionTypes.ResetGame };

export default function usePuzzle() {
  const chessRef = useRef<ChessInstance>(new Chess(startingPosition));

  const initialState: PuzzleState = {
    position: startingPosition,
    nextSquareIndex: 1,
    nextSquare: targetSquares[1],
    progress: 1 / targetSquares.length,
  };

  const reducer = useCallback(
    (state: PuzzleState, action: Action) => {
      const chess = chessRef.current;

      switch (action.type) {
        case ActionTypes.PlaceKnight:
          const targetSquare = action.square;

          const knightMove = chess.move(`N${targetSquare}`);
          const isCapturingQueen = targetSquare === queenSquare;
          const canBeCapturedByQueen = attackedByQueenSquares.has(targetSquare);
          const isCheating = isCapturingQueen || canBeCapturedByQueen;

          if (knightMove && !isCheating) {
            const newPosition = resetTurn(chess.fen(), "w");
            const startTime = state.startTime || new Date();
            let stopTime;
            let nextSquareIndex = state.nextSquareIndex;

            if (targetSquare === targetSquares[state.nextSquareIndex]) {
              nextSquareIndex = nextSquareIndex + 1;

              if (nextSquareIndex === targetSquares.length) {
                stopTime = new Date();
              }
            }

            chess.load(newPosition);

            return {
              position: newPosition,
              nextSquareIndex,
              progress: nextSquareIndex / (targetSquares.length),
              nextSquare: targetSquares[nextSquareIndex],
              startTime,
              stopTime,
            };
          } else {
            chess.undo();
            return state;
          }

        case ActionTypes.ResetGame:
          chess.load(startingPosition);
          return initialState;
        default:
          return state;
      }
    },
    [chessRef.current]
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const handlers = useMemo(
    () => ({
      placeKnight(square: Square) {
        dispatch({ type: ActionTypes.PlaceKnight, square: square });
      },
      reset() {
        dispatch({ type: ActionTypes.ResetGame });
      },
    }),
    []
  );

  return [state, handlers] as const;
}
