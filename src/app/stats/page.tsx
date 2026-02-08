"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Zap,
  Award,
  Activity,
  Users,
  Eye,
  ThumbsUp,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Mock data for statistics
const STATS_OVERVIEW = {
  totalContributions: 47,
  approvedContributions: 42,
  pendingContributions: 5,
  totalXP: 1560,
  currentLevel: 5,
  credits: 245,
  rank: 12,
  totalViews: 1243,
  totalUpvotes: 89,
};

const XP_HISTORY = [
  { month: "2023-08", xp: 100, level: 1 },
  { month: "2023-09", xp: 350, level: 2 },
  { month: "2023-10", xp: 620, level: 3 },
  { month: "2023-11", xp: 980, level: 4 },
  { month: "2023-12", xp: 1350, level: 5 },
  { month: "2024-01", xp: 1560, level: 5 },
];

const CONTRIBUTION_STATS = [
  { type: "Vehicles Added", count: 12, percentage: 25 },
  { type: "Specs Updated", count: 18, percentage: 38 },
  { type: "Images Added", count: 8, percentage: 17 },
  { type: "Reviews Written", count: 9, percentage: 20 },
];

const ACTIVITY_HEATMAP = [
  { day: "Mon", count: 5 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 6 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 7 },
  { day: "Sun", count: 2 },
];

const MILESTONES = [
  { id: 1, name: "First Contribution", achieved: true, date: "2023-08-15" },
  { id: 2, name: "10 Contributions", achieved: true, date: "2023-09-20" },
  { id: 3, name: "25 Contributions", achieved: true, date: "2023-11-05" },
  { id: 4, name: "50 Contributions", achieved: false, progress: 47, target: 50 },
  { id: 5, name: "1000 XP", achieved: true, date: "2023-12-10" },
  { id: 6, name: "Level 5", achieved: true, date: "2024-01-15" },
  { id: 7, name: "Level 10", achieved: false, progress: 5, target: 10 },
];

const LEADERBOARD_POSITIONS = [
  { rank: 10, user: "EVMaster", xp: 1820, change: 2 },
  { rank: 11, user: "ElectroFan", xp: 1720, change: -1 },
  { rank: 12, user: "You", xp: 1560, change: 0, isCurrentUser: true },
  { rank: 13, user: "CarLover", xp: 1490, change: 1 },
  { rank: 14, user: "TechGuru", xp: 1420, change: -3 },
];

const RECENT_ACHIEVEMENTS = [
  {
    id: "data_master",
    name: "Data Master",
    description: "Made 25 approved contributions",
    earnedAt: "2024-01-28",
    xpReward: 50,
  },
  {
    id: "quality_contributor",
    name: "Quality Contributor",
    description: "Maintained 95% approval rate",
    earnedAt: "2024-01-20",
    xpReward: 30,
  },
  {
    id: "streak_week",
    name: "Week Warrior",
    description: "Contributed 7 days in a row",
    earnedAt: "2024-01-15",
    xpReward: 25,
  },
];

