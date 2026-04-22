"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [time, setTime] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 24;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 bg-red-500 text-dark px-3 py-1.5 rounded-md text-custom-sm font-medium">
      <span className="font-bold text-red-light-2 text-lg">
        {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;
