import { useState } from "react";
import { X, Dices, Package } from "lucide-react";
import { weapons, drugs, type Item, rarityClass, rarityDot } from "@/data/items";
import { ItemModal } from "./ItemModal";

type Tier = 1 | 1.5 | 2;

function pickWeighted(tier: Tier): Item {
  // Weighted rarity by tier
  const weights: Record<Tier, Record<string, number>> = {
    1: { Common: 70, Uncommon: 25, Rare: 5, Epic: 0, Legendary: 0 },
    1.5: { Common: 30, Uncommon: 45, Rare: 20, Epic: 5, Legendary: 0 },
    2: { Common: 5, Uncommon: 20, Rare: 40, Epic: 30, Legendary: 5 },
  };
  const pool = [...weapons, ...drugs];
  const w = weights[tier];
  const total = pool.reduce((s, i) => s + (w[i.rarity] || 0), 0);
  let r = Math.random() * total;
  for (const it of pool) {
    r -= w[it.rarity] || 0;
    if (r <= 0) return it;
  }
  return pool[0];
}

export function SupplyDropModal({ onClose }: { onClose: () => void }) {
  const [tier, setTier] = useState<Tier>(1);
  const [results, setResults] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [opening, setOpening] = useState(false);

  const openDrop = () => {
    setOpening(true);
    setResults([]);
    setTimeout(() => {
      const drops = Array.from({ length: 5 }, () => pickWeighted(tier));
      setResults(drops);
      setOpening(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="m-auto flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold">Supply Drop</h2>
              <p className="text-xs text-muted-foreground">Open a crate for a random reward.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-2 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="inline-flex rounded-md border border-border bg-secondary p-1">
            {([1, 1.5, 2] as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase ${
                  tier === t ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
              >
                Tier {t}
              </button>
            ))}
          </div>
          <button
            onClick={openDrop}
            disabled={opening}
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            <Dices className={`h-4 w-4 ${opening ? "animate-spin" : ""}`} />
            {opening ? "Opening..." : "ROLL RANDOM"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {results.length === 0 ? (
            <div className="grid place-items-center py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground/40" />
              <p className="mt-4 text-sm text-muted-foreground">
                Pick a tier and roll to reveal your supply drop.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Your Drop Results
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {results.map((it, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelected(it)}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3 text-center transition hover:border-ring"
                    style={{ animation: `fadeIn .4s ease ${idx * 0.08}s both` }}
                  >
                    <div className="text-sm font-semibold">{it.name}</div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${rarityClass[it.rarity]}`}
                    >
                      <span className={`h-1 w-1 rounded-full ${rarityDot[it.rarity]}`} />
                      {it.rarity}
                    </span>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {it.type}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