type TimeRange = "7d" | "30d" | "90d" | "all";
type StatCategory = "overview" | "contributions" | "achievements" | "progress";

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [activeCategory, setActiveCategory] = useState<StatCategory>("overview");

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

  const approvalRate = ((STATS_OVERVIEW.approvedContributions / STATS_OVERVIEW.totalContributions) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="join">
            {(["7d", "30d", "90d", "all"] as TimeRange[]).map((range) => (
              <button
                key={range}
                className={`join-item btn ${
                  timeRange === range ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <div className="stat-title">Total XP</div>
            <div className="stat-value text-primary">{STATS_OVERVIEW.totalXP}</div>
            <div className="stat-desc">Level {STATS_OVERVIEW.currentLevel}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <Target className="h-8 w-8" />
            </div>
            <div className="stat-title">Contributions</div>
            <div className="stat-value text-secondary">{STATS_OVERVIEW.totalContributions}</div>
            <div className="stat-desc">{approvalRate}% approved</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="stat-title">Leaderboard</div>
            <div className="stat-value text-accent">#{STATS_OVERVIEW.rank}</div>
            <div className="stat-desc">Top 5%</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success">
              <Award className="h-8 w-8" />
            </div>
            <div className="stat-title">Achievements</div>
            <div className="stat-value text-success">{RECENT_ACHIEVEMENTS.length}</div>
            <div className="stat-desc">Unlocked</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  <button
                    className={`btn btn-block justify-start ${
                      activeCategory === "overview" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveCategory("overview")}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Overview
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeCategory === "contributions" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveCategory("contributions")}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Contributions
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeCategory === "achievements" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveCategory("achievements")}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeCategory === "progress" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveCategory("progress")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Progress
                  </button>
                </nav>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="card bg-base-100 shadow-lg mt-6">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">
                  <Trophy className="h-5 w-5 text-primary inline mr-2" />
                  Your Rank
                </h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary">#{STATS_OVERVIEW.rank}</div>
                  <div className="text-sm text-base-content/70 mt-2">out of 1,245 users</div>
                </div>
                <div className="space-y-2">
                  {LEADERBOARD_POSITIONS.map((pos) => (
                    <div
                      key={pos.rank}
                      className={`flex items-center justify-between p-2 rounded ${
                        pos.isCurrentUser ? "bg-primary text-primary-content" : "bg-base-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">#{pos.rank}</span>
                        <span className="text-sm">{pos.user}</span>
                      </div>
                      <div className="text-xs">
                        {pos.change > 0 ? (
                          <span className="text-success">
                            <ArrowUp className="h-3 w-3 inline" /> {pos.change}
                          </span>
                        ) : pos.change < 0 ? (
                          <span className="text-error">
                            <ArrowDown className="h-3 w-3 inline" /> {Math.abs(pos.change)}
                          </span>
                        ) : (
                          <span className="text-base-content/70">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/leaderboard" className="btn btn-ghost btn-sm btn-block mt-4">
                  View Full Leaderboard
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeCategory === "overview" && (
              <div className="space-y-6">
                {/* XP Progress */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Zap className="h-5 w-5 text-primary" />
                      XP & Level Progress
                    </h2>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Level {STATS_OVERVIEW.currentLevel}</span>
                        <span className="text-sm text-base-content/70">
                          {STATS_OVERVIEW.totalXP} / 2000 XP
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={STATS_OVERVIEW.totalXP}
                        max="2000"
                      ></progress>
                      <div className="text-sm text-base-content/70 mt-2">
                        440 XP to Level 6
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>XP Gained</th>
                            <th>Level</th>
                            <th>Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {XP_HISTORY.map((entry, index) => {
                            const prevXP = index > 0 ? XP_HISTORY[index - 1].xp : 0;
                            const growth = entry.xp - prevXP;
                            return (
                              <tr key={entry.month}>
                                <td>{entry.month}</td>
                                <td className="font-semibold">{entry.xp}</td>
                                <td>
                                  <span className="badge badge-primary badge-sm">{entry.level}</span>
                                </td>
                                <td>
                                  <span className="text-success">
                                    <ArrowUp className="h-3 w-3 inline" /> +{growth}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-content rounded-full p-3">
                          <Eye className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{STATS_OVERVIEW.totalViews}</div>
                          <div className="text-sm text-base-content/70">Total Views</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary text-secondary-content rounded-full p-3">
                          <ThumbsUp className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{STATS_OVERVIEW.totalUpvotes}</div>
                          <div className="text-sm text-base-content/70">Upvotes Received</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent text-accent-content rounded-full p-3">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">89%</div>
                          <div className="text-sm text-base-content/70">Approval Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Heatmap */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Calendar className="h-5 w-5 text-primary" />
                      Weekly Activity
                    </h2>
                    <div className="grid grid-cols-7 gap-2">
                      {ACTIVITY_HEATMAP.map((day) => (
                        <div key={day.day} className="text-center">
                          <div className="text-xs mb-2">{day.day}</div>
                          <div
                            className="aspect-square rounded flex items-center justify-center text-sm font-bold"
                            style={{
                              backgroundColor: `hsl(${140 + day.count * 10}, 70%, ${90 - day.count * 5}%)`,
                            }}
                          >
                            {day.count}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-base-content/70">
                      <span>Less active</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
                          <div
                            key={level}
                            className="w-4 h-4 rounded"
                            style={{
                              backgroundColor: `hsl(${140 + level * 10}, 70%, ${90 - level * 5}%)`,
                            }}
                          ></div>
                        ))}
                      </div>
                      <span>More active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contributions Tab */}
            {activeCategory === "contributions" && (
              <div className="space-y-6">
                {/* Contribution Breakdown */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Target className="h-5 w-5 text-primary" />
                      Contribution Breakdown
                    </h2>
                    <div className="space-y-4">
                      {CONTRIBUTION_STATS.map((stat) => (
                        <div key={stat.type}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{stat.type}</span>
                            <span className="text-sm text-base-content/70">
                              {stat.count} ({stat.percentage}%)
                            </span>
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={stat.percentage}
                            max="100"
                          ></progress>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Contributions */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Performance
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>This Week</th>
                            <th>Last Week</th>
                            <th>Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Contributions Made</td>
                            <td className="font-semibold">5</td>
                            <td>3</td>
                            <td>
                              <span className="text-success">
                                <ArrowUp className="h-3 w-3 inline" /> +67%
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>XP Earned</td>
                            <td className="font-semibold">85</td>
                            <td>50</td>
                            <td>
                              <span className="text-success">
                                <ArrowUp className="h-3 w-3 inline" /> +70%
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Credits Earned</td>
                            <td className="font-semibold">15</td>
                            <td>10</td>
                            <td>
                              <span className="text-success">
                                <ArrowUp className="h-3 w-3 inline" /> +50%
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Approval Rate</td>
                            <td className="font-semibold">100%</td>
                            <td>67%</td>
                            <td>
                              <span className="text-success">
                                <ArrowUp className="h-3 w-3 inline" /> +33%
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Top Contributed Vehicles */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Users className="h-5 w-5 text-primary" />
                      Most Contributed Vehicles
                    </h2>
                    <div className="space-y-3">
                      {[
                        { name: "Tesla Model 3", contributions: 8 },
                        { name: "Hyundai Ioniq 6", contributions: 5 },
                        { name: "Rivian R1T", contributions: 4 },
                        { name: "Ford Mustang Mach-E", contributions: 3 },
                        { name: "BMW iX", contributions: 3 },
                      ].map((vehicle, index) => (
                        <div key={vehicle.name} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-base-content/50">#{index + 1}</div>
                            <div className="font-semibold">{vehicle.name}</div>
                          </div>
                          <div className="badge badge-primary">{vehicle.contributions} contributions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeCategory === "achievements" && (
              <div className="space-y-6">
                {/* Recent Achievements */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Award className="h-5 w-5 text-primary" />
                      Recently Unlocked
                    </h2>
                    <div className="space-y-4">
                      {RECENT_ACHIEVEMENTS.map((achievement) => (
                        <div key={achievement.id} className="card bg-base-200">
                          <div className="card-body p-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-warning text-warning-content rounded-full p-3">
                                <Award className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold">{achievement.name}</h3>
                                <p className="text-sm text-base-content/70">{achievement.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-base-content/70">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {achievement.earnedAt}
                                  </span>
                                  <span className="badge badge-success badge-sm">
                                    <Zap className="h-3 w-3 mr-1" />
                                    +{achievement.xpReward} XP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href="/achievements" className="btn btn-ghost btn-block mt-4">
                      View All Achievements
                    </a>
                  </div>
                </div>

                {/* Achievement Progress */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Target className="h-5 w-5 text-primary" />
                      In Progress
                    </h2>
                    <div className="space-y-4">
                      {[
                        { name: "Centurion", description: "Make 100 contributions", progress: 47, target: 100 },
                        { name: "Level Master", description: "Reach level 10", progress: 5, target: 10 },
                        { name: "Perfect Score", description: "Maintain 100% approval rate", progress: 89, target: 100 },
                      ].map((achievement) => (
                        <div key={achievement.name} className="p-4 bg-base-200 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-xs text-base-content/70">{achievement.description}</p>
                            </div>
                            <span className="text-sm font-bold">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <progress
                            className="progress progress-secondary w-full"
                            value={achievement.progress}
                            max={achievement.target}
                          ></progress>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeCategory === "progress" && (
              <div className="space-y-6">
                {/* Milestones */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Trophy className="h-5 w-5 text-primary" />
                      Milestones
                    </h2>
                    <div className="space-y-3">
                      {MILESTONES.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            milestone.achieved ? "bg-success/10" : "bg-base-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-2 ${
                                milestone.achieved ? "bg-success text-success-content" : "bg-base-300"
                              }`}
                            >
                              {milestone.achieved ? (
                                <Award className="h-5 w-5" />
                              ) : (
                                <Target className="h-5 w-5 text-base-content/50" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{milestone.name}</h4>
                              {milestone.achieved ? (
                                <span className="text-xs text-base-content/70">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {milestone.date}
                                </span>
                              ) : (
                                <span className="text-xs text-base-content/70">
                                  {milestone.progress} / {milestone.target}
                                </span>
                              )}
                            </div>
                          </div>
                          {milestone.achieved ? (
                            <span className="badge badge-success">Achieved</span>
                          ) : (
                            <span className="badge badge-ghost">
                              {Math.round((milestone.progress / milestone.target) * 100)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Level Progression
                    </h2>
                    <div className="space-y-4">
                      {[
                        { level: 1, xpRange: "0-200", achieved: true, date: "Aug 2023" },
                        { level: 2, xpRange: "200-500", achieved: true, date: "Sep 2023" },
                        { level: 3, xpRange: "500-900", achieved: true, date: "Oct 2023" },
                        { level: 4, xpRange: "900-1300", achieved: true, date: "Nov 2023" },
                        { level: 5, xpRange: "1300-2000", achieved: true, date: "Dec 2023" },
                        { level: 6, xpRange: "2000-3000", achieved: false },
                        { level: 7, xpRange: "3000-4500", achieved: false },
                        { level: 8, xpRange: "4500-6500", achieved: false },
                        { level: 9, xpRange: "6500-9000", achieved: false },
                        { level: 10, xpRange: "9000+", achieved: false },
                      ].map((levelInfo) => (
                        <div
                          key={levelInfo.level}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            levelInfo.achieved ? "bg-primary/10" : "bg-base-200 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold">Level {levelInfo.level}</div>
                            <div className="text-sm text-base-content/70">{levelInfo.xpRange} XP</div>
                          </div>
                          {levelInfo.achieved ? (
                            <span className="badge badge-primary">{levelInfo.date}</span>
                          ) : (
                            <span className="badge badge-ghost">Locked</span>
                          )}
                        </div>
                      ))}
                    </div>
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
