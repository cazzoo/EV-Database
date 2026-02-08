"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Award,
  Zap,
  Calendar,
  Star,
  Target,
  TrendingUp,
  Lock,
  Unlock,
  Gift,
  Sparkles,
  Crown,
  Medal,
  Gem,
  Flame,
  Bolt,
  CheckCircle,
} from "lucide-react";

// Mock achievement data
const ACHIEVEMENTS = [
  {
    id: "first_contribution",
    name: "Getting Started",
    description: "Make your first contribution to the EV database",
    icon: "🚀",
    rarity: "common",
    xpReward: 10,
    creditsReward: 5,
    unlockedAt: "2023-08-15T10:30:00Z",
    progress: 1,
    target: 1,
  },
  {
    id: "data_collector",
    name: "Data Collector",
    description: "Add 10 vehicles to the database",
    icon: "📊",
    rarity: "uncommon",
    xpReward: 50,
    creditsReward: 20,
    unlockedAt: "2023-09-20T14:20:00Z",
    progress: 10,
    target: 10,
  },
  {
    id: "detail_oriented",
    name: "Detail Oriented",
    description: "Make 25 spec updates across different vehicles",
    icon: "🔍",
    rarity: "uncommon",
    xpReward: 40,
    creditsReward: 15,
    unlockedAt: "2023-10-05T09:15:00Z",
    progress: 25,
    target: 25,
  },
  {
    id: "photographer",
    name: "EV Photographer",
    description: "Add 50 high-quality images to vehicle pages",
    icon: "📸",
    rarity: "rare",
    xpReward: 100,
    creditsReward: 40,
    unlockedAt: "2023-11-12T16:45:00Z",
    progress: 50,
    target: 50,
  },
  {
    id: "reviewer",
    name: "Community Voice",
    description: "Write 10 helpful vehicle reviews",
    icon: "✍️",
    rarity: "uncommon",
    xpReward: 60,
    creditsReward: 25,
    unlockedAt: "2023-12-01T11:00:00Z",
    progress: 10,
    target: 10,
  },
  {
    id: "quality_master",
    name: "Quality Master",
    description: "Maintain 95% approval rate over 50 contributions",
    icon: "⭐",
    rarity: "rare",
    xpReward: 150,
    creditsReward: 50,
    unlockedAt: "2024-01-10T13:30:00Z",
    progress: 50,
    target: 50,
  },
  {
    id: "streak_week",
    name: "Week Warrior",
    description: "Contribute for 7 consecutive days",
    icon: "🔥",
    rarity: "uncommon",
    xpReward: 35,
    creditsReward: 15,
    unlockedAt: "2024-01-15T08:00:00Z",
    progress: 7,
    target: 7,
  },
  {
    id: "streak_month",
    name: "Monthly Momentum",
    description: "Contribute for 30 consecutive days",
    icon: "📅",
    rarity: "rare",
    xpReward: 200,
    creditsReward: 75,
    unlockedAt: null,
    progress: 18,
    target: 30,
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Make 100 approved contributions",
    icon: "💯",
    rarity: "epic",
    xpReward: 500,
    creditsReward: 200,
    unlockedAt: null,
    progress: 47,
    target: 100,
  },
  {
    id: "legendary",
    name: "EV Legend",
    description: "Reach level 20",
    icon: "👑",
    rarity: "legendary",
    xpReward: 1000,
    creditsReward: 500,
    unlockedAt: null,
    progress: 5,
    target: 20,
  },
  {
    id: "helper",
    name: "Helpful Hand",
    description: "Have 50 of your contributions receive upvotes",
    icon: "🤝",
    rarity: "uncommon",
    xpReward: 75,
    creditsReward: 30,
    unlockedAt: null,
    progress: 32,
    target: 50,
  },
  {
    id: "spotlight",
    name: "In the Spotlight",
    description: "Reach the top 10 on the leaderboard",
    icon: "🌟",
    rarity: "rare",
    xpReward: 300,
    creditsReward: 100,
    unlockedAt: null,
    progress: 12,
    target: 10,
  },
];

