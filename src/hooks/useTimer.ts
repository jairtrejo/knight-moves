import { useCallback, useEffect, useState } from 'react';

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

export default function useTimer(startTime?: Date, stopTime?: Date) {
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

  return startTime ? time : "";
}
