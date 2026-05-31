import { X } from "lucide-react";
import { type Item, rarityClass, rarityDot } from "@/data/items";

export function ItemModal({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${rarityClass[item.rarity]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${rarityDot[item.rarity]}`} />
                {item.rarity}
              </span>
              {item.tier !== undefined && (
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">
                  Tier {item.tier}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {Object.entries(item.stats).map(([k, v]) => (
            <div key={k} className="rounded-md border border-border bg-secondary/50 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
              <div className="mt-1 text-sm font-semibold">{String(v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