// Mock reward history (XP and credits earned from various sources)
const REWARD_HISTORY = [
  {
    id: "R-2024-001",
    type: "achievement",
    title: "Achievement Unlocked: Week Warrior",
    description: "7 days contribution streak",
    xpEarned: 35,
    creditsEarned: 15,
    earnedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "R-2024-002",
    type: "contribution",
    title: "Contribution Approved: Tesla Model 3",
    description: "Added vehicle specifications",
    xpEarned: 25,
    creditsEarned: 5,
    earnedAt: "2024-02-05T14:30:00Z",
  },
  {
    id: "R-2024-003",
    type: "contribution",
    title: "Contribution Approved: Hyundai Ioniq 6",
    description: "Updated range specifications",
    xpEarned: 10,
    creditsEarned: 2,
    earnedAt: "2024-02-03T10:15:00Z",
  },
  {
    id: "R-2024-004",
    type: "bonus",
    title: "Streak Bonus",
    description: "Bonus for 5-day contribution streak",
    xpEarned: 20,
    creditsEarned: 10,
    earnedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "R-2024-005",
    type: "achievement",
    title: "Achievement Unlocked: Quality Master",
    description: "Maintained 95% approval rate",
    xpEarned: 150,
    creditsEarned: 50,
    earnedAt: "2024-01-10T13:30:00Z",
  },
  {
    id: "R-2024-006",
    type: "contribution",
    title: "Contribution Approved: Rivian R1T",
    description: "Added gallery images",
    xpEarned: 15,
    creditsEarned: 3,
    earnedAt: "2024-02-01T09:00:00Z",
  },
  {
    id: "R-2024-007",
    type: "level_up",
    title: "Level Up Bonus",
    description: "Reached Level 5",
    xpEarned: 100,
    creditsEarned: 50,
    earnedAt: "2024-01-05T16:00:00Z",
  },
];

