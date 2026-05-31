import { useMemo, useState } from "react";
import { Dices, Crosshair } from "lucide-react";
import { weapons, drugs, type Item } from "@/data/items";
import { ItemCard } from "./ItemCard";
import { ItemModal } from "./ItemModal";

type Cat = "firearms" | "drugs";
type Tier = 1 | 1.5 | 2;
type DropMode = "wheel" | "test";

export function RandomWheel() {
  const [cat, setCat] = useState<Cat>("firearms");
  const [tier, setTier] = useState<Tier>(1);
  const [mode, setMode] = useState<DropMode>("wheel");
  const [selected, setSelected] = useState<Item | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState<Item | null>(null);
  const [testResults, setTestResults] = useState<Item[]>([]);

  const pool = useMemo(() => {
    if (cat === "firearms") {
      const firearms = weapons.filter((w) => w.tier === 1);
      return firearms.slice(0, tier === 2 ? 6 : 4);
    }

    if (tier === 1) return drugs.filter((d) => ["Common", "Uncommon"].includes(d.rarity));
    if (tier === 1.5) return drugs.filter((d) => ["Uncommon", "Rare"].includes(d.rarity));
    return drugs.filter((d) => ["Rare", "Epic", "Legendary"].includes(d.rarity));
  }, [cat, tier]);

  const reelItems = useMemo(() => {
    if (pool.length === 0) return [] as Item[];
    return Array.from({ length: 9 }, (_, i) => pool[i % pool.length]);
  }, [pool]);

  const [reel, setReel] = useState<Item[]>([]);
  const [highlightIdx, setHighlightIdx] = useState<number>(-1);
  const displayReel = reel.length ? reel : reelItems;

  const roll = () => {
    if (pool.length === 0) return;
    if (mode === "test") {
      return testDrop();
    }

    setRolling(true);
    setRolled(null);
    setTestResults([]);
    setReel([]);
    let n = 0;
    const interval = setInterval(() => {
      setReel(Array.from({ length: 9 }, () => pool[Math.floor(Math.random() * pool.length)]));
      setHighlightIdx(n % 9);
      n++;
      if (n > 18) {
        clearInterval(interval);
        const final = pool[Math.floor(Math.random() * pool.length)];
        setReel((prev) => {
          const copy = [...prev];
          copy[4] = final;
          return copy;
        });
        setHighlightIdx(4);
        setRolled(final);
        setRolling(false);
      }
    }, 80);
  };

  const testDrop = () => {
    if (pool.length === 0) return;

    setRolling(true);
    setRolled(null);
    setTestResults([]);
    setReel([]);

    setTimeout(() => {
      const available = [...pool];
      const results: Item[] = [];

      while (results.length < 2 && available.length > 0) {
        const index = Math.floor(Math.random() * available.length);
        results.push(available.splice(index, 1)[0]);
      }

      setTestResults(results);
      setRolling(false);
    }, 600);
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
                    setRolled(null);
                    setTestResults([]);
                    setReel([]);
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
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              {([1, 1.5, 2] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTier(t);
                    setRolled(null);
                    setTestResults([]);
                    setReel([]);
                  }}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    tier === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tier {t}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              {(["wheel", "test"] as DropMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setRolled(null);
                    setTestResults([]);
                    setReel([]);
                  }}
                  className={`rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    mode === m ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "wheel" ? "Wheel" : "Test Drop"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-10 gap-2">
          {Array.from({ length: 10 }).map((_, i) => {
            if (i === 9) {
              return (
                <div
                  key="roll-slot"
                  className="flex aspect-[3/4] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/40 text-muted-foreground"
                >
                  <Dices className="h-7 w-7" />
                </div>
              );
            }
            const it = displayReel[i];
            if (!it) {
              return (
                <div
                  key={`empty-${i}`}
                  className="aspect-[3/4] rounded-md border border-border bg-card/60"
                />
              );
            }
            const isCenter = i === 4;
            const isWinner = !rolling && rolled && isCenter && rolled.id === it.id;
            return (
              <button
                key={`${it.id}-${i}`}
                onClick={() => setSelected(it)}
                className={`flex aspect-[3/4] flex-col items-center justify-between rounded-md border p-2 text-center transition hover:border-ring ${
                  isWinner
                    ? "border-amber-400 bg-amber-400/15 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                    : isCenter
                      ? "scale-[1.06] border-amber-400 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.5)]"
                      : "border-border bg-card"
                } ${rolling && isCenter ? "animate-pulse" : ""}`}
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
          <Dices className="h-5 w-5" />
          {mode === "test" ? "ROLL TEST DROP" : "ROLL RANDOM"}
        </button>

        {mode === "test" ? (
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Your Test Drop</div>
            {testResults.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a tier and roll to reveal two items from the current pool.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {testResults.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          rolled && !rolling && (
            <div className="mt-6 rounded-lg border border-border bg-card p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Your Drop Result</div>
              <div className="mt-2 text-2xl font-bold">{rolled.name}</div>
              <div className="text-sm text-muted-foreground">{rolled.rarity}</div>
              <button
                onClick={() => setSelected(rolled)}
                className="mt-3 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-accent"
              >
                View details
              </button>
            </div>
          )
        )}
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
