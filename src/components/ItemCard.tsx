import { Crosshair, Pill } from "lucide-react";
import { type Item, rarityClass, rarityDot } from "@/data/items";

export function ItemCard({ item, onClick }: { item: Item; onClick?: () => void }) {
  const Icon = item.type === "weapon" ? Crosshair : Pill;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-center transition hover:border-ring hover:bg-accent"
    >
      <div className="grid h-16 w-16 place-items-center rounded-md bg-secondary/60 text-amber-400">
        <Icon className="h-8 w-8" />
      </div>
      <div className="text-sm font-semibold leading-tight">{item.name}</div>
      <div
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${rarityClass[item.rarity]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${rarityDot[item.rarity]}`} />
        {item.rarity}
      </div>
    </button>
  );
}