type RewardFilter = "all" | "achievement" | "contribution" | "bonus" | "level_up";
type AchievementFilter = "all" | "unlocked" | "locked" | "in_progress";

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"achievements" | "history">("achievements");
  const [achievementFilter, setAchievementFilter] = useState<AchievementFilter>("all");
  const [rewardFilter, setRewardFilter] = useState<RewardFilter>("all");

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

  const getRarityConfig = (rarity: string) => {
    const configs = {
      common: { color: "base-content", bg: "bg-base-300", label: "Common" },
      uncommon: { color: "text-success", bg: "bg-success/10", label: "Uncommon" },
      rare: { color: "text-primary", bg: "bg-primary/10", label: "Rare" },
      epic: { color: "text-purple-500", bg: "bg-purple-500/10", label: "Epic" },
      legendary: { color: "text-warning", bg: "bg-warning/10", label: "Legendary" },
    };
    return configs[rarity as keyof typeof configs] || configs.common;
  };

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (achievementFilter === "unlocked") return achievement.unlockedAt !== null;
    if (achievementFilter === "locked") return achievement.unlockedAt === null && achievement.progress === 0;
    if (achievementFilter === "in_progress") return achievement.unlockedAt === null && achievement.progress > 0;
    return true;
  });

  const filteredRewardHistory = REWARD_HISTORY.filter((reward) => {
    if (rewardFilter === "all") return true;
    return reward.type === rewardFilter;
  });

  const stats = {
    totalAchievements: ACHIEVEMENTS.length,
    unlockedAchievements: ACHIEVEMENTS.filter(a => a.unlockedAt).length,
    totalXPEarned: ACHIEVEMENTS.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.xpReward, 0),
    totalCreditsEarned: ACHIEVEMENTS.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.creditsReward, 0),
    inProgress: ACHIEVEMENTS.filter(a => !a.unlockedAt && a.progress > 0).length,
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Trophy className="inline-block h-10 w-10 mr-2 text-primary" />
              Rewards & Achievements
            </h1>
            <p className="text-lg text-base-content/70">
              Celebrate your accomplishments and track your earned rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="stat-title">Achievements</div>
            <div className="stat-value text-2xl">
              {stats.unlockedAchievements}/{stats.totalAchievements}
            </div>
            <div className="stat-desc">Unlocked</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <Target className="h-8 w-8" />
            </div>
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-2xl">{stats.inProgress}</div>
            <div className="stat-desc">Working on</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <Zap className="h-8 w-8" />
            </div>
            <div className="stat-title">Total XP</div>
            <div className="stat-value text-2xl text-accent">{stats.totalXPEarned}</div>
            <div className="stat-desc">From achievements</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success">
              <Gem className="h-8 w-8" />
            </div>
            <div className="stat-title">Credits</div>
            <div className="stat-value text-2xl text-success">{stats.totalCreditsEarned}</div>
            <div className="stat-desc">From achievements</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-warning">
              <Star className="h-8 w-8" />
            </div>
            <div className="stat-title">Completion</div>
            <div className="stat-value text-2xl text-warning">
              {((stats.unlockedAchievements / stats.totalAchievements) * 100).toFixed(0)}%
            </div>
            <div className="stat-desc">All achievements</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="join">
            <button
              className={`join-item btn ${activeTab === "achievements" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("achievements")}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </button>
            <button
              className={`join-item btn ${activeTab === "history" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveTab("history")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Reward History
            </button>
          </div>
        </div>

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            {/* Filters */}
            <div className="flex justify-center mb-6">
              <div className="join">
                {(["all", "unlocked", "in_progress", "locked"] as AchievementFilter[]).map((filter) => (
                  <button
                    key={filter}
                    className={`join-item btn btn-sm ${
                      achievementFilter === filter ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setAchievementFilter(filter)}
                  >
                    {filter === "all" ? "All" : filter === "unlocked" ? "Unlocked" : filter === "in_progress" ? "In Progress" : "Locked"}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => {
                const rarityConfig = getRarityConfig(achievement.rarity);
                const isUnlocked = achievement.unlockedAt !== null;
                const isStarted = achievement.progress > 0;

                return (
                  <div
                    key={achievement.id}
                    className={`card bg-base-100 shadow-lg ${
                      !isUnlocked && !isStarted ? "opacity-50" : ""
                    }`}
                  >
                    <div className="card-body">
                      {/* Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`text-5xl ${!isUnlocked ? "grayscale" : ""}`}>
                          {achievement.icon}
                        </div>
                        {isUnlocked ? (
                          <span className={`badge ${rarityConfig.bg} ${rarityConfig.color} badge-sm`}>
                            {rarityConfig.label}
                          </span>
                        ) : isStarted ? (
                          <span className="badge badge-info badge-sm">In Progress</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Locked</span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="card-title text-lg">{achievement.name}</h3>
                      <p className="text-sm text-base-content/70 mb-4">
                        {achievement.description}
                      </p>

                      {/* Progress */}
                      {!isUnlocked && (
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs">Progress</span>
                            <span className="text-xs font-semibold">
                              {achievement.progress} / {achievement.target}
                            </span>
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={achievement.progress}
                            max={achievement.target}
                          ></progress>
                        </div>
                      )}

                      {/* Rewards */}
                      <div className="flex gap-2 mb-4">
                        <span className="badge badge-primary badge-sm">
                          <Zap className="h-3 w-3 mr-1" />
                          +{achievement.xpReward} XP
                        </span>
                        <span className="badge badge-secondary badge-sm">
                          <Gem className="h-3 w-3 mr-1" />
                          +{achievement.creditsReward}
                        </span>
                      </div>

                      {/* Unlocked Date */}
                      {isUnlocked && (
                        <div className="text-xs text-base-content/70">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Unlocked on {new Date(achievement.unlockedAt!).toLocaleDateString()}
                        </div>
                      )}

                      {/* Lock Icon */}
                      {!isStarted && (
                        <div className="text-xs text-base-content/50 mt-2">
                          <Lock className="h-3 w-3 inline mr-1" />
                          Start contributing to unlock
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/70">No achievements found matching your filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Reward History Tab */}
        {activeTab === "history" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <select
                  className="select select-bordered select-sm"
                  value={rewardFilter}
                  onChange={(e) => setRewardFilter(e.target.value as RewardFilter)}
                >
                  <option value="all">All Types</option>
                  <option value="achievement">Achievements</option>
                  <option value="contribution">Contributions</option>
                  <option value="bonus">Bonuses</option>
                  <option value="level_up">Level Ups</option>
                </select>
              </div>

              {/* Reward History List */}
              <div className="space-y-3">
                {filteredRewardHistory.map((reward) => {
                  const getIcon = () => {
                    switch (reward.type) {
                      case "achievement":
                        return <Award className="h-5 w-5 text-warning" />;
                      case "contribution":
                        return <Target className="h-5 w-5 text-primary" />;
                      case "bonus":
                        return <Gift className="h-5 w-5 text-success" />;
                      case "level_up":
                        return <TrendingUp className="h-5 w-5 text-purple-500" />;
                      default:
                        return <Sparkles className="h-5 w-5" />;
                    }
                  };

                  return (
                    <div key={reward.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-base-300">
                          {getIcon()}
                        </div>
                        <div>
                          <div className="font-semibold">{reward.title}</div>
                          <div className="text-sm text-base-content/70">{reward.description}</div>
                          <div className="text-xs text-base-content/50 mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(reward.earnedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-2">
                          {reward.xpEarned > 0 && (
                            <span className="badge badge-primary">
                              <Zap className="h-3 w-3 mr-1" />
                              +{reward.xpEarned} XP
                            </span>
                          )}
                          {reward.creditsEarned > 0 && (
                            <span className="badge badge-secondary">
                              <Gem className="h-3 w-3 mr-1" />
                              +{reward.creditsEarned}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredRewardHistory.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                  <p className="text-base-content/70">No rewards found matching your filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
