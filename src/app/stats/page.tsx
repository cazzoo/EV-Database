"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Zap,
  Award,
  Activity,
  ArrowUp,
} from "lucide-react";
import { formatDate, formatNumber, timeAgo } from "@/lib/format";
import { ROLES, getLevel } from "@/lib/gamification";

interface StatsResponse {
  user: {
    xp: number;
    credits: number;
    totalContributions: number;
    streak: number;
    level: number;
  };
  contributions: {
    id: string;
    type: string;
    createdAt: string;
    xpReward: number;
    vehicle: { make: string; model: string } | null;
  }[];
  contributionTypes: { type: string; _count: { id: number } }[];
  weeklyContributions: number;
  monthlyContributions: number;
}
interface ProgressResponse {
  level: { name: string; minXP: number };
  next: { name: string; minXP: number };
  progress: number;
  xpToNext: number;
}
interface AchievementItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt: string;
}
interface RankInfo {
  rank: number;
  xp: number;
  contributions: number;
}

type StatCategory = "overview" | "contributions" | "achievements" | "progress";

const TYPE_LABELS: Record<string, string> = {
  ADD_VEHICLE: "Vehicles Added",
  UPDATE_SPECS: "Specs Updated",
  ADD_PHOTO: "Photos Added",
  REVIEW: "Reviews Written",
  FIX_DATA: "Data Fixes",
};

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState<StatCategory>("overview");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [rank, setRank] = useState<RankInfo | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
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
      fetch(`/api/users/${id}/progress`).then((r) => r.json()),
      fetch(`/api/users/${id}/achievements`).then((r) => r.json()),
      fetch(`/api/leaderboard?userId=${id}&limit=5`).then((r) => r.json()),
    ]).then(([s, p, a, lb]) => {
      setStats(s.data || null);
      setProgress(p.data || null);
      setAchievements(a.data || []);
      setRank(lb.meta?.yourRank || null);
      setTotalUsers(lb.meta?.totalContributors || 0);
      setLoading(false);
    });
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
        <p className="text-base-content/60">Unable to load statistics.</p>
      </div>
    );
  }

  const totalContribs = stats.contributions.length;
  const level = getLevel(stats.user.xp);
  const rankValue = rank?.rank || 0;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <BarChart3 className="inline-block h-10 w-10 mr-2 text-primary" />
              My Statistics
            </h1>
            <p className="text-lg text-base-content/70">
              Track your progress, analyze your contributions, and celebrate your achievements.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary"><Zap className="h-8 w-8" /></div>
            <div className="stat-title">Total XP</div>
            <div className="stat-value text-primary">{formatNumber(stats.user.xp)}</div>
            <div className="stat-desc">{level.current.name}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary"><Target className="h-8 w-8" /></div>
            <div className="stat-title">Approved Contributions</div>
            <div className="stat-value text-secondary">{formatNumber(stats.user.totalContributions)}</div>
            <div className="stat-desc">{stats.weeklyContributions} this week</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent"><Trophy className="h-8 w-8" /></div>
            <div className="stat-title">Leaderboard</div>
            <div className="stat-value text-accent">#{rankValue || "-"}</div>
            <div className="stat-desc">of {formatNumber(totalUsers)} contributors</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success"><Award className="h-8 w-8" /></div>
            <div className="stat-title">Achievements</div>
            <div className="stat-value text-success">{formatNumber(achievements.length)}</div>
            <div className="stat-desc">Unlocked</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  {([
                    ["overview", "Overview", Activity],
                    ["contributions", "Contributions", Target],
                    ["achievements", "Achievements", Trophy],
                    ["progress", "Progress", TrendingUp],
                  ] as const).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      className={`btn btn-block justify-start ${category === id ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setCategory(id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg mt-6">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">
                  <Trophy className="h-5 w-5 text-primary inline mr-2" />
                  Your Rank
                </h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary">#{rankValue || "-"}</div>
                  <div className="text-sm text-base-content/70 mt-2">of {formatNumber(totalUsers)} contributors</div>
                </div>
                <Link href="/leaderboard" className="btn btn-ghost btn-sm btn-block mt-2">
                  View Full Leaderboard
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {category === "overview" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Zap className="h-5 w-5 text-primary" />
                      XP &amp; Level Progress
                    </h2>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{level.current.name}</span>
                        <span className="text-sm text-base-content/70">
                          {formatNumber(stats.user.xp)} XP
                        </span>
                      </div>
                      <progress className="progress progress-primary w-full" value={level.progress} max="100"></progress>
                      <div className="text-sm text-base-content/70 mt-2">
                        {formatNumber(level.xpToNext)} XP to {level.next.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-content rounded-full p-3"><Activity className="h-6 w-6" /></div>
                        <div>
                          <div className="text-2xl font-bold">{stats.weeklyContributions}</div>
                          <div className="text-sm text-base-content/70">This Week</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary text-secondary-content rounded-full p-3"><Target className="h-6 w-6" /></div>
                        <div>
                          <div className="text-2xl font-bold">{stats.monthlyContributions}</div>
                          <div className="text-sm text-base-content/70">This Month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent text-accent-content rounded-full p-3"><Zap className="h-6 w-6" /></div>
                        <div>
                          <div className="text-2xl font-bold">{stats.user.streak}</div>
                          <div className="text-sm text-base-content/70">Day Streak</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {category === "contributions" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Target className="h-5 w-5 text-primary" />
                      Contribution Breakdown
                    </h2>
                    {stats.contributionTypes.length === 0 ? (
                      <p className="text-base-content/60">No approved contributions yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {stats.contributionTypes.map((c) => {
                          const pct = totalContribs > 0 ? Math.round((c._count.id / totalContribs) * 100) : 0;
                          return (
                            <div key={c.type}>
                              <div className="flex justify-between mb-2">
                                <span className="font-semibold">{TYPE_LABELS[c.type] || c.type}</span>
                                <span className="text-sm text-base-content/70">{c._count.id} ({pct}%)</span>
                              </div>
                              <progress className="progress progress-primary w-full" value={pct} max="100"></progress>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Contributions
                    </h2>
                    {stats.contributions.length === 0 ? (
                      <p className="text-base-content/60">No contributions yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Vehicle</th>
                              <th>XP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.contributions.map((c) => (
                              <tr key={c.id}>
                                <td className="text-sm">{formatDate(c.createdAt)}</td>
                                <td><span className="badge badge-primary badge-sm">{TYPE_LABELS[c.type] || c.type}</span></td>
                                <td className="text-sm">{c.vehicle ? `${c.vehicle.make} ${c.vehicle.model}` : "-"}</td>
                                <td className="font-semibold text-primary">+{c.xpReward}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {category === "achievements" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Award className="h-5 w-5 text-primary" />
                      Unlocked Achievements
                    </h2>
                    {achievements.length === 0 ? (
                      <p className="text-base-content/60">No achievements unlocked yet. Keep contributing!</p>
                    ) : (
                      <div className="space-y-4">
                        {achievements.map((a) => (
                          <div key={a.id} className="card bg-base-200">
                            <div className="card-body p-4">
                              <div className="flex items-start gap-4">
                                <div className="text-4xl">{a.icon}</div>
                                <div className="flex-1">
                                  <h3 className="font-bold">{a.name}</h3>
                                  <p className="text-sm text-base-content/70">{a.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-base-content/70">
                                      <Calendar className="h-3 w-3 inline mr-1" />
                                      {timeAgo(a.earnedAt)}
                                    </span>
                                    <span className="badge badge-success badge-sm">+{a.xpReward} XP</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link href="/rewards" className="btn btn-ghost btn-block mt-4">
                      View All Rewards
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {category === "progress" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Trophy className="h-5 w-5 text-primary" />
                      Level Progression
                    </h2>
                    <div className="space-y-4">
                      {ROLES.map((role) => {
                        const achieved = stats.user.xp >= role.minXP;
                        return (
                          <div
                            key={role.name}
                            className={`flex items-center justify-between p-3 rounded-lg ${achieved ? "bg-primary/10" : "bg-base-200 opacity-50"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-bold">{role.name}</div>
                              <div className="text-sm text-base-content/70">{formatNumber(role.minXP)} XP</div>
                            </div>
                            {achieved ? (
                              <span className={`badge ${role.color}`}>Unlocked</span>
                            ) : (
                              <span className="badge badge-ghost">Locked</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Target className="h-5 w-5 text-primary" />
                      Next Milestone
                    </h2>
                    {progress ? (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">Progress to {progress.next.name}</span>
                          <span className="text-sm text-base-content/70">{progress.progress.toFixed(0)}%</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={progress.progress} max="100"></progress>
                        <div className="text-sm text-base-content/70 mt-2 flex items-center gap-1">
                          <ArrowUp className="h-3 w-3 text-success" />
                          {formatNumber(progress.xpToNext)} XP to go
                        </div>
                      </div>
                    ) : (
                      <p className="text-base-content/60">No progress data.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
