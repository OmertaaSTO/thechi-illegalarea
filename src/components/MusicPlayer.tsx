import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";

const STORAGE_KEY = "music-playing";
const TRACK_KEY = "music-track";

export type Track = { title: string; src: string };

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const v = Number(localStorage.getItem(TRACK_KEY) ?? 0);
    return Number.isFinite(v) ? v % Math.max(tracks.length, 1) : 0;
  });
  const [pulse, setPulse] = useState<"play" | "pause" | null>(null);

  const current = tracks[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TRACK_KEY, String(index));
  }, [index]);

  useEffect(() => {
    if (!pulse) return;
    const t = setTimeout(() => setPulse(null), 900);
    return () => clearTimeout(t);
  }, [pulse]);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
      setPulse("play");
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      setPlaying(false);
    }
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setPulse("pause");
      localStorage.setItem(STORAGE_KEY, "0");
    } else {
      await playAudio();
    }
  };

  const skip = () => {
    if (tracks.length <= 1) return;
    setIndex((i) => (i + 1) % tracks.length);
    // playback continues via effect below
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (audio && playing) audio.play().catch(() => {});
    });
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={current?.src}
        loop={tracks.length === 1}
        preload="none"
        onEnded={() => {
          if (tracks.length > 1) {
            setIndex((i) => (i + 1) % tracks.length);
            requestAnimationFrame(() => audioRef.current?.play().catch(() => {}));
          }
        }}
      />

      {pulse && (
        <div className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background/80 text-foreground shadow-2xl backdrop-blur animate-scale-in">
            {pulse === "play" ? (
              <Play className="h-10 w-10 translate-x-[2px]" />
            ) : (
              <Pause className="h-10 w-10" />
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-2">
        {playing && tracks.length > 1 && (
          <button
            onClick={skip}
            aria-label="Skip song"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted animate-fade-in"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          title={current?.title}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-muted"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
        </button>
      </div>
    </>
  );
}
