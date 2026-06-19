"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Filter,
  Search,
  Calendar,
  Car,
  Image as ImageIcon,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { vehicleSlug } from "@/lib/vehicles";

interface Contribution {
  id: string;
  type: string;
  status: string;
  content: string;
  xpReward: number;
  creditsCost: number;
  createdAt: string;
  reviewedAt: string | null;
  vehicle: { id: string; make: string; model: string; year: number } | null;
}

type StatusFilter = "all" | "APPROVED" | "PENDING" | "REVISION" | "REJECTED";

const TYPE_LABELS: Record<string, { label: string; icon: typeof Car }> = {
  ADD_VEHICLE: { label: "Added Vehicle", icon: Car },
  UPDATE_SPECS: { label: "Updated Specs", icon: Edit },
  ADD_PHOTO: { label: "Added Photos", icon: ImageIcon },
  REVIEW: { label: "Wrote Review", icon: FileText },
  FIX_DATA: { label: "Fixed Data", icon: AlertTriangle },
};

export default function ContributionsHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contribution | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!session?.user?.id) return;
    fetch(`/api/contributions?userId=${session.user.id}&limit=100`)
      .then((r) => r.json())
      .then((json) => {
        setContributions(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session?.user?.id, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const filtered = contributions
    .filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (searchQuery) {
        const hay = `${c.type} ${c.content} ${c.vehicle?.make} ${c.vehicle?.model}`.toLowerCase();
        if (!hay.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    total: contributions.length,
    approved: contributions.filter((c) => c.status === "APPROVED").length,
    pending: contributions.filter((c) => c.status === "PENDING").length,
    revision: contributions.filter((c) => c.status === "REVISION").length,
    rejected: contributions.filter((c) => c.status === "REJECTED").length,
    totalXP: contributions.reduce((s, c) => s + c.xpReward, 0),
    totalCredits: contributions.reduce((s, c) => s + c.creditsCost, 0),
  };

  const typeIcon = (type: string) => TYPE_LABELS[type]?.icon || FileText;
  const typeLabel = (type: string) => TYPE_LABELS[type]?.label || type.replace(/_/g, " ");

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
      APPROVED: { color: "badge-success", icon: CheckCircle, label: "Approved" },
      PENDING: { color: "badge-warning", icon: Clock, label: "Pending Review" },
      REVISION: { color: "badge-info", icon: AlertTriangle, label: "Needs Revision" },
      REJECTED: { color: "badge-error", icon: XCircle, label: "Rejected" },
    };
    const b = map[status] || map.PENDING;
    const Icon = b.icon;
    return (
      <span className={`badge badge-sm ${b.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {b.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Approved" value={stats.approved} color="text-success" />
          <StatCard label="Pending" value={stats.pending} color="text-warning" />
          <StatCard label="Revision" value={stats.revision} color="text-info" />
          <StatCard label="Rejected" value={stats.rejected} color="text-error" />
          <StatCard label="Total XP" value={stats.totalXP} color="text-primary" />
          <StatCard label="Credits" value={stats.totalCredits} color="text-secondary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
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
                  <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-semibold">Status</span>
                      </label>
                      <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                        <option value="all">All Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REVISION">Needs Revision</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs font-semibold">Type</span>
                      </label>
                      <select className="select select-bordered select-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">All Types</option>
                        <option value="ADD_VEHICLE">Added Vehicle</option>
                        <option value="UPDATE_SPECS">Updated Specs</option>
                        <option value="ADD_PHOTO">Added Photos</option>
                        <option value="REVIEW">Wrote Review</option>
                        <option value="FIX_DATA">Fixed Data</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {filtered.map((c) => {
                    const TypeIcon = typeIcon(c.type);
                    return (
                      <div
                        key={c.id}
                        className={`card cursor-pointer transition-all ${
                          selected?.id === c.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelected(c)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full p-2 bg-neutral text-neutral-content">
                              <TypeIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-sm">{typeLabel(c.type)}</h3>
                                  {c.vehicle && (
                                    <p className="text-xs text-base-content/70 mt-1">
                                      {c.vehicle.make} {c.vehicle.model} ({c.vehicle.year})
                                    </p>
                                  )}
                                </div>
                                {statusBadge(c.status)}
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-base-content/70">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              {(c.xpReward > 0 || c.creditsCost > 0) && (
                                <div className="flex gap-2 mt-2">
                                  {c.xpReward > 0 && <span className="badge badge-primary badge-xs">+{c.xpReward} XP</span>}
                                  {c.creditsCost > 0 && <span className="badge badge-secondary badge-xs">+{c.creditsCost} credits</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/70">No contributions found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selected ? (
              <div className="card bg-base-100 shadow-lg sticky top-4">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Details</h2>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Status</div>
                    {statusBadge(selected.status)}
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Type</div>
                    <div className="font-semibold">{typeLabel(selected.type)}</div>
                  </div>
                  {selected.vehicle && (
                    <div className="mb-4">
                      <div className="text-sm text-base-content/70 mb-1">Vehicle</div>
                      <Link
                        href={`/vehicles/${vehicleSlug(selected.vehicle)}`}
                        className="link link-primary font-semibold"
                      >
                        {selected.vehicle.make} {selected.vehicle.model} ({selected.vehicle.year})
                      </Link>
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-1">Details</div>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {selected.content || "No additional details provided."}
                    </p>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-base-content/70 mb-2">Timeline</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-base-content/50" />
                        Submitted: {formatDateTime(selected.createdAt)}
                      </div>
                      {selected.reviewedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-base-content/50" />
                          Reviewed: {formatDateTime(selected.reviewedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  {(selected.xpReward > 0 || selected.creditsCost > 0) && (
                    <div className="mb-4">
                      <div className="text-sm text-base-content/70 mb-2">Rewards Earned</div>
                      <div className="flex gap-2">
                        {selected.xpReward > 0 && <span className="badge badge-primary badge-lg">+{selected.xpReward} XP</span>}
                        {selected.creditsCost > 0 && <span className="badge badge-secondary badge-lg">+{selected.creditsCost} credits</span>}
                      </div>
                    </div>
                  )}
                  {selected.vehicle && (
                    <Link href={`/vehicles/${vehicleSlug(selected.vehicle)}`} className="btn btn-ghost btn-sm">
                      View Vehicle Page
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/70">Select a contribution to view details</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <Link href="/contribute" className="btn btn-primary btn-lg">
            <FileText className="h-5 w-5 mr-2" />
            New Contribution
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="stat bg-base-100 shadow-lg rounded-lg">
      <div className="stat-title text-xs">{label}</div>
      <div className={`stat-value text-2xl ${color || ""}`}>{formatNumber(value)}</div>
    </div>
  );
}
