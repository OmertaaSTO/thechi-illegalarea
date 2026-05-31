import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { items, type Item, type Rarity, rarityClass, rarityDot } from "@/data/items";
import { ItemModal } from "./ItemModal";

const RARITIES: ("All" | Rarity)[] = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

export function CatalogModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<"weapon" | "drug" | "all">("all");
  const [rarity, setRarity] = useState<"All" | Rarity>("All");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);

  const list = useMemo(
    () =>
      items.filter(
        (i) =>
          (type === "all" || i.type === type) &&
          (rarity === "All" || i.rarity === rarity) &&
          (q.trim() === "" || i.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [type, rarity, q],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="m-auto flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="text-xl font-bold">Weapon &amp; Drug Catalog</h2>
            <p className="text-xs text-muted-foreground">Browse every item available in the city.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-2 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="inline-flex rounded-md border border-border bg-secondary p-1">
            {(["all", "weapon", "drug"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase ${
                  type === t ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "all" ? "All" : t === "weapon" ? "Weapons" : "Drugs"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {RARITIES.map((r) => (
              <button
                key={r}
                onClick={() => setRarity(r)}
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  rarity === r ? "border-ring bg-accent" : "border-border bg-secondary/60 text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="ml-auto flex min-w-[200px] flex-1 items-center gap-2 rounded-md border border-border bg-secondary px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {list.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-muted-foreground">
              No items match your search.
            </div>
          )}
          {list.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelected(it)}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 text-left transition hover:border-ring hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold">{it.name}</div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${rarityClass[it.rarity]}`}
                >
                  <span className={`h-1 w-1 rounded-full ${rarityDot[it.rarity]}`} />
                  {it.rarity}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {it.type === "weapon" ? `Weapon · Tier ${it.tier}` : "Drug"}
              </div>
              <p className="line-clamp-3 text-xs text-muted-foreground">{it.description}</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {it.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
