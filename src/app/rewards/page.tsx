"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Award,
  Zap,
  Calendar,
  Target,
  TrendingUp,
  Lock,
  Gift,
  Sparkles,
  Gem,
} from "lucide-react";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";

interface CatalogAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: string;
}
interface EarnedAchievement extends CatalogAchievement {
  earnedAt: string;
}
interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

type AchievementFilter = "all" | "unlocked" | "locked";

const RARITY: Record<string, { color: string; bg: string; label: string }> = {
  COMMON: { color: "text-base-content", bg: "bg-base-300", label: "Common" },
  UNCOMON: { color: "text-success", bg: "bg-success/10", label: "Uncommon" },
  RARE: { color: "text-primary", bg: "bg-primary/10", label: "Rare" },
  EPIC: { color: "text-purple-500", bg: "bg-purple-500/10", label: "Epic" },
  LEGENDARY: { color: "text-warning", bg: "bg-warning/10", label: "Legendary" },
};

const TXN_ICON: Record<string, { icon: typeof Award; cls: string }> = {
  EARN_CONTRIBUTION: { icon: Target, cls: "text-primary" },
  EARN_VOTE: { icon: TrendingUp, cls: "text-primary" },
  EARN_STREAK: { icon: Gift, cls: "text-success" },
  ACHIEVEMENT_REWARD: { icon: Award, cls: "text-warning" },
  LEVEL_UP_BONUS: { icon: TrendingUp, cls: "text-purple-500" },
  PURCHASE_CREDITS: { icon: Gem, cls: "text-secondary" },
  API_USAGE: { icon: Zap, cls: "text-accent" },
};

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"achievements" | "history">("achievements");
  const [filter, setFilter] = useState<AchievementFilter>("all");
  const [catalog, setCatalog] = useState<CatalogAchievement[]>([]);
  const [earned, setEarned] = useState<EarnedAchievement[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!session?.user?.id) return;
    const id = session.user.id;
    Promise.all([
      fetch("/api/achievements").then((r) => r.json()),
      fetch(`/api/users/${id}/achievements`).then((r) => r.json()),
      fetch(`/api/users/${id}/credits`).then((r) => r.json()),
    ]).then(([c, e, cr]) => {
      setCatalog(c.data || []);
      setEarned(e.data || []);
      setTransactions(cr.data?.transactions || []);
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

  const merged = catalog.map((a) => {
    const e = earned.find((x) => x.id === a.id);
    return { ...a, earnedAt: e?.earnedAt };
  });

  const filtered = merged.filter((a) => {
    if (filter === "unlocked") return a.earnedAt;
    if (filter === "locked") return !a.earnedAt;
    return true;
  });

  const stats = {
    total: catalog.length,
    unlocked: earned.length,
    xpFromAchievements: earned.reduce((s, a) => s + a.xpReward, 0),
    completion: catalog.length > 0 ? Math.round((earned.length / catalog.length) * 100) : 0,
  };

  const rewardHistory = transactions.filter((t) => t.amount > 0 && t.type !== "PURCHASE_CREDITS");

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Trophy className="inline-block h-10 w-10 mr-2 text-primary" />
              Rewards &amp; Achievements
            </h1>
            <p className="text-lg text-base-content/70">
              Celebrate your accomplishments and track your earned rewards.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary"><Trophy className="h-8 w-8" /></div>
            <div className="stat-title">Achievements</div>
            <div className="stat-value text-2xl">{stats.unlocked}/{stats.total}</div>
            <div className="stat-desc">Unlocked</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent"><Zap className="h-8 w-8" /></div>
            <div className="stat-title">XP from Achievements</div>
            <div className="stat-value text-2xl text-accent">{formatNumber(stats.xpFromAchievements)}</div>
            <div className="stat-desc">Earned</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success"><Target className="h-8 w-8" /></div>
            <div className="stat-title">Reward Events</div>
            <div className="stat-value text-2xl">{formatNumber(rewardHistory.length)}</div>
            <div className="stat-desc">Total</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-warning"><Sparkles className="h-8 w-8" /></div>
            <div className="stat-title">Completion</div>
            <div className="stat-value text-2xl text-warning">{stats.completion}%</div>
            <div className="stat-desc">All achievements</div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="join">
            <button className={`join-item btn ${tab === "achievements" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("achievements")}>
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </button>
            <button className={`join-item btn ${tab === "history" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("history")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Reward History
            </button>
          </div>
        </div>

        {tab === "achievements" && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="join">
                {(["all", "unlocked", "locked"] as AchievementFilter[]).map((f) => (
                  <button
                    key={f}
                    className={`join-item btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === "all" ? "All" : f === "unlocked" ? "Unlocked" : "Locked"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a) => {
                const rarity = RARITY[a.rarity] || RARITY.COMMON;
                const isUnlocked = !!a.earnedAt;
                return (
                  <div key={a.id} className={`card bg-base-100 shadow-lg ${!isUnlocked ? "opacity-60" : ""}`}>
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`text-5xl ${!isUnlocked ? "grayscale" : ""}`}>{a.icon}</div>
                        <span className={`badge ${rarity.bg} ${rarity.color} badge-sm`}>{rarity.label}</span>
                      </div>
                      <h3 className="card-title text-lg">{a.name}</h3>
                      <p className="text-sm text-base-content/70 mb-4">{a.description}</p>
                      <div className="flex gap-2 mb-4">
                        <span className="badge badge-primary badge-sm"><Zap className="h-3 w-3 mr-1" />+{a.xpReward} XP</span>
                      </div>
                      {isUnlocked ? (
                        <div className="text-xs text-base-content/70">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Unlocked on {formatDate(a.earnedAt)}
                        </div>
                      ) : (
                        <div className="text-xs text-base-content/50">
                          <Lock className="h-3 w-3 inline mr-1" />
                          Keep contributing to unlock
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/70">No achievements found matching your filter.</p>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="space-y-3">
                {rewardHistory.map((t) => {
                  const meta = TXN_ICON[t.type] || TXN_ICON.EARN_CONTRIBUTION;
                  const Icon = meta.icon;
                  return (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-base-300">
                          <Icon className={`h-5 w-5 ${meta.cls}`} />
                        </div>
                        <div>
                          <div className="font-semibold">{t.description}</div>
                          <div className="text-xs text-base-content/50 mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDateTime(t.createdAt)}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-secondary badge-lg">+{formatNumber(t.amount)}</span>
                    </div>
                  );
                })}
              </div>

              {rewardHistory.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                  <p className="text-base-content/70">No rewards earned yet. Start contributing!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
