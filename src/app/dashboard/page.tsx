"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserStats from "@/components/gamification/UserStats";
import Achievements from "@/components/gamification/Achievements";
import {
  Car,
  Zap,
  Trophy,
  CreditCard,
  History,
  Bell,
  User,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/format";

interface StatsData {
  user: {
    name: string;
    xp: number;
    credits: number;
    totalContributions: number;
    streak: number;
  };
  contributions: {
    id: string;
    type: string;
    status: string;
    createdAt: string;
    xpReward: number;
    vehicle: { make: string; model: string } | null;
  }[];
}

interface CatalogAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity?: string;
}

interface EarnedAchievement extends CatalogAchievement {
  earnedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "settings">("overview");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [catalog, setCatalog] = useState<CatalogAchievement[]>([]);
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!session?.user?.id) return;

    const id = session.user.id;
    Promise.all([
      fetch(`/api/users/${id}/stats`).then((r) => r.json()),
      fetch(`/api/users/${id}/achievements`).then((r) => r.json()),
      fetch(`/api/achievements`).then((r) => r.json()),
    ])
      .then(([statsJson, earnedJson, catalogJson]) => {
        setStats(statsJson.data || null);
        setEarned(earnedJson.data || []);
        setCatalog(catalogJson.data || []);
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-base-content/60">Unable to load dashboard.</p>
      </div>
    );
  }

  const recent = stats.contributions.slice(0, 5);
  const mergedAchievements = catalog.map((a) => {
    const e = earned.find((x) => x.id === a.id);
    return { ...a, earnedAt: e?.earnedAt };
  });

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Car className="inline-block h-10 w-10 mr-2 text-primary" />
              Your Dashboard
            </h1>
            <p className="text-lg text-base-content/70">
              Track your progress, manage your contributions, and view your rewards.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  <button
                    className={`btn btn-block justify-start ${activeTab === "overview" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Overview
                  </button>
                  <button
                    className={`btn btn-block justify-start ${activeTab === "achievements" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setActiveTab("achievements")}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </button>
                  <Link href="/contributions/history" className="btn btn-block justify-start btn-ghost">
                    <History className="h-4 w-4 mr-2" />
                    Contributions
                  </Link>
                  <Link href="/stats" className="btn btn-block justify-start btn-ghost">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistics
                  </Link>
                  <Link href="/billing" className="btn btn-block justify-start btn-ghost">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </Link>
                  <Link href="/api-usage" className="btn btn-block justify-start btn-ghost">
                    <Activity className="h-4 w-4 mr-2" />
                    API Usage
                  </Link>
                  <Link href="/profile" className="btn btn-block justify-start btn-ghost">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </nav>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg mt-6">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/contribute" className="btn btn-primary btn-block">
                    Contribute
                  </Link>
                  <Link href="/stats" className="btn btn-ghost btn-block">
                    View Statistics
                  </Link>
                  <Link href="/credits" className="btn btn-ghost btn-block">
                    Buy Credits
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <UserStats
                  username={stats.user.name || "User"}
                  xp={stats.user.xp}
                  credits={stats.user.credits}
                  contributions={stats.user.totalContributions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="font-bold text-lg mb-4">
                        <History className="h-5 w-5 text-primary inline mr-2" />
                        Recent Contributions
                      </h3>
                      {recent.length === 0 ? (
                        <p className="text-base-content/60 text-sm py-4">
                          No contributions yet. <Link href="/contribute" className="link link-primary">Start contributing!</Link>
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {recent.map((c) => (
                            <div key={c.id} className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                  <span className="text-xs">
                                    {(c.vehicle?.make || c.type).charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {c.vehicle ? `${c.vehicle.make} ${c.vehicle.model}` : c.type.replace(/_/g, " ")}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-base-content/70">
                                  <span>{timeAgo(c.createdAt)}</span>
                                  <span className={`badge badge-xs ${c.status === "APPROVED" ? "badge-success" : "badge-warning"}`}>
                                    {c.status}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-sm text-primary">+{c.xpReward} XP</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <Link href="/contributions/history" className="btn btn-ghost btn-sm btn-block mt-4">
                        View All Contributions
                      </Link>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="font-bold text-lg mb-4">
                        <CreditCard className="h-5 w-5 text-primary inline mr-2" />
                        Credits
                      </h3>
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-secondary">
                          {formatNumber(stats.user.credits)}
                        </div>
                        <div className="text-sm text-base-content/70 mt-2">credits available</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/credits" className="btn btn-sm btn-primary">
                          Buy More Credits
                        </Link>
                        <Link href="/billing" className="btn btn-sm btn-ghost">
                          Transaction History
                        </Link>
                      </div>
                      <div className="divider"></div>
                      <div className="text-sm text-base-content/70">
                        <p>
                          <Bell className="h-4 w-4 inline mr-1" />
                          You have a {stats.user.streak}-day contribution streak. Keep it up!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "achievements" && (
              <Achievements achievements={mergedAchievements} />
            )}

            {activeTab === "settings" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="font-bold text-lg mb-4">
                    <Settings className="h-5 w-5 text-primary inline mr-2" />
                    Account Settings
                  </h3>
                  <p className="text-base-content/60">
                    Manage your full account settings from the{" "}
                    <Link href="/profile" className="link link-primary">Profile page</Link>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
