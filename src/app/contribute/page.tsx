"use client";

import { useState } from "react";
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
} from "lucide-react";
import { CONTRIBUTION_TYPES } from "@/lib/gamification";

type ContributionType = keyof typeof CONTRIBUTION_TYPES;

export default function ContributePage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the API
    setSubmitted(true);
  };

  const contributionOptions: {
    type: ContributionType;
    label: string;
    description: string;
    xp: number;
    credits: number;
    icon: React.ReactNode;
  }[] = [
    {
      type: "add_vehicle",
      label: "Add New Vehicle",
      description: "Add a completely new EV to our database",
      xp: 25,
      credits: 5,
      icon: <Plus className="h-6 w-6" />,
    },
    {
      type: "edit_specs",
      label: "Edit Specifications",
      description: "Correct or update vehicle specifications",
      xp: 10,
      credits: 2,
      icon: <Edit className="h-6 w-6" />,
    },
    {
      type: "add_image",
      label: "Add Photos",
      description: "Upload photos of the vehicle",
      xp: 15,
      credits: 3,
      icon: <Camera className="h-6 w-6" />,
    },
    {
      type: "write_review",
      label: "Write Review",
      description: "Share your experience with the community",
      xp: 20,
      credits: 4,
      icon: <Star className="h-6 w-6" />,
    },
    {
      type: "report_fix",
      label: "Report Issue",
      description: "Report and help fix data errors",
      xp: 30,
      credits: 6,
      icon: <Flag className="h-6 w-6" />,
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="card-title justify-center text-2xl">Thank You!</h2>
            <p className="text-base-content/70">
              Your contribution has been submitted for review. You'll earn{" "}
              <span className="font-bold text-primary">
                +{contributionType ? CONTRIBUTION_TYPES[contributionType].xp : 0} XP
              </span>{" "}
              and{" "}
              <span className="font-bold text-secondary">
                +{contributionType ? CONTRIBUTION_TYPES[contributionType].credits : 0} credits
              </span>{" "}
              once approved!
            </p>
            <div className="card-actions justify-center mt-6">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setContributionType(null);
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

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contribution Type Selection */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl">
                  <Trophy className="h-6 w-6 text-primary" />
                  Choose Contribution Type
                </h2>

                {!contributionType ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {contributionOptions.map((option) => (
                      <button
                        key={option.type}
                        className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer border-2 border-transparent hover:border-primary"
                        onClick={() => setContributionType(option.type)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-primary">{option.icon}</div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-xs text-base-content/70">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="badge badge-primary badge-sm">
                              +{option.xp} XP
                            </span>
                            <span className="badge badge-secondary badge-sm">
                              +{option.credits} credits
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setContributionType(null)}
                      >
                        ← Back
                      </button>
                      <span className="text-sm text-base-content/70">
                        Contributing as:{" "}
                        <span className="font-semibold text-primary">
                          {contributionOptions.find((o) => o.type === contributionType)?.label}
                        </span>
                      </span>
                    </div>

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
                          onChange={(e) =>
                            setFormData({ ...formData, vehicleId: e.target.value })
                          }
                        />
                      </div>

                      {contributionType === "add_vehicle" && (
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
                              onChange={(e) =>
                                setFormData({ ...formData, make: e.target.value })
                              }
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
                              onChange={(e) =>
                                setFormData({ ...formData, model: e.target.value })
                              }
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
                          onChange={(e) =>
                            setFormData({ ...formData, year: e.target.value })
                          }
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
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Range (miles)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="300"
                          className="input input-bordered"
                          value={formData.range}
                          onChange={(e) =>
                            setFormData({ ...formData, range: e.target.value })
                          }
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
                          onChange={(e) =>
                            setFormData({ ...formData, battery: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">0-60 mph (seconds)</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="4.2"
                          className="input input-bordered"
                          value={formData.acceleration}
                          onChange={(e) =>
                            setFormData({ ...formData, acceleration: e.target.value })
                          }
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
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      ></textarea>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setContributionType(null)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <CheckCircle className="h-4 w-4 mr-2" />
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
            {/* Rewards Preview */}
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">
                  <DollarSign className="inline h-5 w-5 mr-1" />
                  Your Potential Rewards
                </h3>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold">
                    +{contributionType ? CONTRIBUTION_TYPES[contributionType].xp : 0} XP
                  </div>
                  <div className="text-sm opacity-80">Experience Points</div>
                </div>
                <div className="text-center py-2">
                  <div className="text-3xl font-bold">
                    +{contributionType ? CONTRIBUTION_TYPES[contributionType].credits : 0}
                  </div>
                  <div className="text-sm opacity-80">Virtual Credits</div>
                </div>
                <div className="alert alert-info mt-4 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Rewards are granted after your contribution is approved by the community.
                  </span>
                </div>
              </div>
            </div>

            {/* Contribution Guidelines */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">Guidelines</h3>
                <ul className="list-none space-y-2 mt-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Provide accurate, verifiable information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Include sources for your data when possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Add high-quality images (2MB max)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Be respectful and constructive
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Check existing data before adding duplicates
                  </li>
                </ul>
              </div>
            </div>

            {/* Recent Contributions */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                        <span className="text-xs">T</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">TeslaFan42</span>
                      <span className="text-base-content/70"> added 2024 Model 3</span>
                    </div>
                    <span className="text-xs text-base-content/50">2m ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="avatar placeholder">
                      <div className="bg-secondary text-secondary-content rounded-full w-8 h-8">
                        <span className="text-xs">G</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">GreenMachine</span>
                      <span className="text-base-content/70"> updated Ioniq 6 range</span>
                    </div>
                    <span className="text-xs text-base-content/50">15m ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="avatar placeholder">
                      <div className="bg-accent text-accent-content rounded-full w-8 h-8">
                        <span className="text-xs">C</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">ChargeMaster</span>
                      <span className="text-base-content/70"> added photos to R1T</span>
                    </div>
                    <span className="text-xs text-base-content/50">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
