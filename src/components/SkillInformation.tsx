import { useState } from "react";
import { ShieldCheck, FolderOpen } from "lucide-react";

type Skill = {
  unlock: number;
  name: string;
  description: string;
  tags: string[];
};

const FACTION_SKILLS: Skill[] = [
  { unlock: 3, name: "Nametags", description: "Enables viewing nametags above players. Must be in a faction for /mark.", tags: ["Faction", "Vision utility"] },
  { unlock: 5, name: "Improvement", description: "Allows Faction Members to add an additional slot to their vehicles.", tags: ["Faction", "Vehicle upgrade"] },
  { unlock: 7, name: "Tazer Resistance", description: "No effect by tasers once per 30 seconds.", tags: ["Faction", "Combat defense"] },
  { unlock: 7, name: "Take Cover", description: "Allows the user to have access to Q Peak.", tags: ["Faction", "Peek access"] },
  { unlock: 8, name: "Masked Identity", description: "When a user has a mask on, it toggles their tognames from the character name to 'MASKED'.", tags: ["Faction", "Identity concealment"] },
  { unlock: 10, name: "Swift Hands", description: "Gives access to Stomach Pull animation.", tags: ["Faction", "Animation access"] },
  { unlock: 10, name: "Spot 'Em Got 'Em", description: "Increases the radius of tognames for marked players.", tags: ["Faction", "Mark radius"] },
  { unlock: 12, name: "Adrenaline Rush", description: "When you drop below 40 HP when being hit by a weapon, you'll get a run speed boost.", tags: ["Faction", "Movement boost"] },
  { unlock: 12, name: "Top Hustler", description: "Increases your money limit by $200,000.", tags: ["Faction", "Money cap"] },
  { unlock: 12, name: "Fortitude", description: "Allows the user to not have the limping animation while getting shot.", tags: ["Faction", "Combat defense"] },
  { unlock: 13, name: "Hot Driver", description: "Allows Users to Improve The Cars Vehicle Meta during a Chase.", tags: ["Faction", "Chase skill"] },
  { unlock: 15, name: "Rapid Deployment", description: "Allows the user to maneuver in and out of vehicles slightly faster.", tags: ["Faction", "Entry speed"] },
  { unlock: 18, name: "First Person Shooter", description: "Allows No Screenshake or recoil in first person.", tags: ["Faction", "Aim control"] },
  { unlock: 20, name: "Headshot Kings", description: "Deal additional 3 damage to the head with a firearm.", tags: ["Faction", "Firearm bonus"] },
  { unlock: 20, name: "Sharpshooter", description: "Takes out 2 of the worst screenshakes while aiming a firearm.", tags: ["Faction", "Aim control"] },
];

const CIVILIAN_SKILLS: Skill[] = [
  { unlock: 3, name: "Placeholder Skill", description: "Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Civilian", "Placeholder"] },
  { unlock: 5, name: "Placeholder Skill", description: "Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Civilian", "Placeholder"] },
  { unlock: 10, name: "Placeholder Skill", description: "Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Civilian", "Placeholder"] },
];

const ILLEGAL_CIVILIAN_SKILLS: Skill[] = [
  { unlock: 3, name: "Placeholder Skill", description: "Illegal Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Illegal civilian", "Placeholder"] },
  { unlock: 5, name: "Placeholder Skill", description: "Illegal Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Illegal civilian", "Placeholder"] },
  { unlock: 10, name: "Placeholder Skill", description: "Illegal Civilian skill tree coming soon — this is a starter placeholder track for future expansion.", tags: ["Illegal civilian", "Placeholder"] },
];

const TABS = [
  { id: "faction", label: "Faction skills", title: "Faction skill tree", data: FACTION_SKILLS },
  { id: "civilian", label: "Civilian skills", title: "Civilian skill tree", data: CIVILIAN_SKILLS },
  { id: "illegal", label: "Illegal civilian", title: "Illegal civilian skill tree", data: ILLEGAL_CIVILIAN_SKILLS },
] as const;

export function SkillInformation() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("faction");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <section id="skill-information" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New roleplayer helper
          </div>
          <h2 className="mt-1 font-display text-4xl font-black tracking-tight sm:text-5xl">
            Skill information
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            A clear guide for players to check what each route can unlock. Faction is filled with the real skill list, while Civilian and Illegal Civilian are shown as starter placeholder tracks for future expansion.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> 3 character paths
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              active === t.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{current.title}</h3>
            <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
              {current.data.length} skills listed
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {current.data.map((s, i) => (
              <li
                key={`${s.name}-${i}`}
                className="flex gap-4 rounded-lg border border-border bg-background p-4"
              >
                <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-border pr-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Unlock
                  </div>
                  <div className="font-display text-3xl font-black leading-none">{s.unlock}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Other path tabs</h3>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
              <FolderOpen className="h-3 w-3" /> Placeholder sets
            </span>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guide note
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This section is built as a viewer, not a builder. Players can read what skills each character route can have before choosing how they want to play.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
