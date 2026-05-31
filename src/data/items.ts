import data from "./items.json";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
export type Item = {
  id: string;
  name: string;
  type: "weapon" | "drug";
  rarity: Rarity;
  tier?: number;
  description: string;
  tags: string[];
  image?: string;
  stats: Record<string, string | number>;
};

export const items = data as Item[];
export const weapons = items.filter((i) => i.type === "weapon");
export const drugs = items.filter((i) => i.type === "drug");

export const rarityClass: Record<Rarity, string> = {
  Common: "text-slate-300 border-slate-600/60 bg-slate-700/30",
  Uncommon: "text-emerald-300 border-emerald-600/60 bg-emerald-700/20",
  Rare: "text-sky-300 border-sky-600/60 bg-sky-700/20",
  Epic: "text-fuchsia-300 border-fuchsia-600/60 bg-fuchsia-700/20",
  Legendary: "text-amber-300 border-amber-500/60 bg-amber-600/20",
};

export const rarityDot: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-fuchsia-400",
  Legendary: "bg-amber-400",
};
