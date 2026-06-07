import { useEffect, useMemo, useState } from "react";

export type SnowIntensity = "off" | "low" | "medium-low" | "medium" | "high";

const INTENSITY_MAP: Record<SnowIntensity, { count: number; speed: number }> = {
  off: { count: 0, speed: 1 },
  low: { count: 20, speed: 1.3 },
  "medium-low": { count: 40, speed: 1 },
  medium: { count: 70, speed: 0.85 },
  high: { count: 110, speed: 0.7 },
};

export function Snowfall({ intensity = "medium-low" }: { intensity?: SnowIntensity }) {
  const [active, setActive] = useState(
    typeof document === "undefined" ? true : !document.hidden,
  );

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const { count, speed } = INTENSITY_MAP[intensity];

  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: (8 + Math.random() * 10) * speed,
        delay: -Math.random() * 18,
        drift: -20 + Math.random() * 40,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [count, speed],
  );

  if (count === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {flakes.map((f) => (
        <span
          key={f.id}
          className="absolute top-[-10px] block rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            filter: "blur(0.4px)",
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
            animationPlayState: active ? "running" : "paused",
            willChange: "transform",
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes snowfall {
          0% { transform: translate3d(0, -10vh, 0); }
          100% { transform: translate3d(var(--drift), 110vh, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-snowflake] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
