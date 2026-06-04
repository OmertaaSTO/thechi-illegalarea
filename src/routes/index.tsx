import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { RandomWheel } from "@/components/RandomWheel";
import { CatalogSection } from "@/components/CatalogSection";
import { SkillInformation } from "@/components/SkillInformation";
import { HashModals } from "@/components/HashModals";

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
      <CatalogSection />
      <SkillInformation />
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <div>The Chi: Cinematic V1 · Illegal Area Helper</div>
        <a
          href="https://thechiroblox.lovable.app/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 block text-foreground underline-offset-4 hover:underline"
        >
          The Chi: Cinematic · Forums
        </a>
        <a
          href="https://thechi-factioncenter.lovable.app/"
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-foreground underline-offset-4 hover:underline"
        >
          The Chi: Cinematic · Faction Center
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
