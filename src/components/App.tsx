import React, { useCallback, useRef, useReducer, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance } from "chess.js";
import { Button, Link, Modal } from "./styled";
import {
  RoundProgressIndicator,
  StraightProgressIndicator,
} from "./ProgressIndicator";

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
  );

//const targetSquares = ["h8", "g6", "f8", "h7", "f6"];

function resetTurn(fen: string, color: "w" | "b") {
  const [pieces, , castling, enpassant, , ,] = fen.split(" ");
  return [pieces, color, castling, enpassant, "0", "1"].join(" ");
}

/*
 * Main app
 */

type AppState = {
  position: string;
  nextSquareIndex: number;
  startTime?: Date;
  stopTime?: Date;
};

enum ActionTypes {
  PlaceKnight = "PLACE_KNIGHT",
  ResetGame = "RESET_GAME",
}

type Action =
  | { type: ActionTypes.PlaceKnight; square: string }
  | { type: ActionTypes.ResetGame };

export default function App() {
  const chessRef = useRef<ChessInstance>(new Chess(startingPosition));

  const reducer = useCallback(
    (state: AppState, action: Action) => {
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
              ...state,
              position: newPosition,
              nextSquareIndex,
              startTime,
              stopTime,
            };
          } else {
            chess.undo();
            return state;
          }

        case ActionTypes.ResetGame:
          chess.load(startingPosition);
          return { position: startingPosition, nextSquareIndex: 1 };
        default:
          return state;
      }
    },
    [chessRef.current]
  );

  const [state, dispatch] = useReducer(reducer, {
    position: startingPosition,
    nextSquareIndex: 1,
  });

  const allowDrag = useCallback(({ piece }) => {
    return piece === "wN";
  }, []);

  const onDrop = useCallback(({ targetSquare }) => {
    dispatch({ type: ActionTypes.PlaceKnight, square: targetSquare });
  }, []);

  const onSquareClick = useCallback((square) => {
    dispatch({ type: ActionTypes.PlaceKnight, square: square });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.ResetGame });
  }, []);

  const calcWidth = useCallback(({ screenWidth }) => {
    return Math.min(screenWidth - 32 - 8, 560);
  }, []);

  const progressIndicatorProps = {
    nextSquare: state.stopTime
      ? "\ud83d\udc4d"
      : targetSquares[state.nextSquareIndex],

    startTime: state.startTime,
    stopTime: state.stopTime,
    progress: state.nextSquareIndex / targetSquares.length,
  };

  const rules = (
    <>
      Move the knight to every square, right to left, top to bottom. Don’t land
      anywhere the queen can take you, and don’t take the queen.
    </>
  );

  const credits = (
    <>
      Made by{" "}
      <Link href="https://www.jairtrejo.com" external>
        Jair Trejo
      </Link>
      .{" "}
      <span className="block lg:inline">
        Inspired by{" "}
        <Link href="https://www.youtube.com/watch?v=SrQlpY_eGYU" external>
          Ben Finegold
        </Link>{" "}
        and{" "}
        <Link
          href="https://open.spotify.com/track/6UBjSnyP1O5W5ndJoO9vUk?si=647834336235421b"
          external
        >
          Bob Seger
        </Link>
        .
      </span>
    </>
  );

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const openHelp = useCallback(() => setIsHelpOpen(true), [setIsHelpOpen]);
  const closeHelp = useCallback(() => setIsHelpOpen(false), [setIsHelpOpen]);

  return (
    <main className="max-w-screen-lg mx-auto flex flex-col lg:flex-row pt-10 pb-8 lg:pt-8 h-screen lg:h-auto">
      <section className="flex flex-col px-4 lg:px-0 lg:pr-6 pb-6 lg:pb-0">
        <h1 className="pb-4 mx-auto lg:mx-0">
          <img
            width="394"
            height="121"
            className="max-w-full h-auto"
            srcSet="/images/knight-moves.png 1x, /images/knight-moves@2x.png 2x"
            src="/images/knight-moves.png"
            alt="Ain't it funny how the knight moves?"
          />
        </h1>
        <p className="hidden lg:block pb-4 text-m lg:text-lg">{rules}</p>
        <RoundProgressIndicator {...progressIndicatorProps} />
        <div className="flex flex-row -mx-2">
          <div className="px-2 flex-1 text-center">
            <Button primary onClick={reset}>
              Reset
            </Button>
          </div>
          <div className="lg:hidden px-2 flex-1 text-center">
            <Button onClick={openHelp}>Help</Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col flex-1 px-4">
        <div className="m-auto border-brown border-4">
          <Chessboard
            calcWidth={calcWidth}
            allowDrag={allowDrag}
            onDrop={onDrop}
            onSquareClick={onSquareClick}
            position={state.position}
          />
        </div>
        <StraightProgressIndicator {...progressIndicatorProps} />
        <p className="py-4 hidden lg:block lg:text-center">{credits}</p>
      </section>
      <Modal open={isHelpOpen}>
        <p className="text-m pb-2">{rules}</p>
        <p className="text-m pb-2">{credits}</p>
        <p className="text-m pt-2">
          <Button primary onClick={closeHelp}>
            Ok
          </Button>
        </p>
      </Modal>
    </main>
  );
}
