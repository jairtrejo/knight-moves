import React, { useCallback, useEffect, useRef, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance } from "chess.js";

const queenSquare = "d5";
const startingPosition = "7N/8/8/3q4/8/8/8/8 w - - 0 1";
const attackedByQueenSquares = new Set([
  "d8",
  "d7",
  "d6",
  "d5",
  "d4",
  "d3",
  "d2",
  "d1",
  "g8",
  "f7",
  "e6",
  "d5",
  "c4",
  "b3",
  "a2",
  "h5",
  "g5",
  "f5",
  "e5",
  "d5",
  "c5",
  "b5",
  "a5",
  "h1",
  "g2",
  "f3",
  "e4",
  "d5",
  "c6",
  "b7",
  "a8",
]);
const targetSquares = "87654321"
  .split("")
  .map((rank) => "hgfedcba".split("").map((file) => `${file}${rank}`))
  .reduce((prev, curr) => prev.concat(curr), [])
  .filter((square) => !attackedByQueenSquares.has(square));


//const targetSquares = ["h8", "g6", "f8"];

function resetTurn(fen: string, color: string) {
  const [
    pieces,
    _activeColor,
    castling,
    enpassant,
    halfmove,
    fullmove,
  ] = fen.split(" ");
  return [pieces, color, castling, enpassant, "0", "1"].join(" ");
}

type TimerProps = {
  startTime?: Date;
  stopTime?: Date;
};

function padTime(str: number): string {
  const padded = `0${str}`;
  return padded.substring(padded.length - 2);
}

function formatTime(timeMillis: number): string {
  timeMillis = Math.round(timeMillis / 1000);
  const s = timeMillis % 60;
  const m = ((timeMillis - s) / 60) % 60;
  const h = (timeMillis - s - m * 60) / 3600;
  return (h > 0 ? h + ":" : "") + (h > 0 ? padTime(m) : m) + ":" + padTime(s);
}

function Timer({ startTime, stopTime }: TimerProps) {
  const [time, setTime] = useState<string>("00:00");
  const updateCount = useCallback(() => {
    if (!startTime) {
      return;
    }

    let elapsed;
    if (stopTime) {
      elapsed = stopTime.getTime() - startTime.getTime();
    } else {
      const now = new Date();
      elapsed = now.getTime() - startTime.getTime();
    }
    const formatted = formatTime(elapsed);

    if (formatted !== time) {
      setTime(formatted);
    }
  }, [startTime, stopTime, time, setTime]);
  useEffect(() => {
    const handle = setInterval(updateCount, 100);
    return () => clearInterval(handle);
  }, [updateCount, startTime, stopTime]);
  return <>{startTime ? time : ""}</>;
}

/*
 * Progress bar
 */

type ProgressIndicatorProps = {
  nextSquare: React.ReactNode;
  time: React.ReactNode;
  progress: number;
};

function ProgressIndicator({
  nextSquare,
  time,
  progress,
}: ProgressIndicatorProps) {
  const fullArc = 198;
  const percentArc = fullArc - fullArc * progress;

  return (
    <svg viewBox="0 0 100 100">
      <circle
        className="gauge_base"
        cx="50"
        cy="50"
        fill="transparent"
        r="42"
        stroke="#FFC857"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="198 264"
        transform="rotate(135, 50, 50)"
      />
      <circle
        className="gauge_percent"
        style={{ transition: "stroke-dashoffset 0.2s linear" }}
        cx="50"
        cy="50"
        fill="transparent"
        r="42"
        stroke="#E9724C"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="198 264"
        strokeDashoffset={percentArc}
        transform="rotate(135, 50, 50)"
      />
      <text
        fontSize="32"
        fill="#481d24"
        x="50"
        y="45"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {nextSquare}
      </text>
      <text
        fontSize="8"
        fill="#481d24"
        x="50"
        y="65"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {time}
      </text>
    </svg>
  );
}

/*
 * Main app
 */

export default function App() {
  const chessRef = useRef<ChessInstance>(new Chess(startingPosition));
  const [position, setPosition] = useState<string>(startingPosition);
  useEffect(() => {
    chessRef.current.load(position);
  }, [position]);

  const [victory, setVictory] = useState<boolean>(false);

  const [nextSquareIndex, setNextSquareIndex] = useState(1);

  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [stopTime, setStopTime] = useState<Date | undefined>(undefined);

  const allowDrag = useCallback(({ piece }) => {
    return piece === "wN";
  }, []);

  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      const chess = chessRef.current;

      const knightMove = chess.move({ from: sourceSquare, to: targetSquare });
      const isCapturingQueen = targetSquare === queenSquare;
      const canBeCapturedByQueen = attackedByQueenSquares.has(targetSquare);
      const isCheating = isCapturingQueen || canBeCapturedByQueen;

      if (knightMove && !isCheating) {
        if (nextSquareIndex === targetSquares.length - 1) {
          setVictory(true);
          setStopTime(new Date());
        }
        setNextSquareIndex((nextSquareIndex) =>
          targetSquare === targetSquares[nextSquareIndex]
            ? nextSquareIndex + 1
            : nextSquareIndex
        );
        setPosition(resetTurn(chess.fen(), "w"));
        if (!startTime) {
          setStartTime(new Date());
        }
      } else {
        chess.undo();
      }
    },
    [
      chessRef,
      setNextSquareIndex,
      setPosition,
      resetTurn,
      startTime,
      setStartTime,
    ]
  );

  const reset = useCallback(() => {
    setPosition(startingPosition);
    setNextSquareIndex(1);
    setStartTime(undefined);
    setStopTime(undefined);
    setVictory(false);
  }, [setPosition, setNextSquareIndex, setStartTime]);

  return (
    <>
      <img
        srcSet="/images/knight-moves.png 1x, /images/knight-moves@2x.png 2x"
        src="/images/knight-moves.png"
        alt="Ain't it funny how the knight moves?"
      />
      <p>
        Move the knight to every square, right to left, top to bottom. Don’t
        land anywhere the queen can take you, and don’t take the queen.
      </p>
      <div style={{ width: "200px" }}>
        <ProgressIndicator
          nextSquare={victory ? "w" : targetSquares[nextSquareIndex]}
          time={<Timer startTime={startTime} stopTime={stopTime} />}
          progress={nextSquareIndex / targetSquares.length}
        />
      </div>
      <p>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </p>
      <Chessboard allowDrag={allowDrag} onDrop={onDrop} position={position} />
      <p>
        Made by <a href="https://www.jairtrejo.com">Jair Trejo</a>. Inspired by{" "}
        <a href="https://www.youtube.com/watch?v=SrQlpY_eGYU">Ben Finegold</a>{" "}
        and{" "}
        <a href="https://open.spotify.com/track/6UBjSnyP1O5W5ndJoO9vUk?si=647834336235421b">
          Bob Seger
        </a>
      </p>
    </>
  );
}
