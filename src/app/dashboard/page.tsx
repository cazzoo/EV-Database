"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserStats from "@/components/gamification/UserStats";
import Achievements from "@/components/gamification/Achievements";
import {
  Car,
  Zap,
  Trophy,
  Settings,
  CreditCard,
  History,
  Bell,
  User,
  BarChart3,
  FileText,
  Award,
  Activity,
} from "lucide-react";

// Mock data for demonstration
const USER_STATS = {
  username: "EVEnthusiast",
  xp: 1560,
  credits: 245,
  contributions: 47,
};

const USER_ACHIEVEMENTS = [
  { id: "first_edit", unlockedAt: new Date() },
  { id: "data_master", unlockedAt: new Date() },
  { id: "quality_contributor", unlockedAt: new Date() },
  { id: "streak_week", unlockedAt: new Date() },
];

const RECENT_CONTRIBUTIONS = [
  {
    id: 1,
    type: "add_vehicle",
    title: "2024 Tesla Model 3 Long Range",
    date: "2 hours ago",
    status: "approved",
    xp: 25,
    credits: 5,
  },
  {
    id: 2,
    type: "edit_specs",
    title: "Updated Hyundai Ioniq 6 range",
    date: "1 day ago",
    status: "approved",
    xp: 10,
    credits: 2,
  },
  {
    id: 3,
    type: "add_image",
    title: "Added Rivian R1T photos",
    date: "2 days ago",
    status: "approved",
    xp: 15,
    credits: 3,
  },
  {
    id: 4,
    type: "write_review",
    title: "Tesla Model Y performance review",
    date: "3 days ago",
    status: "pending",
    xp: 0,
    credits: 0,
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "contributions" | "achievements" | "settings"
  >("overview");

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  <button
                    className={`btn btn-block ${
                      activeTab === "overview" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Overview
                  </button>
                  <a
                    href="/contributions/history"
                    className={`btn btn-block justify-start ${
                      activeTab === "contributions" ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Contributions
                  </a>
                  <a
                    href="/rewards"
                    className={`btn btn-block justify-start ${
                      activeTab === "achievements" ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Rewards
                  </a>
                  <a
                    href="/stats"
                    className="btn btn-block justify-start btn-ghost"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistics
                  </a>
                  <a
                    href="/billing"
                    className="btn btn-block justify-start btn-ghost"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </a>
                  <a
                    href="/api-usage"
                    className="btn btn-block justify-start btn-ghost"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    API Usage
                  </a>
                  <a
                    href="/profile"
                    className="btn btn-block justify-start btn-ghost"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </a>
                  <button
                    className={`btn btn-block ${
                      activeTab === "settings" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Quick Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-lg mt-6">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <a href="/contribute" className="btn btn-primary btn-block">
                    Contribute
                  </a>
                  <a href="/stats" className="btn btn-ghost btn-block">
                    View Statistics
                  </a>
                  <a href="/billing" className="btn btn-ghost btn-block">
                    Buy Credits
                  </a>
                  <a href="/api-usage" className="btn btn-ghost btn-block">
                    API Usage
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <UserStats
                  username={USER_STATS.username}
                  xp={USER_STATS.xp}
                  credits={USER_STATS.credits}
                  contributions={USER_STATS.contributions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="font-bold text-lg mb-4">
                        <History className="h-5 w-5 text-primary inline mr-2" />
                        Recent Contributions
                      </h3>
                      <div className="space-y-4">
                        {RECENT_CONTRIBUTIONS.map((contribution) => (
                          <div key={contribution.id} className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                <span className="text-xs">
                                  {contribution.title.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {contribution.title}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-base-content/70">
                                <span className="text-xs">{contribution.date}</span>
                                <span className={`badge badge-xs ${
                                  contribution.status === "approved"
                                    ? "badge-success"
                                    : "badge-warning"
                                }`}>
                                  {contribution.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm text-primary">
                                +{contribution.xp} XP
                              </div>
                              <div className="font-bold text-xs text-secondary">
                                +{contribution.credits}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <a
                        href="/contributions/history"
                        className="btn btn-ghost btn-sm btn-block mt-4"
                      >
                        View All Contributions
                      </a>
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
                          {USER_STATS.credits}
                        </div>
                        <div className="text-sm text-base-content/70 mt-2">
                          credits available
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="btn btn-sm btn-primary">
                          Buy More Credits
                        </button>
                        <button className="btn btn-sm btn-ghost">
                          View Transaction History
                        </button>
                      </div>
                      <div className="divider"></div>
                      <div className="text-sm text-base-content/70">
                        <p>
                          <Bell className="h-4 w-4 inline mr-1" />
                          You earned 5 credits for your recent Tesla Model 3 contribution
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "achievements" && (
              <Achievements userAchievements={USER_ACHIEVEMENTS} />
            )}

            {activeTab === "contributions" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="font-bold text-lg mb-4">
                    <History className="h-5 w-5 text-primary inline mr-2" />
                    All Contributions
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Details</th>
                          <th>Status</th>
                          <th>Rewards</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_CONTRIBUTIONS.map((contribution) => (
                          <tr key={contribution.id}>
                            <td className="text-sm text-base-content/70">
                              {contribution.date}
                            </td>
                            <td className="text-sm">
                              <span className="badge badge-primary badge-sm">
                                {contribution.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="text-sm">{contribution.title}</td>
                            <td>
                              <span className={`badge ${
                                contribution.status === "approved"
                                  ? "badge-success"
                                  : "badge-warning"
                              } badge-sm`}>
                                {contribution.status}
                              </span>
                            </td>
                            <td className="text-sm">
                              <span className="text-primary font-bold">
                                +{contribution.xp} XP
                              </span>{" "}
                              <span className="text-secondary font-bold">
                                +{contribution.credits}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="font-bold text-lg mb-4">
                    <Settings className="h-5 w-5 text-primary inline mr-2" />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Username</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="input input-bordered"
                          defaultValue="EVEnthusiast"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Email"
                          className="input input-bordered"
                          defaultValue="ev.enthusiast@example.com"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          className="input input-bordered"
                          defaultValue="••••••••"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">API Key</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered flex-1"
                            defaultValue="pk_ev_hub_1234567890abcdef"
                            readOnly
                          />
                          <button className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Email Notifications</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle toggle-primary"
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Push Notifications</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Newsletter</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle toggle-primary"
                        />
                      </label>
                    </div>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Save Changes</button>
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
