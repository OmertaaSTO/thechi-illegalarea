import { useMemo } from "react";

export function Snowfall({ count = 40 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: -20 + Math.random() * 40,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [count],
  );

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
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes snowfall {
          0% { transform: translate3d(0, -10vh, 0); }
          100% { transform: translate3d(var(--drift), 110vh, 0); }
        }
      `}</style>
    </div>
  );
}
