import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { RandomWheel } from "@/components/RandomWheel";
import { CatalogSection } from "@/components/CatalogSection";
import { SkillInformation } from "@/components/SkillInformation";
import { HashModals } from "@/components/HashModals";
import { Snowfall } from "@/components/Snowfall";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Chi: Cinematic V1 — Illegal Area Helper" },
      { name: "description", content: "Browse supply drops and all firearms and drugs in The Chi: Cinematic V1." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <RandomWheel />
      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-border" />
      </div>
      <CatalogSection />
      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-border" />
      </div>
      <SkillInformation />
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <div>The Chi: Cinematic V1 · Illegal Area Helper</div>
        <a
          href="https://thechirbxforums.lovable.app"
          target="_blank"
          rel="noreferrer"
          className="mt-2 block text-foreground underline-offset-4 hover:underline"
        >
          The Chi: Cinematic · Forums
        </a>
        <a
          href="https://the-chi-cinematic-v1.fandom.com/wiki/The_Chi:_Cinematic_V1_Wiki"
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-foreground underline-offset-4 hover:underline"
        >
          The Chi: Cinematic · Faction Wiki
        </a>
      </footer>
      <HashModals />
    </main>
  );
}
