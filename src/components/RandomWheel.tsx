import { useMemo, useState } from "react";
import { Dices } from "lucide-react";
import { weapons, drugs, type Item } from "@/data/items";
import { ItemCard } from "./ItemCard";
import { ItemModal } from "./ItemModal";

type Cat = "firearms" | "drugs";
type Tier = 1 | 1.5 | 2;

export function RandomWheel() {
  const [cat, setCat] = useState<Cat>("firearms");
  const [tier, setTier] = useState<Tier>(1);
  const [selected, setSelected] = useState<Item | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState<Item | null>(null);

  const pool = useMemo(() => {
    if (cat === "firearms") return weapons.filter((w) => w.tier === tier);
    // drugs: bucket by rarity → tier mapping
    if (tier === 1) return drugs.filter((d) => ["Common", "Uncommon"].includes(d.rarity));
    if (tier === 1.5) return drugs.filter((d) => ["Uncommon", "Rare"].includes(d.rarity));
    return drugs.filter((d) => ["Rare", "Epic", "Legendary"].includes(d.rarity));
  }, [cat, tier]);

  const roll = () => {
    if (pool.length === 0) return;
    setRolling(true);
    let n = 0;
    const interval = setInterval(() => {
      setRolled(pool[Math.floor(Math.random() * pool.length)]);
      n++;
      if (n > 18) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          <div className="flex justify-start">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              {(["firearms", "drugs"] as Cat[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
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
              Windy City V5 · Illegal Area
            </div>
            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">RANDOM WHEEL</h2>
          </div>
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              {([1, 1.5, 2] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    tier === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tier {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {pool.map((it) => (
            <ItemCard key={it.id} item={it} onClick={() => setSelected(it)} />
          ))}
          <button
            onClick={roll}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/50 p-3 text-muted-foreground transition hover:border-ring hover:text-foreground"
          >
            <Dices className="h-8 w-8" />
            <span className="text-xs font-semibold">ROLL</span>
          </button>
        </div>

        {rolled && (
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Your Drop Result</div>
            <div className={`mt-2 text-2xl font-bold ${rolling ? "animate-pulse" : ""}`}>{rolled.name}</div>
            <div className="text-sm text-muted-foreground">{rolled.rarity}</div>
            {!rolling && (
              <button
                onClick={() => setSelected(rolled)}
                className="mt-3 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-accent"
              >
                View details
              </button>
            )}
          </div>
        )}
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
