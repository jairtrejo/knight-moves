import React, { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../hooks/useTimer";

type ProgressIndicatorProps = {
  nextSquare: React.ReactNode;
  startTime?: Date;
  stopTime?: Date;
  progress: number;
};

export function RoundProgressIndicator({
  nextSquare,
  startTime,
  stopTime,
  progress,
}: ProgressIndicatorProps) {
  const fullArc = 198;
  const percentArc = fullArc - fullArc * progress;

  const time = useTimer(startTime, stopTime);

  return (
    <svg className="max-w-xs mx-auto hidden lg:block" viewBox="0 0 100 100">
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

export function StraightProgressIndicator({
  nextSquare,
  startTime,
  stopTime,
  progress,
}: ProgressIndicatorProps) {
  const time = useTimer(startTime, stopTime);

  return (
    <div className="block lg:hidden my-4">
      <div className="flex flex-row justify-between text-xl mb-2">
        <span className="font-bold">{nextSquare}</span>
        <span>{time}</span>
      </div>
      <div className="bg-yellow w-100 h-6">
        <div
          className="bg-orange h-6"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
