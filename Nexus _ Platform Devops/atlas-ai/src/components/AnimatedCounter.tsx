"use client";
import { useState, useEffect } from "react";

export default function AnimatedCounter({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        clearInterval(interval);
        setCount(value);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}