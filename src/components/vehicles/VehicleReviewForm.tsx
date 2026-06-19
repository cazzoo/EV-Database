"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default function VehicleReviewForm({ vehicleId }: { vehicleId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!session?.user?.id) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: session.user.id, vehicleId }),
    });
    setLoading(false);
    if (res.ok) {
      setContent("");
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Failed to post review");
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea
        className="textarea textarea-bordered w-full"
        rows={3}
        placeholder={session?.user?.id ? "Share your experience with this EV..." : "Sign in to leave a review"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      <div className="card-actions justify-end mt-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !content.trim()}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : <MessageSquare className="h-4 w-4" />}
          Post Review
        </button>
      </div>
    </form>
  );
}
