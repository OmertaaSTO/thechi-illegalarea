import { Package, Box, FolderOpen, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";

export function Hero() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToCatalog = (mode: "weapon" | "drug") => (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("catalog:set-type", { detail: mode }));
    const el = document.getElementById("catalog");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15,17,25,0.7), rgba(15,17,25,1)), radial-gradient(circle at 30% 30%, rgba(60,80,140,0.35), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="mb-8 flex items-center gap-4">
          <img
            src={logo}
            alt="The Chi: Cinematic Roleplay logo"
            className="h-32 w-32 rounded-full object-cover shadow-xl ring-2 ring-slate-200/30 sm:h-40 sm:w-40"
          />
        </div>
        <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          The Chi:Cinematic V1 Illegal Area
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Browse supply drops and all firearms and drugs windy has to offer.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#random-wheel"
            onClick={scrollTo("random-wheel")}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          >
            <Box className="h-4 w-4" /> Open supply drop
          </a>
          <a
            href="#catalog"
            onClick={scrollToCatalog("weapon")}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            <Package className="h-4 w-4" /> View all weapons
          </a>
          <a
            href="#catalog"
            onClick={scrollToCatalog("drug")}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            <FolderOpen className="h-4 w-4" /> View all drugs
          </a>
          <a
            href="#skill-information"
            onClick={scrollTo("skill-information")}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" /> View skill information
          </a>
        </div>
      </div>
    </section>
  );
}
