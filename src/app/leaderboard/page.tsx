"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Leaderboard from "@/components/gamification/Leaderboard";
import { formatNumber } from "@/lib/format";

interface Entry {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  contributions: number;
}

interface Meta {
  totalContributors: number;
  yourRank: { rank: number; xp: number; contributions: number } | null;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "allTime">("monthly");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ timeframe, limit: "10" });
    if (session?.user?.id) params.set("userId", session.user.id);
    fetch(`/api/leaderboard?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        setEntries(json.data || []);
        setMeta(json.meta || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [timeframe, session?.user?.id]);

  const title =
    timeframe === "weekly"
      ? "Weekly Top Contributors"
      : timeframe === "monthly"
      ? "Monthly Champions"
      : "All-Time Legends";
  const tfLabel =
    timeframe === "weekly" ? "Last 7 days" : timeframe === "monthly" ? "Last 30 days" : "All time";

  const mapped = entries.map((e) => ({ ...e, username: e.name }));
  const yourRank = meta?.yourRank;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-4xl">🏆</span> Leaderboard
            </h1>
            <p className="text-lg text-base-content/70">
              See who&apos;s making the biggest contributions to our community.
              Compete for top spots and earn exclusive rewards!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed">
            {(["weekly", "monthly", "allTime"] as const).map((tf) => (
              <button
                key={tf}
                className={`tab ${timeframe === tf ? "tab-active" : ""}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf === "weekly" ? "This Week" : tf === "monthly" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              </div>
            ) : (
              <Leaderboard
                entries={mapped}
                currentUserId={session?.user?.id}
                title={title}
                timeframe={tfLabel}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">Your Position</h3>
                {yourRank ? (
                  <>
                    <div className="text-center py-4">
                      <div className="text-5xl font-bold text-primary">#{yourRank.rank}</div>
                      <div className="text-base-content/70 mt-2">
                        out of {formatNumber(meta?.totalContributors ?? 0)} contributors
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Your XP</span>
                        <span className="font-bold">{formatNumber(yourRank.xp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Approved Contributions</span>
                        <span className="font-bold">{formatNumber(yourRank.contributions)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-base-content/60 text-center py-6">
                    {session?.user?.id
                      ? "You don't have a rank yet. Start contributing!"
                      : "Sign in to see your position."}
                  </p>
                )}
                <div className="card-actions justify-end mt-4">
                  <a href="/dashboard" className="btn btn-primary btn-sm w-full">
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>

            {entries.length >= 3 && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="font-bold text-lg mb-4">🏆 Top 3 This Month</h3>
                  <div className="flex justify-center items-end gap-4">
                    <Podium entry={entries[1]} place={2} />
                    <Podium entry={entries[0]} place={1} />
                    <Podium entry={entries[2]} place={3} />
                  </div>
                </div>
              </div>
            )}

            <div className="card bg-secondary text-secondary-content shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">
                  <span className="text-xl">🎁</span> Monthly Rewards
                </h3>
                <ul className="list-none mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span>🥇</span> 1st Place: 500 credits + Legend badge
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🥈</span> 2nd Place: 250 credits + Champion badge
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🥉</span> 3rd Place: 100 credits + Expert badge
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎯</span> Top 10: 25 credits each
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Podium({ entry, place }: { entry: Entry; place: 1 | 2 | 3 }) {
  const styles = {
    1: { avatar: "bg-yellow-400 text-yellow-900", size: "w-16 h-16", medal: "🥇", cls: "text-primary font-bold" },
    2: { avatar: "bg-gray-300 text-gray-800", size: "w-12 h-12", medal: "🥈", cls: "font-semibold text-sm" },
    3: { avatar: "bg-orange-300 text-orange-900", size: "w-12 h-12", medal: "🥉", cls: "font-semibold text-sm" },
  }[place];
  return (
    <div className="text-center">
      <div className="avatar placeholder mb-2">
        <div className={`${styles.avatar} rounded-full ${styles.size}`}>
          <span className="text-lg">{(entry.name || "?").charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <div className="text-2xl">{styles.medal}</div>
      <div className={styles.cls}>{entry.name}</div>
      <div className="text-xs text-base-content/70">{formatNumber(entry.xp)} XP</div>
    </div>
  );
}
