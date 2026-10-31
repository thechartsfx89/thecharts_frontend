// components/YouTubePlayer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface YouTubePlayerProps {
  url: string;
  videoId: string;
  module_id?: string;
  courseId?: string;
  onLoad?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? "";
}

export default function YouTubePlayer({
  url,
  videoId,
  module_id,
  courseId,
  onLoad,
}: YouTubePlayerProps) {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const saveInterval = useRef<NodeJS.Timeout | null>(null);
  const isSaving = useRef(false);
  const lastSavedTime = useRef(-1);
  const videoIdRef = useRef(videoId);

  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  const saveProgress = async (reason: string, currentTime: number, duration: number) => {
    if (isSaving.current) return;
    if (Math.abs(currentTime - lastSavedTime.current) < 0.5) return;

    isSaving.current = true;
    lastSavedTime.current = currentTime;

    try {
      console.log(`💾 YouTube saving progress (${reason}) at:`, currentTime);
      await fetch("/api/video/video-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoIdRef.current,
          currentTime,
          totalPlayed: currentTime,       // YouTube doesn't track this natively
          totalCovered: Math.min(currentTime, duration), // approximate
          module_id,
          recorderd_lecture: courseId,
        }),
      });
    } catch (err) {
      console.error("⚠️ Failed to save YouTube progress:", err);
    } finally {
      isSaving.current = false;
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    const ytVideoId = extractYouTubeId(url);
    if (!ytVideoId) return;

    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: ytVideoId,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            console.log("▶️ YouTube player ready");
            onLoad?.();
          },
          onStateChange: (event: any) => {
            const player = playerRef.current;
            const currentTime = player.getCurrentTime?.() ?? 0;
            const duration = player.getDuration?.() ?? 0;

            // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Start interval when playing
              if (saveInterval.current) clearInterval(saveInterval.current);
              saveInterval.current = setInterval(() => {
                const t = player.getCurrentTime?.() ?? 0;
                const d = player.getDuration?.() ?? 0;
                saveProgress("interval", t, d);
              }, 30000);
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              saveProgress("pause", currentTime, duration);
              if (saveInterval.current) clearInterval(saveInterval.current);
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              saveProgress("ended", currentTime, duration);
              if (saveInterval.current) clearInterval(saveInterval.current);
            }
          },
        },
      });
    };

    // Load YT API if not already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (saveInterval.current) clearInterval(saveInterval.current);
      playerRef.current?.destroy?.();
    };
  }, [session?.user?.id, url]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
}