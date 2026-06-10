// MusicPlayer.tsx — le lecteur « now playing » rétro de la page Home.
// Playlist lo-fi de démo (SoundHelix) — pur jouet d'ambiance.

import { Disc, Music, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Song = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
};

const PLAYLIST: Song[] = [
  { id: "s1", title: "dreaming.mp3", artist: "everydream", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "6:12" },
  { id: "s2", title: "cyber_babe_mix.wav", artist: "dj sparkle", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "7:05" },
  { id: "s3", title: "angel.txt_loop", artist: "angel.txt", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "5:44" },
  { id: "s4", title: "pixel_princess.mp3", artist: "choco.chip", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "5:02" },
];

export function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSong.url);
    } else {
      audioRef.current.src = currentSong.url;
    }
    audioRef.current.volume = volume;

    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex]);

  // À la disparition de la page : on coupe la musique.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return "0:00";
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="retro-window w-full rounded-sm p-1 font-mono">
      {/* Barre de titre */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#e85d97] to-[#dfb2f4] px-2 py-1 text-xs font-semibold text-white select-none">
        <span className="flex items-center gap-1">
          <Disc className={`h-3.5 w-3.5 ${isPlaying ? "animate-spin" : ""}`} />
          now playing
        </span>
        <div className="flex gap-1.5">
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-black/40 bg-yellow-100 text-[8px] font-bold text-black select-none">_</div>
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-black/40 bg-blue-100 text-[8px] font-bold text-black select-none">□</div>
          <button
            onClick={() => {
              audioRef.current?.pause();
              setIsPlaying(false);
            }}
            className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center border border-black/40 bg-red-200 text-[9px] font-bold text-black select-none hover:bg-red-300"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-[#fdf2f7] p-3">
        {/* Titre + artiste + égaliseur */}
        <div className="home-pixel relative flex items-center justify-between rounded border border-black/10 bg-[#1e1e1e] p-2.5 text-lg leading-tight text-emerald-400 shadow-inner">
          <div className="truncate pr-4">
            <div className="text-xs tracking-widest text-rose-300 uppercase select-none">{currentSong.artist}</div>
            <div className="truncate text-lg font-semibold tracking-wider text-[#a8ffb2]">{currentSong.title}</div>
          </div>
          <div className="absolute right-2.5 bottom-2 flex h-7 items-end gap-[2px] select-none">
            {[12, 24, 16, 28, 14, 20].map((baseHeight, i) => (
              <div
                key={i}
                className="w-[3px] origin-bottom rounded-xs bg-[#a8ffb2]"
                style={{
                  height: `${baseHeight}px`,
                  animation: isPlaying ? `home-eq-bounce ${0.6 + i * 0.15}s ease-in-out infinite alternate` : "none",
                  transform: isPlaying ? undefined : "scaleY(0.15)",
                  transition: "transform 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center justify-between gap-2 text-[10px] select-none">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressBarChange}
            className="h-3 flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white accent-[#e85d97]"
          />
          <span>{formatTime(duration || 320)}</span>
        </div>

        {/* Contrôles + volume */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="retro-button cursor-pointer p-2" title="Piste précédente">
              <SkipBack className="h-4 w-4 text-black" />
            </button>
            <button onClick={togglePlay} className="retro-button scale-110 cursor-pointer bg-[#f7a1c4] p-2.5" title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause className="h-4 w-4 fill-black text-black" /> : <Play className="h-4 w-4 fill-black text-black" />}
            </button>
            <button onClick={handleNext} className="retro-button cursor-pointer p-2" title="Piste suivante">
              <SkipForward className="h-4 w-4 text-black" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white p-1">
            <Volume2 className="h-3.5 w-3.5 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-[#b3c5f4]"
            />
          </div>
        </div>

        {/* La playlist */}
        <div className="mt-2 max-h-[70px] overflow-y-auto rounded border border-gray-200 bg-white text-[10px] shadow-inner">
          {PLAYLIST.map((song, index) => (
            <button
              key={song.id}
              onClick={() => {
                setCurrentSongIndex(index);
                setIsPlaying(true);
              }}
              className={`flex w-full items-center justify-between border-b border-gray-100 px-2 py-1 text-left transition-all hover:bg-rose-50/70 ${
                index === currentSongIndex ? "bg-[#fdf2f7] font-semibold text-[#e85d97]" : "text-gray-600"
              }`}
            >
              <span className="flex items-center gap-1 truncate">
                <Music className="h-2.5 w-2.5" />
                {song.title}
              </span>
              <span className="home-pixel text-gray-400">{song.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
