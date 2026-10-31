"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface VdoPlayerProps {
  otp: string;
  playbackInfo: string;
  videoId: string;
  onLoad?: () => void;
  module_id?: string;
  courseId?: string;
}

interface VdoCipherPlayer {
  api: {
    getTotalPlayed: () => Promise<number>;
    getTotalCovered: () => Promise<number>;
    addEventListener: (event: string, callback: (data?: any) => void) => void;
  };
  video: HTMLVideoElement;
}

declare global {
  interface Window {
    VdoPlayer: new (iframe: HTMLIFrameElement) => VdoCipherPlayer;
  }
}

export default function VdoPlayer({ otp, playbackInfo, videoId, onLoad, module_id, courseId }: VdoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: session } = useSession();
  const initialized = useRef(false); // ✅ prevents double init
  const videoIdRef = useRef(videoId);
useEffect(() => {
  videoIdRef.current = videoId;
}, [videoId]);

console.log("VdoPlayer rendered with videoId:", videoId);
  const [stats, setStats] = useState({
    currentTime: 0,
    totalPlayed: 0,
    totalCovered: 0,
    resumedFrom: 0,
  });


useEffect(() => {
  if (!session?.user?.id || initialized.current) return;
  initialized.current = true;

  let cleanupFn: (() => void) | null = null;

  const loadPlayer = async () => {
    if (!window.VdoPlayer) {
      const script = document.createElement("script");
      script.src = "https://player.vdocipher.com/v2/api.js";
      script.async = true;
      script.onload = () => {
        cleanupFn = initPlayer();
      };
      document.body.appendChild(script);
    } else {
      cleanupFn = initPlayer();
    }
  };

  const initPlayer = () => {
    if (!iframeRef.current) return null;

    const playerInstance: any = new window.VdoPlayer(iframeRef.current);
    const videoEl: HTMLVideoElement = playerInstance.video;

    console.log("🎬 VdoCipher initialized");

    let saveInterval: NodeJS.Timeout | null = null;
    let isSaving = false;
    let lastSavedTime = -1;

    // -----------------------------
    // Safe saveProgress (DEDUPED)
    // -----------------------------
    const saveProgress = async (reason: string) => {
      if (isSaving) return;

      const currentTime = videoEl.currentTime || 0;

      // ❌ Ignore pause triggered at video end
      if (reason === "pause" && videoEl.ended) return;

      // ❌ Ignore duplicate timestamps (dragging / overlap)
      if (Math.abs(currentTime - lastSavedTime) < 0.5) return;

      isSaving = true;
      lastSavedTime = currentTime;

      try {
        const totalPlayed = await playerInstance.api.getTotalPlayed();
        const totalCovered = await playerInstance.api.getTotalCovered();

        console.log(`💾 Saving progress (${reason}) at:`, currentTime);

        await fetch("/api/video/video-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoId: videoIdRef.current,
            currentTime,
            totalPlayed,
            totalCovered,
            module_id,
            // purchased_course: courseId,
            recorderd_lecture: courseId,
          }),
        });
      } catch (err) {
        console.error("⚠️ Failed to save progress:", err);
      } finally {
        isSaving = false;
      }
    };

    // -----------------------------
    // Handlers
    // -----------------------------
    const handleTimeUpdate = () => {
      setStats((prev) => ({
        ...prev,
        currentTime: videoEl.currentTime,
      }));
    };

    const handlePause = () => {
      if (!videoEl.ended) {
        saveProgress("pause");
      }
    };

    const handleEnded = () => {
      saveProgress("ended");
      if (saveInterval) clearInterval(saveInterval);
    };

    const handleFirstPlay = () => {
      saveProgress("initial");
      videoEl.removeEventListener("play", handleFirstPlay);
    };

    const beforeUnloadHandler = () => {
      saveProgress("unload");
    };

    // -----------------------------
    // Attach listeners
    // -----------------------------
    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    videoEl.addEventListener("pause", handlePause);
    videoEl.addEventListener("ended", handleEnded);
    videoEl.addEventListener("play", handleFirstPlay);

    window.addEventListener("beforeunload", beforeUnloadHandler);

    // -----------------------------
    // Auto-save every 30s
    // -----------------------------
    saveInterval = setInterval(() => {
      if (!videoEl.paused && !videoEl.ended) {
        saveProgress("interval");
      }
    }, 30000);

    // -----------------------------
    // Cleanup
    // -----------------------------
    return () => {
      console.log("🧹 Cleanup: removing listeners & intervals");

      if (saveInterval) clearInterval(saveInterval);

      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      videoEl.removeEventListener("pause", handlePause);
      videoEl.removeEventListener("ended", handleEnded);
      videoEl.removeEventListener("play", handleFirstPlay);

      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  };

  loadPlayer();

  return () => {
    if (cleanupFn) cleanupFn();
  };
}, [session?.user?.id]);



  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-full h-full border-0 rounded-lg"
        onLoad={onLoad}
      ></iframe>

      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-md">
        ⏯ Resumed: {Math.floor(stats.resumedFrom)}s | ▶️ Now: {Math.floor(stats.currentTime)}s | 🕓 Played: {stats.totalPlayed}s | ✅ Covered: {stats.totalCovered}s
      </div>
    </>
  );
}
