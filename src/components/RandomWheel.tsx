import { useMemo, useState } from "react";
import { Dices, Crosshair } from "lucide-react";
import { weapons, drugs, type Item } from "@/data/items";
import { ItemCard } from "./ItemCard";
import { ItemModal } from "./ItemModal";

type Cat = "firearms" | "drugs";
type Tier = "test" | 1 | 1.5 | 2;

const TIER_OPTIONS: Tier[] = ["test", 1, 1.5, 2];
const TIER_LABEL: Record<string, string> = {
  test: "Test Drops",
  "1": "Tier 1",
  "1.5": "Tier 1.5",
  "2": "Tier 2",
};

// How many weapons the spin reveals per tier
const SLOT_COUNT: Record<string, number> = {
  test: 2,
  "1": 4,
  "1.5": 4,
  "2": 6,
};

export function RandomWheel() {
  const [cat, setCat] = useState<Cat>("firearms");
  const [tier, setTier] = useState<Tier>("test");
  const [selected, setSelected] = useState<Item | null>(null);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<Item[]>([]);
  const [reel, setReel] = useState<Item[]>([]);

  const slotCount = cat === "firearms" ? SLOT_COUNT[String(tier)] : 2;

  const pool = useMemo(() => {
    if (cat === "firearms") {
      if (tier === "test") return weapons.filter((w) => w.testDrop);
      return weapons.filter((w) => w.tier === tier);
    }
    if (tier === "test" || tier === 1) return drugs.filter((d) => ["Common", "Uncommon"].includes(d.rarity));
    if (tier === 1.5) return drugs.filter((d) => ["Uncommon", "Rare"].includes(d.rarity));
    return drugs.filter((d) => ["Rare", "Epic", "Legendary"].includes(d.rarity));
  }, [cat, tier]);

  const displayReel = reel.length
    ? reel
    : Array.from({ length: slotCount }, (_, i) => pool[i % Math.max(pool.length, 1)]).filter(Boolean);

  const resetState = () => {
    setResults([]);
    setReel([]);
  };

  const roll = () => {
    if (pool.length === 0) return;
    setRolling(true);
    setResults([]);
    setReel([]);

    let ticks = 0;
    const totalTicks = 22;
    const interval = setInterval(() => {
      setReel(Array.from({ length: slotCount }, () => pool[Math.floor(Math.random() * pool.length)]));
      ticks++;
      if (ticks >= totalTicks) {
        clearInterval(interval);
        const final = Array.from({ length: slotCount }, () => pool[Math.floor(Math.random() * pool.length)]);
        setReel(final);
        setResults(final);
        setRolling(false);
      }
    }, 80);
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          <div className="flex justify-start">
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              {(["firearms", "drugs"] as Cat[]).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCat(c);
                    resetState();
                  }}
                  className={`rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    cat === c ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              The Chi: Cinematic V1 · Illegal Area
            </div>
            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">RANDOM WHEEL</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex flex-wrap rounded-md border border-border bg-card p-1">
              {TIER_OPTIONS.map((t) => (
                <button
                  key={String(t)}
                  onClick={() => {
                    setTier(t);
                    resetState();
                  }}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    tier === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {TIER_LABEL[String(t)]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-8 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: slotCount }).map((_, i) => {
            const it = displayReel[i];
            if (!it) {
              return (
                <div
                  key={`empty-${i}`}
                  className="aspect-[3/4] rounded-md border border-border bg-card/60"
                />
              );
            }
            const isWinner = !rolling && results.length > 0;
            return (
              <button
                key={`${it.id}-${i}`}
                onClick={() => setSelected(it)}
                className={`flex aspect-[3/4] flex-col items-center justify-between rounded-md border p-2 text-center transition hover:border-ring ${
                  isWinner
                    ? "border-amber-400 bg-amber-400/15 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                    : rolling
                      ? "scale-[1.04] border-amber-400 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.5)] animate-pulse"
                      : "border-border bg-card"
                }`}
              >
                <div className="grid h-10 w-10 place-items-center rounded text-amber-400">
                  <Crosshair className="h-6 w-6" />
                </div>
                <div className="text-[11px] font-semibold leading-tight">{it.name}</div>
                <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{it.rarity}</div>
              </button>
            );
          })}
        </div>

        <button
          onClick={roll}
          disabled={rolling || pool.length === 0}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-md bg-slate-100 px-6 py-5 text-base font-black uppercase tracking-wider text-slate-900 shadow transition hover:bg-white disabled:opacity-60"
        >
          <Dices className={`h-5 w-5 ${rolling ? "animate-spin" : ""}`} />
          {rolling ? "Rolling..." : `ROLL ${TIER_LABEL[String(tier)].toUpperCase()} (${slotCount})`}
        </button>

        {results.length > 0 && !rolling && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Your {TIER_LABEL[String(tier)]} Drop
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item, idx) => (
                <ItemCard key={`${item.id}-${idx}`} item={item} onClick={() => setSelected(item)} />
              ))}
            </div>
          </div>
        )}
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
