import { useEffect, useMemo, useRef, useState } from "react";
import { Dices, Crosshair, Pill } from "lucide-react";
import { weapons, drugs, type Item, rarityClass, rarityDot } from "@/data/items";
import { ItemModal } from "./ItemModal";

type Cat = "firearms" | "drugs";
type Tier = "test" | 1 | 1.5 | 2;
type RollResult = { item: Item; qty: number };

const TIER_OPTIONS: Tier[] = ["test", 1, 1.5, 2];
const TIER_LABEL: Record<string, string> = {
  test: "Test Drops",
  "1": "Tier 1",
  "1.5": "Tier 1.5",
  "2": "Tier 2",
};

const WEAPON_SLOTS: Record<string, number> = {
  test: 2,
  "1": 4,
  "1.5": 4,
  "2": 6,
};

// Drugs: distinct types per spin + total quantity distributed across them
const DRUG_TYPES: Record<string, number> = { test: 2, "1": 4, "1.5": 4, "2": 6 };
const DRUG_TOTAL: Record<string, number> = { test: 10, "1": 25, "1.5": 25, "2": 45 };
const DRUG_LEGENDARY_CAP: Record<string, number> = { test: 1, "1": 1, "1.5": 1, "2": 2 };

const VISIBLE_SLOTS = 9;
const CENTER_INDEX = Math.floor(VISIBLE_SLOTS / 2);
const STRIP_LENGTH = 60;
const WINNER_INDEX = STRIP_LENGTH - 1 - CENTER_INDEX;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type RarityWeights = Partial<Record<Item["rarity"], number>>;

const WEAPON_TIER_CONFIG: Record<string, {
  switchChance: () => number;
  bigGunChance: () => number;
  rarityWeights: () => RarityWeights;
}> = {
  "1": {
    switchChance: () => rand(0.10, 0.15),
    bigGunChance: () => 0,
    rarityWeights: () => ({
      Common: rand(40, 45),
      Uncommon: rand(20, 25),
      Rare: rand(23, 25),
      Epic: 10,
      Legendary: 0,
    }),
  },
  "1.5": {
    switchChance: () => rand(0.15, 0.17),
    bigGunChance: () => rand(0.13, 0.17),
    rarityWeights: () => ({
      Common: rand(38, 43),
      Uncommon: rand(30, 35),
      Rare: rand(25, 29),
      Epic: 17,
      Legendary: rand(15, 17),
    }),
  },
  "2": {
    switchChance: () => rand(0.20, 0.25),
    bigGunChance: () => rand(0.19, 0.23),
    rarityWeights: () => ({
      Common: rand(28, 35),
      Uncommon: rand(40, 45),
      Rare: rand(28, 30),
      Epic: rand(19, 20),
      Legendary: 19,
    }),
  },
};

const DRUG_TIER_WEIGHTS: Record<string, RarityWeights> = {
  test: { Common: 50, Uncommon: 30, Rare: 25, Epic: 20, Legendary: 20 },
  "1": { Common: 50, Uncommon: 30, Rare: 25, Epic: 20, Legendary: 20 },
  "1.5": { Common: 50, Uncommon: 30, Rare: 25, Epic: 20, Legendary: 20 },
  "2": { Common: 30, Uncommon: 45, Rare: 30, Epic: 25, Legendary: 28 },
};

function weightedPick(items: Item[], weights: RarityWeights): Item {
  const scored = items.map((i) => ({ i, w: weights[i.rarity] ?? 0 }));
  const total = scored.reduce((s, x) => s + x.w, 0);
  if (total <= 0) return items[Math.floor(Math.random() * items.length)];
  let r = Math.random() * total;
  for (const { i, w } of scored) {
    r -= w;
    if (r <= 0) return i;
  }
  return scored[scored.length - 1].i;
}

// Split `total` into `parts` positive integers
function splitTotal(total: number, parts: number): number[] {
  if (parts <= 1) return [total];
  if (total < parts) {
    const out = new Array(parts).fill(0);
    for (let i = 0; i < total; i++) out[i] = 1;
    return out;
  }
  const cuts = new Set<number>();
  while (cuts.size < parts - 1) cuts.add(1 + Math.floor(Math.random() * (total - 1)));
  const sorted = [...cuts].sort((a, b) => a - b);
  const result: number[] = [];
  let prev = 0;
  for (const c of sorted) {
    result.push(c - prev);
    prev = c;
  }
  result.push(total - prev);
  return result;
}

