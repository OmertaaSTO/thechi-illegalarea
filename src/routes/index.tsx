import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { RandomWheel } from "@/components/RandomWheel";
import { HashModals } from "@/components/HashModals";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Windy City V5 — Illegal Area Helper" },
      { name: "description", content: "Browse supply drops and all firearms and drugs in Windy City V5." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <RandomWheel />
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        Windy City V5 · Illegal Area Helper
      </footer>
      <HashModals />
    </main>
  );
}
