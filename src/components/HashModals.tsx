import { useEffect, useState } from "react";
import { SupplyDropModal } from "./SupplyDropModal";
import { CatalogModal } from "./CatalogModal";

export function HashModals() {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    const update = () => setHash(window.location.hash.replace("#", ""));
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const close = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setHash("");
  };

  if (hash === "supply-drop") return <SupplyDropModal onClose={close} />;
  if (hash === "weapon-catalog") return <CatalogModal onClose={close} />;
  return null;
}
