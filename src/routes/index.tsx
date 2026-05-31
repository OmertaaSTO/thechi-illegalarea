import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { RandomWheel } from "@/components/RandomWheel";
import { CatalogSection } from "@/components/CatalogSection";
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
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <div>The Chi: Cinematic V1 · Illegal Area Helper</div>
        <a
          href="https://thechiroblox.lovable.app/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-foreground underline-offset-4 hover:underline"
        >
          The Chi: Cinematic · Forums
        </a>
      </footer>
      <HashModals />
    </main>
  );
}
