"use client";

import React from "react";
import { Play } from "lucide-react";

export function parseVideoEmbed(url?: string): {
  type: "youtube" | "vimeo" | "mp4" | "iframe" | null;
  embedUrl: string | null;
} {
  if (!url || typeof url !== "string") return { type: null, embedUrl: null };
  const trimmed = url.trim();
  if (!trimmed) return { type: null, embedUrl: null };

  // Direct MP4 video
  if (trimmed.match(/\.mp4($|\?)/i)) {
    return { type: "mp4", embedUrl: trimmed };
  }

  // YouTube matchers: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  // Vimeo matchers: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|))(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
    };
  }

  // Generic valid URL -> fallback iframe
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return { type: "iframe", embedUrl: trimmed };
  }

  return { type: null, embedUrl: null };
}

interface VideoEmbedPlayerProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function VideoEmbedPlayer({
  url,
  title = "Video Presentation",
  className = "",
}: VideoEmbedPlayerProps) {
  const { type, embedUrl } = parseVideoEmbed(url);

  if (!type || !embedUrl) return null;

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-blue-950/40 ${className}`}
    >
      {type === "mp4" ? (
        <video
          controls
          playsInline
          className="w-full h-full object-cover"
          title={title}
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}

