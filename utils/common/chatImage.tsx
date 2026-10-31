import { useState } from "react";

export default function ChatImage({
  src,
  lowResSrc,
  onClick,
}: {
  src: string;
  lowResSrc?: string;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-[200px] h-auto group cursor-pointer">
      {/* 🔵 Skeleton shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-md" />
      )}

      {/* 🟣 Blur placeholder (progressive load) */}
      {lowResSrc && !loaded && (
        <img
          src={lowResSrc}
          className="w-full rounded-md blur-sm opacity-60"
          alt="preview"
        />
      )}

      {/* 🟢 Actual image */}
      <img
        src={error ? "/image-fallback.webp" : src}
        alt="chat-img"
        className={`w-full rounded-md transition-all duration-500 ${
          loaded ? "opacity-100 blur-0" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
      />
    </div>
  );
}
