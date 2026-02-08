"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Filter,
  Search,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Car,
  Image,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock contribution data
const CONTRIBUTIONS = [
  {
    id: "C-2024-001",
    type: "add_vehicle",
    title: "2024 Tesla Model 3 Highland Refresh",
    description: "Added complete vehicle specifications for the 2024 Model 3 refresh",
    status: "approved",
    createdAt: "2024-02-05T14:30:00Z",
    reviewedAt: "2024-02-05T16:45:00Z",
    vehicle: {
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      slug: "tesla-model-3-2024",
    },
    xpReward: 25,
    creditsReward: 5,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 45,
      upvotes: 8,
      comments: 3,
    },
    changes: {
      fields: ["battery", "range", "charging", "performance"],
      additions: 12,
      modifications: 5,
    },
  },
  {
    id: "C-2024-002",
    type: "update_specs",
    title: "Hyundai Ioniq 6 Range Update",
    description: "Updated EPA range ratings for 2024 Ioniq 6 models",
    status: "approved",
    createdAt: "2024-02-03T10:15:00Z",
    reviewedAt: "2024-02-03T14:20:00Z",
    vehicle: {
      make: "Hyundai",
      model: "Ioniq 6",
      year: 2024,
      slug: "hyundai-ioniq-6-2024",
    },
    xpReward: 10,
    creditsReward: 2,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 32,
      upvotes: 5,
      comments: 1,
    },
    changes: {
      fields: ["range", "efficiency"],
      additions: 2,
      modifications: 3,
    },
  },
  {
    id: "C-2024-003",
    type: "add_photos",
    title: "Rivian R1T Gallery Images",
    description: "Added high-quality gallery images for Rivian R1T",
    status: "approved",
    createdAt: "2024-02-01T09:00:00Z",
    reviewedAt: "2024-02-01T11:30:00Z",
    vehicle: {
      make: "Rivian",
      model: "R1T",
      year: 2024,
      slug: "rivian-r1t-2024",
    },
    xpReward: 15,
    creditsReward: 3,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 67,
      upvotes: 12,
      comments: 4,
    },
    changes: {
      images: 8,
    },
  },
  {
    id: "C-2024-004",
    type: "write_review",
    title: "Tesla Model Y Performance Review",
    description: "Comprehensive review of Model Y Performance including real-world range and handling",
    status: "pending",
    createdAt: "2024-01-30T16:45:00Z",
    reviewedAt: null,
    vehicle: {
      make: "Tesla",
      model: "Model Y",
      year: 2023,
      slug: "tesla-model-y-2023",
    },
    xpReward: 0,
    creditsReward: 0,
    reviewer: null,
    stats: {
      views: 12,
      upvotes: 2,
      comments: 0,
    },
  },
  {
    id: "C-2024-005",
    type: "fix_data",
    title: "BMW iX Charging Speed Correction",
    description: "Corrected maximum DC charging speed for BMW iX xDrive50",
    status: "approved",
    createdAt: "2024-01-28T13:20:00Z",
    reviewedAt: "2024-01-28T15:00:00Z",
    vehicle: {
      make: "BMW",
      model: "iX",
      year: 2023,
      slug: "bmw-ix-2023",
    },
    xpReward: 20,
    creditsReward: 4,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 28,
      upvotes: 6,
      comments: 2,
    },
    changes: {
      fields: ["charging"],
      additions: 0,
      modifications: 1,
    },
  },
  {
    id: "C-2024-006",
    type: "add_vehicle",
    title: "2024 Ford Mustang Mach-E Rally",
    description: "Added new Rally trim variant for Mustang Mach-E",
    status: "revision",
    createdAt: "2024-01-25T11:00:00Z",
    reviewedAt: "2024-01-26T09:30:00Z",
    vehicle: {
      make: "Ford",
      model: "Mustang Mach-E",
      year: 2024,
      slug: "ford-mustang-mach-e-2024",
    },
    xpReward: 0,
    creditsReward: 0,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 18,
      upvotes: 1,
      comments: 1,
    },
    reviewComment: "Please verify the battery capacity for the Rally trim. Current data seems inconsistent with official sources.",
  },
  {
    id: "C-2024-007",
    type: "update_specs",
    title: "Porsche Taycan Turbo GT Specs",
    description: "Added specifications for the new Taycan Turbo GT variant",
    status: "rejected",
    createdAt: "2024-01-22T08:30:00Z",
    reviewedAt: "2024-01-22T14:15:00Z",
    vehicle: {
      make: "Porsche",
      model: "Taycan",
      year: 2024,
      slug: "porsche-taycan-2024",
    },
    xpReward: 0,
    creditsReward: 0,
    reviewer: {
      name: "ModTeam",
      avatar: null,
    },
    stats: {
      views: 5,
      upvotes: 0,
      comments: 0,
    },
    reviewComment: "Duplicate submission. This vehicle already exists in the database.",
  },
];

type StatusFilter = "all" | "approved" | "pending" | "revision" | "rejected";
type TypeFilter = "all" | "add_vehicle" | "update_specs" | "add_photos" | "write_review" | "fix_data";
type SortOrder = "newest" | "oldest" | "most_upvoted" | "most_viewed";

