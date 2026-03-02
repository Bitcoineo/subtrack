"use client";

import { useEffect, useState } from "react";

interface NodeData {
  emoji: string;
  label: string;
}

const SET_A: NodeData[] = [
  { emoji: "\u{1F4CA}", label: "Analytics" },
  { emoji: "\u{1F4B3}", label: "Billing" },
  { emoji: "\u{1F465}", label: "Teams" },
  { emoji: "\u{1F512}", label: "Security" },
  { emoji: "\u26A1", label: "API" },
  { emoji: "\u{1F4C8}", label: "Growth" },
];

const SET_B: NodeData[] = [
  { emoji: "\u{1F504}", label: "Subscriptions" },
  { emoji: "\u{1F3AF}", label: "Projects" },
  { emoji: "\u{1F4E7}", label: "Invoices" },
  { emoji: "\u{1F6E1}\uFE0F", label: "Auth" },
  { emoji: "\u{1F48E}", label: "Pro" },
  { emoji: "\u{1F30D}", label: "Global" },
];

// 6 nodes in hex around center (280,280) at radius 190 in 560×560 box
const NODES = [
  { x: 280, y: 90 },
  { x: 445, y: 185 },
  { x: 445, y: 375 },
  { x: 280, y: 470 },
  { x: 115, y: 375 },
  { x: 115, y: 185 },
];

const CX = 280;
const CY = 280;
const LINE_LEN = 191;

// Orbiting particles: radius from center, orbit duration, starting angle
const PARTICLES = [
  { r: 100, dur: 8, angle: 0, reverse: false },
  { r: 130, dur: 12, angle: 90, reverse: true },
  { r: 160, dur: 15, angle: 200, reverse: false },
  { r: 80, dur: 10, angle: 300, reverse: true },
];

