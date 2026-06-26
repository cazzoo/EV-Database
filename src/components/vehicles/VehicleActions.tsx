"use client";

import { useState } from "react";
import { Heart, Share2, Flag } from "lucide-react";
import Link from "next/link";

export default function VehicleActions({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const handleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      try {
        const key = "saved-vehicles";
        const stored = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = next
          ? Array.from(new Set([...stored, slug]))
          : stored.filter((s: string) => s !== slug);
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {
        // localStorage unavailable; toggle UI only
      }
      return next;
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // user cancelled share or clipboard unavailable
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className={`btn btn-ghost btn-circle ${saved ? "text-error" : ""}`}
        title={saved ? "Saved" : "Save"}
        onClick={handleSave}
      >
        <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
      </button>
      <button
        className="btn btn-ghost btn-circle"
        title={shared ? "Link copied!" : "Share"}
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5" />
      </button>
      <Link href="/contribute" className="btn btn-ghost btn-circle" title="Report issue">
        <Flag className="h-5 w-5" />
      </Link>
    </div>
  );
}
