import { useEffect, useState } from "react";
import { Snowflake } from "lucide-react";
import type { SnowIntensity } from "./Snowfall";

const OPTIONS: SnowIntensity[] = ["off", "low", "medium-low", "medium", "high"];
const LABEL: Record<SnowIntensity, string> = {
  off: "Off",
  low: "Low",
  "medium-low": "Med-Low",
  medium: "Medium",
  high: "High",
};
const STORAGE_KEY = "snow-intensity";

export function useSnowIntensity(): [SnowIntensity, (v: SnowIntensity) => void] {
  const [intensity, setIntensity] = useState<SnowIntensity>("medium-low");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SnowIntensity | null;
    if (saved && OPTIONS.includes(saved)) setIntensity(saved);
  }, []);

  const update = (v: SnowIntensity) => {
    setIntensity(v);
    localStorage.setItem(STORAGE_KEY, v);
  };

  return [intensity, update];
}

export function SnowfallControl({
  value,
  onChange,
}: {
  value: SnowIntensity;
  onChange: (v: SnowIntensity) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[70]">
      {open && (
        <div className="mb-2 flex flex-col gap-1 rounded-md border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
          <div className="px-2 pb-1 text-xs font-medium text-muted-foreground">
            Snowfall
          </div>
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded px-3 py-1 text-left text-sm transition-colors ${
                value === opt
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {LABEL[opt]}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted"
        aria-label="Snowfall settings"
      >
        <Snowflake className="h-4 w-4" />
      </button>
    </div>
  );
}
