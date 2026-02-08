"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Key,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Calendar,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "api">("profile");

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    location: "",
    website: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsletter: true,
    contributionUpdates: true,
    achievementAlerts: true,
    creditLowAlert: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement profile update API call
    setTimeout(() => {
      setLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    // TODO: Implement password update API call
    setTimeout(() => {
      setLoading(false);
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

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

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <User className="inline-block h-10 w-10 mr-2 text-primary" />
              My Profile
            </h1>
            <p className="text-lg text-base-content/70">
              Manage your account settings, preferences, and security.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-24 h-24">
                      <span className="text-3xl">
                        {profileData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-3">{profileData.name}</h3>
                  <p className="text-sm text-base-content/70">{profileData.email}</p>
                  <div className="badge badge-primary badge-sm mt-2">
                    {session?.user?.role || "MEMBER"}
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-1">
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "profile" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "security" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "notifications" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "api" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("api")}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    API Keys
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Profile Picture</span>
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-20 h-20">
                            <span className="text-2xl">
                              {profileData.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button className="btn btn-ghost">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Display Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email Address</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                          <input
                            type="email"
                            className="input input-bordered pl-10"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Location</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                          <input
                            type="text"
                            className="input input-bordered pl-10"
                            placeholder="City, Country"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Website</span>
                        </label>
                        <input
                          type="url"
                          className="input input-bordered"
                          placeholder="https://yourwebsite.com"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Bio</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      ></textarea>
                      <label className="label">
                        <span className="label-text-alt">Max 500 characters</span>
                      </label>
                    </div>

                    <div className="card-actions justify-end">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </h2>

                  {/* Change Password */}
                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Current Password</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                          <input
                            type="password"
                            className="input input-bordered pl-10"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">New Password</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                          <input
                            type={showPassword ? "text" : "password"}
                            className="input input-bordered pl-10 pr-10"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-base-content/50" />
                            ) : (
                              <Eye className="h-5 w-5 text-base-content/50" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Confirm New Password</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                          <input
                            type="password"
                            className="input input-bordered pl-10"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? <span className="loading loading-spinner"></span> : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Account Information */}
                  <div className="border-t border-base-300 pt-6">
                    <h3 className="font-bold text-lg mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Member Since</span>
                        <span className="font-semibold">
                          {session?.user ? "Feb 2024" : "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Account Type</span>
                        <span className="badge badge-primary">{session?.user?.role || "MEMBER"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Account Status</span>
                        <span className="badge badge-success">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-base-300 pt-6 mt-6">
                    <h3 className="font-bold text-lg mb-4 text-error">Danger Zone</h3>
                    <div className="alert alert-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-bold">Delete Account</h4>
                        <p className="text-xs">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-error mt-4">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Email Notifications</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Receive email notifications about your account activity
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Push Notifications</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushNotifications: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Receive push notifications in your browser
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Newsletter</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.newsletter}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              newsletter: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Receive weekly newsletter with updates and tips
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Contribution Updates</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.contributionUpdates}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              contributionUpdates: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Get notified when your contributions are reviewed
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Achievement Alerts</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.achievementAlerts}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              achievementAlerts: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Celebrate when you unlock new achievements
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-semibold">Low Credit Alert</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notificationSettings.creditLowAlert}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              creditLowAlert: e.target.checked,
                            })
                          }
                        />
                      </label>
                      <label className="label">
                        <span className="label-text-alt">
                          Get alerted when your credits are running low
                        </span>
                      </label>
                    </div>

                    <div className="card-actions justify-end pt-4 border-t border-base-300">
                      <button className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : "Save Preferences"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Key className="h-5 w-5 text-primary" />
                    API Keys
                  </h2>

                  <div className="alert alert-info mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold">API Access</h4>
                      <p className="text-sm">
                        Use your API key to access the EV Hub API. Keep it secret and never share it publicly.
                      </p>
                    </div>
                  </div>

                  {/* Existing API Keys */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-4">Your API Keys</h3>
                    <div className="space-y-3">
                      <div className="card bg-base-200">
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">Production Key</h4>
                              <code className="text-sm bg-base-300 px-2 py-1 rounded">
                                pk_ev_hub_********************
                              </code>
                              <div className="text-xs text-base-content/70 mt-1">
                                Created: Feb 1, 2024 • Last used: 2 hours ago
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="btn btn-ghost btn-sm">Reveal</button>
                              <button className="btn btn-error btn-sm">Revoke</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">Test Key</h4>
                              <code className="text-sm bg-base-300 px-2 py-1 rounded">
                                pk_test_ev_hub_********************
                              </code>
                              <div className="text-xs text-base-content/70 mt-1">
                                Created: Jan 15, 2024 • Last used: 1 day ago
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="btn btn-ghost btn-sm">Reveal</button>
                              <button className="btn btn-error btn-sm">Revoke</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Create New API Key */}
                  <div className="border-t border-base-300 pt-6">
                    <h3 className="font-bold text-lg mb-4">Create New API Key</h3>
                    <div className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Key Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="e.g., Development Key"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tier</span>
                        </label>
                        <select className="select select-bordered">
                          <option value="free">Free (100 calls/day)</option>
                          <option value="basic">Basic (5,000 calls/day)</option>
                          <option value="pro">Pro (100,000 calls/day)</option>
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Expiration</span>
                        </label>
                        <select className="select select-bordered">
                          <option value="never">Never</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>
                      <button className="btn btn-primary">Generate API Key</button>
                    </div>
                  </div>

                  {/* API Documentation Link */}
                  <div className="border-t border-base-300 pt-6 mt-6">
                    <div className="alert alert-success">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <h4 className="font-bold">Need Help?</h4>
                        <p className="text-sm">
                          Check out our{" "}
                          <a href="/docs/api" className="link link-primary">
                            API Documentation
                          </a>{" "}
                          for integration guides and examples.
                        </p>
                      </div>
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