export function RandomWheel() {
  const [cat, setCat] = useState<Cat>("firearms");
  const [tier, setTier] = useState<Tier>("test");
  const [selected, setSelected] = useState<Item | null>(null);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<RollResult[]>([]);
  const [strip, setStrip] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [animateOffset, setAnimateOffset] = useState(true);
  const [landed, setLanded] = useState(false);
  const reelRef = useRef<HTMLDivElement | null>(null);
  

  const TEST_DROP_NAMES = useMemo(
    () =>
      new Set([
        "S&W SD40 TAN",
        "FN 502 TACTICAL",
        "GLOCK 19X COYOTE",
        "GLOCK 45 CAMO",
        "ROCK FN57",
        "GLOCK 17 BLACK",
        "M&P 9 2.0",
        "PSA P80 GLOCK 19",
        "GLOCK 20C",
        "KAVORKA GLOCK 43X",
        "PSA GLOCK 19",
        "GLOCK 45 GEN 5",
        "GLOCK 45 AMERICAN",
        "GLOCK 17 GEN 3 P80",
        "P320 SIG",
      ]),
    [],
  );

  // Weapon pool restricted by tier (with cross-tier rules)
  const weaponPool = useMemo(() => {
    if (tier === "test") return weapons.filter((w) => TEST_DROP_NAMES.has(w.name));
    if (tier === 1) return weapons.filter((w) => (w.tier ?? 1) === 1);
    if (tier === 1.5) return weapons.filter((w) => (w.tier ?? 1) <= 1.5);
    return weapons;
  }, [tier, TEST_DROP_NAMES]);

  const drugPool = useMemo(() => drugs, []);

  const totalSpins =
    cat === "firearms" ? WEAPON_SLOTS[String(tier)] : DRUG_TYPES[String(tier)];

  const isSwitch = (it: Item) => /switch/i.test(it.name);
  const isBigGun = (it: Item) => /draco|arp|ar\b|ak|rifle|binary/i.test(it.name);

  // Pick a weapon obeying tier weights + per-roll caps
  const pickWeapon = (
    pool: Item[],
    counts: { perName: Map<string, number>; switches: number; bigs: number },
  ): Item => {
    const cfg = WEAPON_TIER_CONFIG[String(tier)];
    const eligible = pool.filter((w) => {
      const cap = w.rarity === "Epic" || w.rarity === "Legendary" ? 1 : 2;
      if ((counts.perName.get(w.name) ?? 0) >= cap) return false;
      if (isSwitch(w) && counts.switches >= 2) return false;
      if (isBigGun(w) && counts.bigs >= 2) return false;
      return true;
    });
    const fallback = eligible.length ? eligible : pool;

    if (cfg) {
      const switches = fallback.filter(isSwitch);
      if (switches.length && counts.switches < 2 && Math.random() < cfg.switchChance()) {
        return switches[Math.floor(Math.random() * switches.length)];
      }
      const bigs = fallback.filter(isBigGun);
      if (bigs.length && counts.bigs < 2 && Math.random() < cfg.bigGunChance()) {
        return bigs[Math.floor(Math.random() * bigs.length)];
      }
      return weightedPick(fallback, cfg.rarityWeights());
    }
    return fallback[Math.floor(Math.random() * fallback.length)];
  };

  const buildStrip = (winner: Item, pool: Item[]): Item[] => {
    const arr: Item[] = [];
    for (let i = 0; i < STRIP_LENGTH; i++) {
      arr.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    arr[WINNER_INDEX] = winner;
    return arr;
  };

  const measureTile = () => {
    const el = reelRef.current;
    if (!el) return 112;
    return el.clientWidth / VISIBLE_SLOTS;
  };

  const resetState = () => {
    setResults([]);
    setStrip([]);
    setLanded(false);
    setAnimateOffset(false);
    setOffset(0);
  };

  const spinTo = async (winner: Item, pool: Item[]): Promise<void> => {
    const newStrip = buildStrip(winner, pool);
    setAnimateOffset(false);
    setStrip(newStrip);
    setOffset(0);
    setLanded(false);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const tw = measureTile();
    
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const jitter = (Math.random() - 0.5) * (tw * 0.3);
    const target = WINNER_INDEX * tw - CENTER_INDEX * tw + jitter;
    setAnimateOffset(true);
    setOffset(target);
    await new Promise((r) => setTimeout(r, 3600));
    setLanded(true);
    await new Promise((r) => setTimeout(r, 450));
  };

  const roll = async () => {
    if (rolling) return;
    setRolling(true);
    setResults([]);

    if (cat === "firearms") {
      if (weaponPool.length === 0) {
        setRolling(false);
        return;
      }
      const counts = { perName: new Map<string, number>(), switches: 0, bigs: 0 };
      const finals: RollResult[] = [];
      for (let i = 0; i < totalSpins; i++) {
        const w = pickWeapon(weaponPool, counts);
        counts.perName.set(w.name, (counts.perName.get(w.name) ?? 0) + 1);
        if (isSwitch(w)) counts.switches += 1;
        if (isBigGun(w)) counts.bigs += 1;
        await spinTo(w, weaponPool);
        finals.push({ item: w, qty: 1 });
        setResults([...finals]);
      }
    } else {
      // Drugs: pick N distinct + distribute total qty
      const tierKey = String(tier);
      const weights = DRUG_TIER_WEIGHTS[tierKey];
      const legendaryCap = DRUG_LEGENDARY_CAP[tierKey];
      const wanted = DRUG_TYPES[tierKey];
      const total = DRUG_TOTAL[tierKey];

      const picked: Item[] = [];
      let legendaryCount = 0;
      let guard = 0;
      while (picked.length < wanted && guard++ < 400) {
        const candidate = weightedPick(drugPool, weights);
        if (picked.some((p) => p.id === candidate.id)) continue;
        if (candidate.rarity === "Legendary" && legendaryCount >= legendaryCap) continue;
        if (candidate.rarity === "Legendary") legendaryCount += 1;
        picked.push(candidate);
      }

      const qtys = splitTotal(total, picked.length);
      const finals: RollResult[] = [];
      for (let i = 0; i < picked.length; i++) {
        await spinTo(picked[i], drugPool);
        finals.push({ item: picked[i], qty: qtys[i] });
        setResults([...finals]);
      }
    }

    setRolling(false);
  };

  const previewStrip = useMemo(() => {
    const pool = cat === "firearms" ? weaponPool : drugPool;
    if (pool.length === 0) return [];
    return Array.from({ length: VISIBLE_SLOTS }, (_, i) => pool[i % pool.length]);
  }, [cat, weaponPool, drugPool]);

  const renderStrip = strip.length ? strip : previewStrip;
  const Icon = cat === "firearms" ? Crosshair : Pill;

  return (
    <section id="random-wheel" className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
          <div className="flex justify-start">
            <div className="inline-flex rounded-md border border-border bg-card p-1">
              {(["firearms", "drugs"] as Cat[]).map((c, i) => (
                <div key={c} className="flex items-center">
                  {i > 0 && <span className="mx-1 h-5 w-px bg-border" />}
                  <button
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
                </div>
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
              {TIER_OPTIONS.map((t, i) => (
                <div key={String(t)} className="flex items-center">
                  {i > 0 && <span className="mx-1 h-5 w-px bg-border" />}
                  <button
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal 9-slot reel */}
        <div className="relative mt-8 overflow-hidden rounded-md border border-border bg-card/60">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 -translate-x-1/2"
            style={{ width: `${100 / VISIBLE_SLOTS}%` }}
          >
            <div className="h-full w-full border-x-2 border-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.45)]" />
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rotate-45 bg-amber-400" />
            <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-amber-400" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          <div ref={reelRef} className="relative w-full">
            <div
              className="flex"
              style={{
                gap: 0,
                transform: `translateX(${-offset}px)`,
                transition: animateOffset
                  ? "transform 3.6s cubic-bezier(0.15, 0.85, 0.25, 1)"
                  : "none",
              }}
            >
              {renderStrip.map((it, i) => {
                const isWinnerTile = strip.length > 0 && i === WINNER_INDEX && landed;
                return (
                  <div
                    key={`${it.id}-${i}`}
                    className="shrink-0 p-1"
                    style={{ width: `${100 / VISIBLE_SLOTS}%`, flex: `0 0 ${100 / VISIBLE_SLOTS}%` }}
                  >
                    <div
                      className={`relative flex aspect-[3/4] flex-col items-center justify-between rounded-md border p-2 text-center transition ${
                        isWinnerTile
                          ? "border-amber-400 bg-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="grid h-9 w-9 place-items-center rounded text-amber-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="line-clamp-2 text-[10px] font-semibold leading-tight">{it.name}</div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{it.rarity}</div>
                      {/* Small vertical separator on right edge */}
                      <span className="pointer-events-none absolute -right-1 top-3 bottom-3 w-px bg-border/60" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={roll}
          disabled={rolling || (cat === "firearms" ? weaponPool.length === 0 : drugPool.length === 0)}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-md bg-slate-100 px-6 py-5 text-base font-black uppercase tracking-wider text-slate-900 shadow transition hover:bg-white disabled:opacity-60"
        >
          <Dices className={`h-5 w-5 ${rolling ? "animate-spin" : ""}`} />
          {rolling
            ? `Rolling ${results.length + 1} / ${totalSpins}...`
            : cat === "firearms"
              ? `ROLL ${TIER_LABEL[String(tier)].toUpperCase()} (${totalSpins})`
              : `ROLL ${TIER_LABEL[String(tier)].toUpperCase()} DRUGS (${DRUG_TOTAL[String(tier)]} TOTAL)`}
        </button>

        {results.length > 0 && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Your {TIER_LABEL[String(tier)]} {cat === "firearms" ? "Drop" : "Drug Drop"} ({results.length}/{totalSpins})
              </div>
              {cat === "drugs" && (
                <div className="text-xs font-semibold text-amber-300">
                  Total: {results.reduce((s, r) => s + r.qty, 0)}
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r, idx) => (
                <button
                  key={`${r.item.id}-${idx}`}
                  type="button"
                  onClick={() => setSelected(r.item)}
                  className="group relative flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:border-ring hover:bg-accent"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-secondary/60 text-amber-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{r.item.name}</div>
                    <div className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${rarityClass[r.item.rarity]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${rarityDot[r.item.rarity]}`} />
                      {r.item.rarity}
                    </div>
                  </div>
                  {cat === "drugs" && (
                    <div className="shrink-0 rounded-md border border-amber-400/60 bg-amber-400/10 px-2 py-1 text-sm font-black text-amber-300">
                      ×{r.qty}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
