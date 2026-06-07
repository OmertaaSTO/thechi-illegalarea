import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const STORAGE_KEY = "music-playing";

export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "0");
    } else {
      try {
        await audio.play();
        setPlaying(true);
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-4 right-4 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
      </button>
    </>
  );
}
