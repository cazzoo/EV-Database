"use client";

import { useState } from "react";
import Leaderboard from "@/components/gamification/Leaderboard";

// Mock data for demonstration
const WEEKLY_ENTRIES = [
  { rank: 1, username: "EVEnthusiast", xp: 2450, contributions: 89 },
  { rank: 2, username: "TeslaFan42", xp: 2100, contributions: 76 },
  { rank: 3, username: "GreenMachine", xp: 1890, contributions: 68 },
  { rank: 4, username: "ChargeMaster", xp: 1650, contributions: 55 },
  { rank: 5, username: "ElectronX", xp: 1420, contributions: 48 },
  { rank: 6, username: "BoltDuo", xp: 1280, contributions: 42 },
  { rank: 7, username: "FutureDrive", xp: 1150, contributions: 38 },
  { rank: 8, username: "EcoWarrior", xp: 980, contributions: 31 },
  { rank: 9, username: "VoltAge", xp: 870, contributions: 28 },
  { rank: 10, username: "Ampere", xp: 760, contributions: 24 },
];

const MONTHLY_ENTRIES = [
  { rank: 1, username: "EVEnthusiast", xp: 12450, contributions: 389 },
  { rank: 2, username: "TeslaFan42", xp: 10800, contributions: 356 },
  { rank: 3, username: "GreenMachine", xp: 9450, contributions: 298 },
  { rank: 4, username: "ChargeMaster", xp: 8250, contributions: 255 },
  { rank: 5, username: "ElectronX", xp: 7120, contributions: 218 },
  { rank: 6, username: "BoltDuo", xp: 6480, contributions: 192 },
  { rank: 7, username: "FutureDrive", xp: 5750, contributions: 168 },
  { rank: 8, username: "EcoWarrior", xp: 4980, contributions: 141 },
  { rank: 9, username: "VoltAge", xp: 4370, contributions: 128 },
  { rank: 10, username: "Ampere", xp: 3860, contributions: 114 },
];

const ALL_TIME_ENTRIES = [
  { rank: 1, username: "EVKing", xp: 156800, contributions: 5234 },
  { rank: 2, username: "DataMaster", xp: 142300, contributions: 4891 },
  { rank: 3, username: "EVEnthusiast", xp: 128450, contributions: 4234 },
  { rank: 4, username: "CommunityHero", xp: 112000, contributions: 3890 },
  { rank: 5, username: "TeslaFan42", xp: 98500, contributions: 3256 },
  { rank: 6, username: "GreenMachine", xp: 87200, contributions: 2890 },
  { rank: 7, username: "ChargeMaster", xp: 76500, contributions: 2534 },
  { rank: 8, username: "ElectronX", xp: 67800, contributions: 2218 },
  { rank: 9, username: "BoltDuo", xp: 59400, contributions: 1952 },
  { rank: 10, username: "FutureDrive", xp: 52100, contributions: 1708 },
];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "allTime">(
    "monthly"
  );

  const entries =
    timeframe === "weekly"
      ? WEEKLY_ENTRIES
      : timeframe === "monthly"
      ? MONTHLY_ENTRIES
      : ALL_TIME_ENTRIES;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-4xl">🏆</span> Leaderboard
            </h1>
            <p className="text-lg text-base-content/70">
              See who's making the biggest contributions to our community. 
              Compete for top spots and earn exclusive rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Timeframe Selection */}
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${timeframe === "weekly" ? "tab-active" : ""}`}
              onClick={() => setTimeframe("weekly")}
            >
              This Week
            </button>
            <button
              className={`tab ${timeframe === "monthly" ? "tab-active" : ""}`}
              onClick={() => setTimeframe("monthly")}
            >
              This Month
            </button>
            <button
              className={`tab ${timeframe === "allTime" ? "tab-active" : ""}`}
              onClick={() => setTimeframe("allTime")}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            <Leaderboard
              entries={entries}
              title={
                timeframe === "weekly"
                  ? "Weekly Top Contributors"
                  : timeframe === "monthly"
                  ? "Monthly Champions"
                  : "All-Time Legends"
              }
              timeframe={
                timeframe === "weekly"
                  ? "Last 7 days"
                  : timeframe === "monthly"
                  ? "Last 30 days"
                  : "All time"
              }
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg">Your Position</h3>
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-primary">#47</div>
                  <div className="text-base-content/70 mt-2">out of 1,234 contributors</div>
                </div>
                <div className="divider"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Your XP</span>
                    <span className="font-bold">2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Your Contributions</span>
                    <span className="font-bold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">XP to #46</span>
                    <span className="font-bold text-secondary">150</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <a href="/dashboard" className="btn btn-primary btn-sm w-full">
                    View Dashboard
                  </a>
                </div>
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">🏆 Top 3 This Month</h3>
                <div className="flex justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="avatar placeholder mb-2">
                      <div className="bg-gray-300 text-gray-800 rounded-full w-12 h-12">
                        <span className="text-lg">
                          {MONTHLY_ENTRIES[1].username.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl">🥈</div>
                    <div className="font-semibold text-sm">TeslaFan42</div>
                    <div className="text-xs text-base-content/70">
                      {MONTHLY_ENTRIES[1].xp.toLocaleString()} XP
                    </div>
                  </div>
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="avatar placeholder mb-2">
                      <div className="bg-yellow-400 text-yellow-900 rounded-full w-16 h-16">
                        <span className="text-xl">
                          {MONTHLY_ENTRIES[0].username.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl">🥇</div>
                    <div className="font-bold text-primary">EVEnthusiast</div>
                    <div className="text-xs text-base-content/70">
                      {MONTHLY_ENTRIES[0].xp.toLocaleString()} XP
                    </div>
                  </div>
                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="avatar placeholder mb-2">
                      <div className="bg-orange-300 text-orange-900 rounded-full w-12 h-12">
                        <span className="text-lg">
                          {MONTHLY_ENTRIES[2].username.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl">🥉</div>
                    <div className="font-semibold text-sm">GreenMachine</div>
                    <div className="text-xs text-base-content/70">
                      {MONTHLY_ENTRIES[2].xp.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Info */}
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
