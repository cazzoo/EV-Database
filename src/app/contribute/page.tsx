"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Edit,
  Plus,
  Camera,
  Star,
  Flag,
  Zap,
  Trophy,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { CONTRIBUTION_TYPES } from "@/lib/gamification";
import { timeAgo } from "@/lib/format";

type ContributionType = keyof typeof CONTRIBUTION_TYPES;

const OPTION_META: Record<
  ContributionType,
  { label: string; description: string; icon: React.ReactNode }
> = {
  ADD_VEHICLE: {
    label: "Add New Vehicle",
    description: "Add a completely new EV to our database",
    icon: <Plus className="h-6 w-6" />,
  },
  UPDATE_SPECS: {
    label: "Edit Specifications",
    description: "Correct or update vehicle specifications",
    icon: <Edit className="h-6 w-6" />,
  },
  ADD_PHOTO: {
    label: "Add Photos",
    description: "Upload photos of the vehicle",
    icon: <Camera className="h-6 w-6" />,
  },
  REVIEW: {
    label: "Write Review",
    description: "Share your experience with the community",
    icon: <Star className="h-6 w-6" />,
  },
  FIX_DATA: {
    label: "Report Issue",
    description: "Report and help fix data errors",
    icon: <Flag className="h-6 w-6" />,
  },
};

const ORDER: ContributionType[] = ["ADD_VEHICLE", "UPDATE_SPECS", "ADD_PHOTO", "REVIEW", "FIX_DATA"];

interface RecentContribution {
  id: string;
  type: string;
  createdAt: string;
  user: { name: string | null };
  vehicle: { make: string; model: string } | null;
}

export default function ContributePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <ContributeContent />
    </Suspense>
  );
}

function ContributeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contributionType, setContributionType] = useState<ContributionType | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: "",
    make: "",
    model: "",
    year: "",
    price: "",
    range: "",
    battery: "",
    acceleration: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState<RecentContribution[]>([]);

  useEffect(() => {
    fetch("/api/contributions?limit=5")
      .then((r) => r.json())
      .then((json) => setRecent(json.data || []))
      .catch(() => {});
    const presetType = searchParams.get("type") as ContributionType | null;
    const presetVehicle = searchParams.get("vehicleId");
    if (presetType && OPTION_META[presetType]) {
      setContributionType(presetType);
    }
    if (presetVehicle) {
      setFormData((d) => ({ ...d, vehicleId: presetVehicle }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!contributionType || !session?.user?.id) return;

    setSubmitting(true);
    setError("");

    const content =
      contributionType === "ADD_VEHICLE"
        ? JSON.stringify({
            make: formData.make,
            model: formData.model,
            year: formData.year ? Number(formData.year) : undefined,
            price: formData.price ? Number(formData.price) : undefined,
            range: formData.range ? Number(formData.range) : undefined,
            battery: formData.battery ? Number(formData.battery) : undefined,
            acceleration: formData.acceleration ? Number(formData.acceleration) : undefined,
            notes: formData.notes,
          })
        : JSON.stringify({
            make: formData.make,
            model: formData.model,
            year: formData.year,
            range: formData.range,
            battery: formData.battery,
            acceleration: formData.acceleration,
            price: formData.price,
            notes: formData.notes,
          });

    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: contributionType,
        content,
        userId: session.user.id,
        vehicleId: formData.vehicleId || undefined,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Failed to submit contribution");
    }
  };

  if (submitted) {
    const xp = contributionType ? CONTRIBUTION_TYPES[contributionType].xp : 0;
    const credits = contributionType ? CONTRIBUTION_TYPES[contributionType].credits : 0;
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="card-title justify-center text-2xl">Thank You!</h2>
            <p className="text-base-content/70">
              Your contribution has been submitted for review. You&apos;ll earn{" "}
              <span className="font-bold text-primary">+{xp} XP</span> and{" "}
              <span className="font-bold text-secondary">+{credits} credits</span> once approved!
            </p>
            <div className="card-actions justify-center mt-6">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setContributionType(null);
                  setFormData({ vehicleId: "", make: "", model: "", year: "", price: "", range: "", battery: "", acceleration: "", notes: "" });
                }}
              >
                Make Another Contribution
              </button>
              <a href="/dashboard" className="btn btn-ghost">
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const xp = contributionType ? CONTRIBUTION_TYPES[contributionType].xp : 0;
  const credits = contributionType ? CONTRIBUTION_TYPES[contributionType].credits : 0;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Zap className="inline-block h-10 w-10 mr-2 text-primary" />
              Contribute to the Community
            </h1>
            <p className="text-lg text-base-content/70">
              Help build the most comprehensive EV database. Earn XP, credits,
              and recognition for your contributions!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl">
                  <Trophy className="h-6 w-6 text-primary" />
                  Choose Contribution Type
                </h2>

                {!contributionType ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {ORDER.map((type) => {
                      const meta = OPTION_META[type];
                      const rewards = CONTRIBUTION_TYPES[type];
                      return (
                        <button
                          key={type}
                          className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer border-2 border-transparent hover:border-primary text-left"
                          onClick={() => setContributionType(type)}
                        >
                          <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                              <div className="text-primary">{meta.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold">{meta.label}</div>
                                <div className="text-xs text-base-content/70">{meta.description}</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <span className="badge badge-primary badge-sm">+{rewards.xp} XP</span>
                              <span className="badge badge-secondary badge-sm">+{rewards.credits} credits</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setContributionType(null)}>
                        ← Back
                      </button>
                      <span className="text-sm text-base-content/70">
                        Contributing as:{" "}
                        <span className="font-semibold text-primary">{OPTION_META[contributionType].label}</span>
                      </span>
                    </div>

                    {error && (
                      <div className="alert alert-error mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Vehicle ID (for edits)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., tesla-model-3-long-range"
                          className="input input-bordered"
                          value={formData.vehicleId}
                          onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                        />
                      </div>

                      {contributionType === "ADD_VEHICLE" && (
                        <>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Make</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Tesla"
                              className="input input-bordered"
                              value={formData.make}
                              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Model</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Model 3"
                              className="input input-bordered"
                              value={formData.model}
                              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Year</span>
                        </label>
                        <input
                          type="number"
                          placeholder="2024"
                          className="input input-bordered"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Price ($)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="50000"
                          className="input input-bordered"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Range (km)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="500"
                          className="input input-bordered"
                          value={formData.range}
                          onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Battery (kWh)</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="82"
                          className="input input-bordered"
                          value={formData.battery}
                          onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">0-100 km/h (seconds)</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="4.2"
                          className="input input-bordered"
                          value={formData.acceleration}
                          onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">Notes / Sources</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Provide sources for your information and any additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button type="button" className="btn btn-ghost" onClick={() => setContributionType(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : <CheckCircle className="h-4 w-4 mr-2" />}
                        Submit Contribution
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">
                  <DollarSign className="inline h-5 w-5 mr-1" />
                  Your Potential Rewards
                </h3>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold">+{xp} XP</div>
                  <div className="text-sm opacity-80">Experience Points</div>
                </div>
                <div className="text-center py-2">
                  <div className="text-3xl font-bold">+{credits}</div>
                  <div className="text-sm opacity-80">Virtual Credits</div>
                </div>
                <div className="alert alert-info mt-4 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Rewards are granted after your contribution is approved by the community.</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                {recent.length === 0 ? (
                  <p className="text-base-content/60 text-sm">No recent activity.</p>
                ) : (
                  <div className="space-y-3 mt-2">
                    {recent.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 text-sm">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                            <span className="text-xs">{(c.user.name || "?").charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{c.user.name || "Someone"}</span>{" "}
                          <span className="text-base-content/70">
                            {c.type.replace(/_/g, " ").toLowerCase()}
                            {c.vehicle ? ` ${c.vehicle.make} ${c.vehicle.model}` : ""}
                          </span>
                        </div>
                        <span className="text-xs text-base-content/50">{timeAgo(c.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