export function HubAndSpoke() {
  const [items, setItems] = useState(SET_A);
  const [fading, setFading] = useState<Set<number>>(new Set());
  const [nodeKeys, setNodeKeys] = useState([0, 0, 0, 0, 0, 0]);

  // Icon cycling: starts after 1.5s, swaps 3 random nodes every 2s
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const startDelay = setTimeout(() => {
      intervalId = setInterval(() => {
        // Pick 3 unique random indices
        const indices: number[] = [];
        while (indices.length < 3) {
          const idx = Math.floor(Math.random() * 6);
          if (!indices.includes(idx)) indices.push(idx);
        }

        // Shrink + fade out (200ms)
        setFading(new Set(indices));

        // Swap items + bounce in
        setTimeout(() => {
          setItems((prev) => {
            const next = [...prev];
            for (const idx of indices) {
              next[idx] =
                prev[idx].emoji === SET_A[idx].emoji
                  ? SET_B[idx]
                  : SET_A[idx];
            }
            return next;
          });
          setNodeKeys((prev) => {
            const next = [...prev];
            for (const idx of indices) {
              next[idx]++;
            }
            return next;
          });
          setFading(new Set());
        }, 200);
      }, 2000);
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {/* Desktop (md+) — fills parent container */}
      <div className="hidden md:block">
        <div className="hub-container relative w-full aspect-square">
          {/* Background glow — subtle accent blue radial, pulsing */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #0666EB 0%, transparent 65%)",
              animation: "hub-glow 4s ease-in-out infinite",
              willChange: "opacity",
            }}
          />

          {/* SVG layer: particles, base lines, flow lines */}
          <svg
            viewBox="0 0 560 560"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            {/* Orbiting particles */}
            {PARTICLES.map((p, i) => (
              <g
                key={`orbit-${i}`}
                style={{
                  transformOrigin: `${CX}px ${CY}px`,
                  animation: `hub-orbit ${p.dur}s linear infinite`,
                  animationDirection: p.reverse ? "reverse" : "normal",
                  willChange: "transform",
                }}
              >
                <circle
                  cx={CX + p.r * Math.sin((p.angle * Math.PI) / 180)}
                  cy={CY - p.r * Math.cos((p.angle * Math.PI) / 180)}
                  r={2}
                  fill="#0666EB"
                  opacity={0.3}
                />
              </g>
            ))}

            {/* Base lines — draw in staggered, then stay */}
            {NODES.map((node, i) => (
              <line
                key={`base-${i}`}
                x1={CX}
                y1={CY}
                x2={node.x}
                y2={node.y}
                stroke="#D1D5DB"
                strokeWidth={1.5}
                strokeDasharray={LINE_LEN}
                strokeDashoffset={LINE_LEN}
                style={{
                  animation: `hub-line-draw 400ms ease-out ${300 + i * 150}ms forwards`,
                }}
              />
            ))}

            {/* Flow lines — dashed overlay, continuous dash movement */}
            {NODES.map((node, i) => (
              <line
                key={`flow-${i}`}
                x1={CX}
                y1={CY}
                x2={node.x}
                y2={node.y}
                stroke="#0666EB"
                strokeWidth={1}
                strokeDasharray="8 12"
                style={{
                  opacity: 0,
                  animation: `hub-line-fade-in 400ms ease-out ${1200 + i * 100}ms forwards, hub-line-flow ${3 + i * 0.5}s linear ${1200 + i * 100}ms infinite`,
                  willChange: "stroke-dashoffset",
                }}
              />
            ))}
          </svg>

          {/* Pulsing sonar rings — expand outward from center and fade */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: 72,
              height: 72,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full border border-[#0666EB]"
              style={{
                opacity: 0,
                animation: "hub-sonar 3s ease-out 1s infinite",
                willChange: "transform, opacity",
              }}
            />
            <div
              className="absolute inset-0 rounded-full border border-[#0666EB]"
              style={{
                opacity: 0,
                animation: "hub-sonar 3s ease-out 2.5s infinite",
                willChange: "transform, opacity",
              }}
            />
          </div>

          {/* Center node — scale in, then pulse */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="w-[72px] h-[72px] bg-white border-2 border-[#191C1F] rounded-full flex items-center justify-center"
              style={{
                opacity: 0,
                transform: "scale(0)",
                animation:
                  "hub-center-in 300ms ease-out forwards, hub-pulse 3s ease-in-out 1.5s infinite",
                boxShadow:
                  "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
                willChange: "transform",
              }}
            >
              {/* Inner rotation wrapper */}
              <div
                style={{
                  animation: "hub-center-rotate 20s linear infinite",
                  willChange: "transform",
                }}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="14" width="20" height="8" rx="2.5" fill="#0666EB" />
                  <rect x="4" y="8" width="16" height="8" rx="2.5" fill="#0666EB" opacity="0.45" />
                  <rect x="6" y="2" width="12" height="8" rx="2" fill="#0666EB" opacity="0.2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature nodes — entrance slide, then bounce on swap */}
          {NODES.map((node, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center gap-1.5"
              style={{
                left: `${(node.x / 560) * 100}%`,
                top: `${(node.y / 560) * 100}%`,
                opacity: 0,
                transform: "translate(-50%, -50%)",
                animation: `hub-node-in 400ms ease-out ${700 + i * 150}ms forwards`,
              }}
            >
              <div
                key={nodeKeys[i]}
                className="w-14 h-14 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-2xl"
                style={
                  nodeKeys[i] > 0
                    ? {
                        animation:
                          "hub-node-bounce 300ms ease-out forwards",
                        willChange: "transform, opacity",
                      }
                    : {
                        opacity: fading.has(i) ? 0 : 1,
                        transform: fading.has(i) ? "scale(0.8)" : "scale(1)",
                        transition:
                          "opacity 200ms ease-out, transform 200ms ease-out",
                      }
                }
              >
                {items[i].emoji}
              </div>
              <span
                className="text-[11px] font-medium text-gray-400"
                style={{
                  opacity: fading.has(i) ? 0 : 1,
                  transition: "opacity 200ms ease-out",
                }}
              >
                {items[i].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (< md) — compact grid, same cycling + bounce */}
      <div className="hub-container flex md:hidden flex-col items-center py-4">
        <div
          className="w-16 h-16 bg-white border-2 border-[#191C1F] rounded-full flex items-center justify-center mb-6"
          style={{
            opacity: 0,
            transform: "scale(0)",
            animation:
              "hub-center-in 300ms ease-out forwards, hub-pulse 3s ease-in-out 1.5s infinite",
            boxShadow:
              "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              animation: "hub-center-rotate 20s linear infinite",
              willChange: "transform",
            }}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="14" width="20" height="8" rx="2.5" fill="#0666EB" />
              <rect x="4" y="8" width="16" height="8" rx="2.5" fill="#0666EB" opacity="0.45" />
              <rect x="6" y="2" width="12" height="8" rx="2" fill="#0666EB" opacity="0.2" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5"
              style={{
                opacity: 0,
                animation: `hub-mobile-in 400ms ease-out ${300 + i * 100}ms forwards`,
              }}
            >
              <div
                key={nodeKeys[i]}
                className="w-14 h-14 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-center text-2xl"
                style={
                  nodeKeys[i] > 0
                    ? {
                        animation:
                          "hub-node-bounce 300ms ease-out forwards",
                        willChange: "transform, opacity",
                      }
                    : {
                        opacity: fading.has(i) ? 0 : 1,
                        transform: fading.has(i) ? "scale(0.8)" : "scale(1)",
                        transition:
                          "opacity 200ms ease-out, transform 200ms ease-out",
                      }
                }
              >
                {item.emoji}
              </div>
              <span
                className="text-[11px] font-medium text-gray-400"
                style={{
                  opacity: fading.has(i) ? 0 : 1,
                  transition: "opacity 200ms ease-out",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
