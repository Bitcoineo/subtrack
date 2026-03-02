"use client";

import { useEffect, useState } from "react";

const SET_A = ["\u{1F4CA}", "\u{1F4B3}", "\u{1F465}", "\u{1F512}", "\u26A1", "\u{1F4C8}"];
const SET_B = ["\u{1F504}", "\u{1F3AF}", "\u{1F4E7}", "\u{1F6E1}\uFE0F", "\u{1F48E}", "\u{1F30D}"];

// 6 nodes arranged in a hex around center (200,200) at radius 140 in a 400x400 box
// Angles: -90, -30, 30, 90, 150, 210 degrees
const NODES = [
  { x: 200, y: 60 },
  { x: 321, y: 130 },
  { x: 321, y: 270 },
  { x: 200, y: 340 },
  { x: 79, y: 270 },
  { x: 79, y: 130 },
];

const CX = 200;
const CY = 200;

export function HubAndSpoke() {
  const [icons, setIcons] = useState(SET_A);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [fading, setFading] = useState<Set<number>>(new Set());

  // Entry sequence
  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 100);
    // Entry ~1.5s + 2s pause before cycling
    const t2 = setTimeout(() => setRevealed(true), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Icon cycling after reveal
  useEffect(() => {
    if (!revealed) return;

    const interval = setInterval(() => {
      const idx1 = Math.floor(Math.random() * 6);
      let idx2 = Math.floor(Math.random() * 5);
      if (idx2 >= idx1) idx2++;

      setFading(new Set([idx1, idx2]));

      setTimeout(() => {
        setIcons((prev) => {
          const next = [...prev];
          next[idx1] = prev[idx1] === SET_A[idx1] ? SET_B[idx1] : SET_A[idx1];
          next[idx2] = prev[idx2] === SET_A[idx2] ? SET_B[idx2] : SET_A[idx2];
          return next;
        });
        setFading(new Set());
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [revealed]);

  return (
    <>
      {/* Desktop: hub-and-spoke */}
      <div className="hidden sm:flex justify-center py-6">
        <div className="relative w-[400px] h-[400px]">
          {/* SVG lines */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            {NODES.map((node, i) => (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={node.x}
                y2={node.y}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="6 4"
                style={{
                  opacity: started ? 1 : 0,
                  transition: "opacity 400ms ease-out",
                  transitionDelay: revealed ? "0ms" : `${300 + i * 150}ms`,
                }}
              />
            ))}
          </svg>

          {/* Center node — positioned wrapper */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="w-16 h-16 bg-white border-2 border-accent rounded-full shadow-md flex items-center justify-center"
              style={{
                opacity: started ? 1 : 0,
                transition: "opacity 300ms ease-out",
                animation: started
                  ? "hub-pulse 3s ease-in-out infinite 2s"
                  : "none",
              }}
            >
              <svg
                className="w-7 h-7 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
              </svg>
            </div>
          </div>

          {/* Feature nodes */}
          {NODES.map((node, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-xl"
              style={{
                left: `${(node.x / 400) * 100}%`,
                top: `${(node.y / 400) * 100}%`,
                transform: "translate(-50%, -50%)",
                opacity: started && !fading.has(i) ? 1 : 0,
                transition: "opacity 300ms ease-out",
                transitionDelay:
                  !revealed ? `${600 + i * 150}ms` : "0ms",
              }}
            >
              {icons[i]}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: grid layout */}
      <div className="flex sm:hidden flex-col items-center py-8">
        <div
          className="w-14 h-14 bg-white border-2 border-accent rounded-full shadow-md flex items-center justify-center mb-5"
          style={{
            opacity: started ? 1 : 0,
            transition: "opacity 300ms ease-out",
            animation: started
              ? "hub-pulse 3s ease-in-out infinite 1s"
              : "none",
          }}
        >
          <svg
            className="w-6 h-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {icons.map((icon, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-xl"
              style={{
                opacity: started && !fading.has(i) ? 1 : 0,
                transition: "opacity 300ms ease-out",
                transitionDelay:
                  !revealed ? `${300 + i * 100}ms` : "0ms",
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