export default function ContributionsHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedContribution, setSelectedContribution] = useState<typeof CONTRIBUTIONS[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const filteredContributions = CONTRIBUTIONS.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOrder === "most_upvoted") return b.stats.upvotes - a.stats.upvotes;
    if (sortOrder === "most_viewed") return b.stats.views - a.stats.views;
    return 0;
  });

  const getContributionTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; icon: any }> = {
      add_vehicle: { label: "Added Vehicle", icon: Car },
      update_specs: { label: "Updated Specs", icon: Edit },
      add_photos: { label: "Added Photos", icon: Image },
      write_review: { label: "Wrote Review", icon: FileText },
      fix_data: { label: "Fixed Data", icon: AlertTriangle },
    };
    return labels[type] || { label: type, icon: FileText };
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      approved: { color: "badge-success", icon: CheckCircle, label: "Approved" },
      pending: { color: "badge-warning", icon: Clock, label: "Pending Review" },
      revision: { color: "badge-info", icon: AlertTriangle, label: "Needs Revision" },
      rejected: { color: "badge-error", icon: XCircle, label: "Rejected" },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`badge badge-sm ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const stats = {
    total: CONTRIBUTIONS.length,
    approved: CONTRIBUTIONS.filter(c => c.status === "approved").length,
    pending: CONTRIBUTIONS.filter(c => c.status === "pending").length,
    revision: CONTRIBUTIONS.filter(c => c.status === "revision").length,
    rejected: CONTRIBUTIONS.filter(c => c.status === "rejected").length,
    totalXP: CONTRIBUTIONS.reduce((sum, c) => sum + c.xpReward, 0),
    totalCredits: CONTRIBUTIONS.reduce((sum, c) => sum + c.creditsReward, 0),
    approvalRate: ((CONTRIBUTIONS.filter(c => c.status === "approved").length / CONTRIBUTIONS.length) * 100).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <FileText className="inline-block h-10 w-10 mr-2 text-primary" />
              Contribution History
            </h1>
            <p className="text-lg text-base-content/70">
              Track all your contributions, their review status, and earned rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Total</div>
            <div className="stat-value text-2xl">{stats.total}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Approved</div>
            <div className="stat-value text-2xl text-success">{stats.approved}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Pending</div>
            <div className="stat-value text-2xl text-warning">{stats.pending}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Revision</div>
            <div className="stat-value text-2xl text-info">{stats.revision}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Rejected</div>
            <div className="stat-value text-2xl text-error">{stats.rejected}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Total XP</div>
            <div className="stat-value text-2xl text-primary">{stats.totalXP}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg col-span-1">
            <div className="stat-title text-xs">Credits</div>
            <div className="stat-value text-2xl text-secondary">{stats.totalCredits}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                {/* Search and Filter Bar */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="form-control flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                      <input
                        type="text"
                        placeholder="Search contributions..."
                        className="input input-bordered pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-semibold">Status</span>
                      </label>
                      <select
                        className="select select-bordered select-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="revision">Needs Revision</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-semibold">Type</span>
                      </label>
                      <select
                        className="select select-bordered select-sm"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                      >
                        <option value="all">All Types</option>
                        <option value="add_vehicle">Added Vehicle</option>
                        <option value="update_specs">Updated Specs</option>
                        <option value="add_photos">Added Photos</option>
                        <option value="write_review">Wrote Review</option>
                        <option value="fix_data">Fixed Data</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-semibold">Sort By</span>
                      </label>
                      <select
                        className="select select-bordered select-sm"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most_upvoted">Most Upvoted</option>
                        <option value="most_viewed">Most Viewed</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Contribution List */}
                <div className="space-y-3">
                  {filteredContributions.map((contribution) => {
                    const typeInfo = getContributionTypeLabel(contribution.type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div
                        key={contribution.id}
                        className={`card cursor-pointer transition-all ${
                          selectedContribution?.id === contribution.id ? "ring-2 ring-primary" : ""
                        } ${contribution.status === "revision" ? "bg-info/10" : ""} ${contribution.status === "rejected" ? "bg-error/10" : ""}`}
                        onClick={() => setSelectedContribution(contribution)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-full p-2 ${
                              contribution.status === "approved" ? "bg-success text-success-content" :
                              contribution.status === "pending" ? "bg-warning text-warning-content" :
                              contribution.status === "revision" ? "bg-info text-info-content" :
                              "bg-error text-error-content"
                            }`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-sm">{contribution.title}</h3>
                                  <p className="text-xs text-base-content/70 mt-1">
                                    {contribution.vehicle.make} {contribution.vehicle.model} ({contribution.vehicle.year})
                                  </p>
                                </div>
                                {getStatusBadge(contribution.status)}
                              </div>
                              <p className="text-xs text-base-content/70 line-clamp-2">
                                {contribution.description}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-base-content/70">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(contribution.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {contribution.stats.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {contribution.stats.upvotes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {contribution.stats.comments}
                                </span>
                              </div>
                              {(contribution.xpReward > 0 || contribution.creditsReward > 0) && (
                                <div className="flex gap-2 mt-2">
                                  {contribution.xpReward > 0 && (
                                    <span className="badge badge-primary badge-xs">
                                      +{contribution.xpReward} XP
                                    </span>
                                  )}
                                  {contribution.creditsReward > 0 && (
                                    <span className="badge badge-secondary badge-xs">
                                      +{contribution.creditsReward} credits
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredContributions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/70">No contributions found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedContribution ? (
              <div className="card bg-base-100 shadow-lg sticky top-4">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Contribution Details</h2>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedContribution(null)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Status</div>
                    {getStatusBadge(selectedContribution.status)}
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Contribution Type</div>
                    <div className="font-semibold">
                      {getContributionTypeLabel(selectedContribution.type).label}
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Vehicle</div>
                    <a
                      href={`/vehicles/${selectedContribution.vehicle.slug}`}
                      className="link link-primary font-semibold"
                    >
                      {selectedContribution.vehicle.make} {selectedContribution.vehicle.model} ({selectedContribution.vehicle.year})
                    </a>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Description</div>
                    <p className="text-sm">{selectedContribution.description}</p>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-2">Timeline</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-base-content/50" />
                        <span>Submitted: {new Date(selectedContribution.createdAt).toLocaleString()}</span>
                      </div>
                      {selectedContribution.reviewedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-base-content/50" />
                          <span>Reviewed: {new Date(selectedContribution.reviewedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviewer Comment */}
                  {selectedContribution.reviewComment && (
                    <div className="mb-4">
                      <div className="text-sm text-base-content/70 mb-1">Reviewer Feedback</div>
                      <div className="alert alert-info">
                        <p className="text-sm">{selectedContribution.reviewComment}</p>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-2">Engagement</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="stat bg-base-200 rounded p-2">
                        <div className="stat-value text-lg">{selectedContribution.stats.views}</div>
                        <div className="stat-title text-xs">Views</div>
                      </div>
                      <div className="stat bg-base-200 rounded p-2">
                        <div className="stat-value text-lg">{selectedContribution.stats.upvotes}</div>
                        <div className="stat-title text-xs">Upvotes</div>
                      </div>
                      <div className="stat bg-base-200 rounded p-2">
                        <div className="stat-value text-lg">{selectedContribution.stats.comments}</div>
                        <div className="stat-title text-xs">Comments</div>
                      </div>
                    </div>
                  </div>

                  {/* Rewards */}
                  {(selectedContribution.xpReward > 0 || selectedContribution.creditsReward > 0) && (
                    <div className="mb-4">
                      <div className="text-sm text-base-content/70 mb-2">Rewards Earned</div>
                      <div className="flex gap-2">
                        {selectedContribution.xpReward > 0 && (
                          <div className="badge badge-primary badge-lg">
                            <Zap className="h-4 w-4 mr-1" />
                            +{selectedContribution.xpReward} XP
                          </div>
                        )}
                        {selectedContribution.creditsReward > 0 && (
                          <div className="badge badge-secondary badge-lg">
                            +{selectedContribution.creditsReward} credits
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Changes Made */}
                  {selectedContribution.changes && (
                    <div className="mb-4">
                      <div className="text-sm text-base-content/70 mb-2">Changes Made</div>
                      <div className="space-y-1">
                        {selectedContribution.changes.fields && (
                          <div className="text-sm">
                            <span className="font-semibold">Fields updated:</span>{" "}
                            {selectedContribution.changes.fields.join(", ")}
                          </div>
                        )}
                        {selectedContribution.changes.additions !== undefined && (
                          <div className="text-sm">
                            <span className="font-semibold">Additions:</span>{" "}
                            {selectedContribution.changes.additions}
                          </div>
                        )}
                        {selectedContribution.changes.modifications !== undefined && (
                          <div className="text-sm">
                            <span className="font-semibold">Modifications:</span>{" "}
                            {selectedContribution.changes.modifications}
                          </div>
                        )}
                        {selectedContribution.changes.images && (
                          <div className="text-sm">
                            <span className="font-semibold">Images added:</span>{" "}
                            {selectedContribution.changes.images}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="card-actions flex flex-col gap-2">
                    {selectedContribution.status === "pending" && (
                      <button className="btn btn-ghost btn-sm">
                        Edit Contribution
                      </button>
                    )}
                    {selectedContribution.status === "revision" && (
                      <>
                        <button className="btn btn-primary btn-sm">
                          Update & Resubmit
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          View Feedback
                        </button>
                      </>
                    )}
                    <a
                      href={`/vehicles/${selectedContribution.vehicle.slug}`}
                      className="btn btn-ghost btn-sm"
                    >
                      View Vehicle Page
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/70">
                      Select a contribution to view details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6">
          <a href="/contribute" className="btn btn-primary btn-lg">
            <FileText className="h-5 w-5 mr-2" />
            New Contribution
          </a>
        </div>
      </div>
    </div>
  );
}

const Zap = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
