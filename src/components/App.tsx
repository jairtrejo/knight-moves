import React, { useCallback, useState } from "react";
import Chessboard from "chessboardjsx";
import { Button, Link, Modal } from "./styled";
import {
  RoundProgressIndicator,
  StraightProgressIndicator,
} from "./ProgressIndicator";
import usePuzzle from "../hooks/usePuzzle";

export default function App() {
  const [puzzleState, { placeKnight, reset }] = usePuzzle();

  const progressIndicatorProps = {
    nextSquare: puzzleState.stopTime
      ? "\ud83d\udc4d"
    : puzzleState.nextSquare,

    startTime: puzzleState.startTime,
    stopTime: puzzleState.stopTime,
    progress: puzzleState.progress,
  };

  const rules = (
    <>
      Move the knight to every square in order, right to left, top to bottom. Except don’t land
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
            calcWidth={({ screenWidth }) => {
              return Math.min(screenWidth - 32 - 8, 560);
            }}
            allowDrag={({ piece }) => {
              return piece === "wN";
            }}
            onDrop={({ targetSquare }) => placeKnight(targetSquare)}
            onSquareClick={(square) => placeKnight(square)}
            position={puzzleState.position}
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
