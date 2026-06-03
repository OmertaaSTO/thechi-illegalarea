import { useMemo, useRef, useState } from "react";
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

const SLOT_COUNT: Record<string, number> = {
  test: 2,
  "1": 4,
  "1.5": 4,
  "2": 6,
};

const VISIBLE_SLOTS = 9;
const CENTER_INDEX = Math.floor(VISIBLE_SLOTS / 2); // 4
const STRIP_LENGTH = 60; // total tiles on reel
const WINNER_INDEX = STRIP_LENGTH - 1 - CENTER_INDEX; // lands at visual center

export function RandomWheel() {
  const [cat, setCat] = useState<Cat>("firearms");
  const [tier, setTier] = useState<Tier>("test");
  const [selected, setSelected] = useState<Item | null>(null);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<Item[]>([]);
  const [strip, setStrip] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [animateOffset, setAnimateOffset] = useState(true);
  const [landed, setLanded] = useState(false);
  const reelRef = useRef<HTMLDivElement | null>(null);
  const [tileWidth, setTileWidth] = useState(112);

  const totalRolls = cat === "firearms" ? SLOT_COUNT[String(tier)] : 2;

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

  const pool = useMemo(() => {
    if (cat === "firearms") {
      if (tier === "test") return weapons.filter((w) => TEST_DROP_NAMES.has(w.name));
      // All non-test tiers can pull from any tier's guns
      return weapons;
    }
    if (tier === "test" || tier === 1) return drugs.filter((d) => ["Common", "Uncommon"].includes(d.rarity));
    if (tier === 1.5) return drugs.filter((d) => ["Uncommon", "Rare"].includes(d.rarity));
    return drugs.filter((d) => ["Rare", "Epic", "Legendary"].includes(d.rarity));
  }, [cat, tier, TEST_DROP_NAMES]);

  const switchPool = useMemo(
    () => weapons.filter((w) => /switch/i.test(w.name)),
    [],
  );

  const bigGunPool = useMemo(
    () => weapons.filter((w) => /draco|arp|ar\b|ak|rifle|binary/i.test(w.name)),
    [],
  );

  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  type RarityWeights = Partial<Record<Item["rarity"], number>>;

  const TIER_CONFIG: Record<string, {
    switchChance: () => number;
    bigGunChance: () => number;
    rarityWeights: RarityWeights;
  }> = {
    "1": {
      switchChance: () => rand(0.10, 0.15),
      bigGunChance: () => 0,
      rarityWeights: { Common: 50, Uncommon: 50, Rare: 35, Epic: 20 },
    },
    "1.5": {
      switchChance: () => rand(0.15, 0.17),
      bigGunChance: () => rand(0.13, 0.17),
      rarityWeights: { Common: 35, Uncommon: 35, Rare: 30, Epic: 25, Legendary: 10 },
    },
    "2": {
      switchChance: () => rand(0.20, 0.25),
      bigGunChance: () => rand(0.19, 0.23),
      rarityWeights: { Common: 30, Uncommon: 30, Rare: 30, Epic: 25, Legendary: 10 },
    },
  };

  const weightedPick = (items: Item[], weights: RarityWeights): Item => {
    const scored = items.map((i) => ({ i, w: weights[i.rarity] ?? 0 }));
    const total = scored.reduce((s, x) => s + x.w, 0);
    if (total <= 0) return items[Math.floor(Math.random() * items.length)];
    let r = Math.random() * total;
    for (const { i, w } of scored) {
      r -= w;
      if (r <= 0) return i;
    }
    return scored[scored.length - 1].i;
  };

  const pickFinal = (): Item => {
    if (cat !== "firearms") return pool[Math.floor(Math.random() * pool.length)];
    const cfg = TIER_CONFIG[String(tier)];
    if (!cfg) return pool[Math.floor(Math.random() * pool.length)];

    const inPool = (arr: Item[]) => arr.filter((x) => pool.includes(x));
    const switches = inPool(switchPool);
    if (switches.length && Math.random() < cfg.switchChance()) {
      return switches[Math.floor(Math.random() * switches.length)];
    }
    const bigs = inPool(bigGunPool);
    if (bigs.length && Math.random() < cfg.bigGunChance()) {
      return bigs[Math.floor(Math.random() * bigs.length)];
    }
    return weightedPick(pool, cfg.rarityWeights);
  };


  const buildStrip = (winner: Item): Item[] => {
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
    const w = el.clientWidth;
    // tile width includes 8px gap (gap-2)
    return w / VISIBLE_SLOTS;
  };

  const resetState = () => {
    setResults([]);
    setStrip([]);
    setLanded(false);
    setAnimateOffset(false);
    setOffset(0);
  };

  const spinOnce = async (): Promise<Item> => {
    const winner = pickFinal();
    const newStrip = buildStrip(winner);

    // reset to start without animation
    setAnimateOffset(false);
    setStrip(newStrip);
    setOffset(0);
    setLanded(false);

    // measure after layout
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const tw = measureTile();
    setTileWidth(tw);
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    // animate to winner with slight random jitter so it stops in the middle of the tile
    const jitter = (Math.random() - 0.5) * (tw * 0.3);
    const target = WINNER_INDEX * tw - CENTER_INDEX * tw + jitter;
    setAnimateOffset(true);
    setOffset(target);

    // wait for the CSS transition (matches duration below)
    await new Promise((r) => setTimeout(r, 3600));
    setLanded(true);
    await new Promise((r) => setTimeout(r, 450));
    return winner;
  };

  const roll = async () => {
    if (pool.length === 0 || rolling) return;
    setRolling(true);
    setResults([]);
    const finals: Item[] = [];
    for (let i = 0; i < totalRolls; i++) {
      const w = await spinOnce();
      finals.push(w);
      setResults([...finals]);
    }
    setRolling(false);
  };

  // Idle preview strip
  const previewStrip = useMemo(() => {
    if (pool.length === 0) return [];
    return Array.from({ length: VISIBLE_SLOTS }, (_, i) => pool[i % pool.length]);
  }, [pool]);

  const renderStrip = strip.length ? strip : previewStrip;

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

        {/* Horizontal 9-slot reel */}
        <div className="relative mt-8 overflow-hidden rounded-md border border-border bg-card/60">
          {/* Center marker */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 -translate-x-1/2"
            style={{ width: `${100 / VISIBLE_SLOTS}%` }}
          >
            <div className="h-full w-full border-x-2 border-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.45)]" />
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rotate-45 bg-amber-400" />
            <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-amber-400" />
          </div>

          {/* Edge fades */}
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
                      className={`flex aspect-[3/4] flex-col items-center justify-between rounded-md border p-2 text-center transition ${
                        isWinnerTile
                          ? "border-amber-400 bg-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="grid h-9 w-9 place-items-center rounded text-amber-400">
                        <Crosshair className="h-5 w-5" />
                      </div>
                      <div className="line-clamp-2 text-[10px] font-semibold leading-tight">{it.name}</div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{it.rarity}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={roll}
          disabled={rolling || pool.length === 0}
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-md bg-slate-100 px-6 py-5 text-base font-black uppercase tracking-wider text-slate-900 shadow transition hover:bg-white disabled:opacity-60"
        >
          <Dices className={`h-5 w-5 ${rolling ? "animate-spin" : ""}`} />
          {rolling
            ? `Rolling ${results.length + 1} / ${totalRolls}...`
            : `ROLL ${TIER_LABEL[String(tier)].toUpperCase()} (${totalRolls})`}
        </button>

        {results.length > 0 && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Your {TIER_LABEL[String(tier)]} Drop ({results.length}/{totalRolls})
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
