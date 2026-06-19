"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Key,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { formatMonthYear, formatDate, timeAgo } from "@/lib/format";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  role: string;
  createdAt: string;
}

interface ApiKey {
  id: string;
  key: string;
  name: string;
  tier: string;
  rateLimit: number;
  lastUsedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

const DEFAULT_NOTIFICATIONS = {
  emailNotifications: true,
  pushNotifications: false,
  newsletter: true,
  contributionUpdates: true,
  achievementAlerts: true,
  creditLowAlert: true,
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "api">("profile");

  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTier, setNewKeyTier] = useState("FREE");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!session?.user?.id) return;
    const id = session.user.id;
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setProfileData(json.data);
      });
    fetch(`/api/users/${id}/notifications`)
      .then((r) => r.json())
      .then((json) => json.data && setNotificationSettings(json.data));
    loadApiKeys(id);
  }, [session?.user?.id, status, router]);

  const loadApiKeys = (id: string) => {
    fetch(`/api/users/${id}/api-keys`)
      .then((r) => r.json())
      .then((json) => setApiKeys(json.data || []));
  };

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !profileData) return;
    setLoading(true);
    const res = await fetch(`/api/users/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profileData.name,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
      }),
    });
    setLoading(false);
    if (res.ok) {
      flash("success", "Profile updated successfully!");
    } else {
      const json = await res.json().catch(() => ({}));
      flash("error", json.error || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      flash("error", "Passwords do not match!");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/users/${session.user.id}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });
    setLoading(false);
    if (res.ok) {
      flash("success", "Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const json = await res.json().catch(() => ({}));
      flash("error", json.error || "Failed to update password");
    }
  };

  const handleNotificationSave = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const res = await fetch(`/api/users/${session.user.id}/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notificationSettings),
    });
    setLoading(false);
    flash(res.ok ? "success" : "error", res.ok ? "Preferences saved!" : "Failed to save preferences");
  };

  const handleCreateKey = async () => {
    if (!session?.user?.id || !newKeyName) return;
    setLoading(true);
    const res = await fetch(`/api/users/${session.user.id}/api-keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newKeyName,
        tier: newKeyTier,
        expiresInDays: newKeyExpiry ? Number(newKeyExpiry) : null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const json = await res.json();
      setGeneratedKey(json.data.key);
      setNewKeyName("");
      loadApiKeys(session.user.id);
      flash("success", "API key created. Copy it now — it won't be shown again.");
    } else {
      flash("error", "Failed to create API key");
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!session?.user?.id) return;
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    const res = await fetch(`/api/users/${session.user.id}/api-keys/${keyId}`, { method: "DELETE" });
    if (res.ok) {
      loadApiKeys(session.user.id);
      flash("success", "API key revoked.");
    }
  };

  const handleRevealKey = async (keyId: string) => {
    const value = prompt("Enter the full API key to reveal:");
    if (value) setRevealedKeys({ ...revealedKeys, [keyId]: value });
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;
    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return;
    const res = await fetch(`/api/users/${session.user.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true, password }),
    });
    if (res.ok) {
      await signOut({ redirect: false });
      router.push("/");
    } else {
      const json = await res.json().catch(() => ({}));
      flash("error", json.error || "Failed to delete account");
    }
  };

  if (status === "loading" || !profileData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const tabs: { id: typeof activeTab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <div className="min-h-screen bg-base-200">
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

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6`}>
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="text-center mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-24 h-24">
                      <span className="text-3xl">
                        {(profileData.name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-3">{profileData.name}</h3>
                  <p className="text-sm text-base-content/70">{profileData.email}</p>
                  <div className="badge badge-primary badge-sm mt-2">{profileData.role}</div>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`btn btn-block justify-start ${activeTab === tab.id ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
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
                            value={profileData.location || ""}
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
                          value={profileData.website || ""}
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
                        maxLength={500}
                        placeholder="Tell us about yourself..."
                        value={profileData.bio || ""}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      ></textarea>
                      <label className="label">
                        <span className="label-text-alt">{(profileData.bio || "").length}/500 characters</span>
                      </label>
                    </div>

                    <div className="card-actions justify-end">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <span className="loading loading-spinner"></span> : <Check className="h-4 w-4" />}
                        Save Changes
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

                  <div className="mb-8">
                    <h3 className="font-bold text-lg mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Current Password</span>
                        </label>
                        <input
                          type="password"
                          className="input input-bordered"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">New Password</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="input input-bordered pr-10"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5 text-base-content/50" /> : <Eye className="h-5 w-5 text-base-content/50" />}
                          </button>
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Confirm New Password</span>
                        </label>
                        <input
                          type="password"
                          className="input input-bordered"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? <span className="loading loading-spinner"></span> : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border-t border-base-300 pt-6">
                    <h3 className="font-bold text-lg mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Member Since</span>
                        <span className="font-semibold">{formatMonthYear(profileData.createdAt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Account Type</span>
                        <span className="badge badge-primary">{profileData.role}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Account Status</span>
                        <span className="badge badge-success">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-base-300 pt-6 mt-6">
                    <h3 className="font-bold text-lg mb-4 text-error">Danger Zone</h3>
                    <div className="alert alert-error">
                      <div>
                        <h4 className="font-bold">Delete Account</h4>
                        <p className="text-xs">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-error mt-4" onClick={handleDeleteAccount}>
                      Delete Account
                    </button>
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
                    {([
                      ["emailNotifications", "Email Notifications", "Receive email notifications about your account activity"],
                      ["pushNotifications", "Push Notifications", "Receive push notifications in your browser"],
                      ["newsletter", "Newsletter", "Receive weekly newsletter with updates and tips"],
                      ["contributionUpdates", "Contribution Updates", "Get notified when your contributions are reviewed"],
                      ["achievementAlerts", "Achievement Alerts", "Celebrate when you unlock new achievements"],
                      ["creditLowAlert", "Low Credit Alert", "Get alerted when your credits are running low"],
                    ] as const).map(([key, title, desc]) => (
                      <div className="form-control" key={key}>
                        <label className="label cursor-pointer">
                          <span className="label-text font-semibold">{title}</span>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={notificationSettings[key]}
                            onChange={(e) =>
                              setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })
                            }
                          />
                        </label>
                        <label className="label">
                          <span className="label-text-alt">{desc}</span>
                        </label>
                      </div>
                    ))}

                    <div className="card-actions justify-end pt-4 border-t border-base-300">
                      <button className="btn btn-primary" disabled={loading} onClick={handleNotificationSave}>
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

                  {generatedKey && (
                    <div className="alert alert-warning mb-6">
                      <div className="flex-1">
                        <h4 className="font-bold">Copy your new API key</h4>
                        <code className="text-sm break-all">{generatedKey}</code>
                      </div>
                      <button className="btn btn-sm" onClick={() => setGeneratedKey(null)}>Dismiss</button>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-4">Your API Keys</h3>
                    {apiKeys.length === 0 ? (
                      <p className="text-base-content/60 text-sm">You have no API keys yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {apiKeys.map((k) => (
                          <div className="card bg-base-200" key={k.id}>
                            <div className="card-body p-4">
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="min-w-0">
                                  <h4 className="font-semibold">{k.name}</h4>
                                  <code className="text-sm bg-base-300 px-2 py-1 rounded break-all">
                                    {revealedKeys[k.id] || k.key}
                                  </code>
                                  <div className="text-xs text-base-content/70 mt-1">
                                    {k.tier} tier • Created {formatDate(k.createdAt)}
                                    {k.lastUsedAt ? ` • Last used ${timeAgo(k.lastUsedAt)}` : " • Never used"}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button className="btn btn-ghost btn-sm" onClick={() => handleRevealKey(k.id)}>
                                    Reveal
                                  </button>
                                  <button className="btn btn-error btn-sm" onClick={() => handleRevokeKey(k.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    Revoke
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

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
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tier</span>
                          </label>
                          <select className="select select-bordered" value={newKeyTier} onChange={(e) => setNewKeyTier(e.target.value)}>
                            <option value="FREE">Free (100 calls/day)</option>
                            <option value="BASIC">Basic (5,000 calls/day)</option>
                            <option value="PRO">Pro (100,000 calls/day)</option>
                            <option value="ENTERPRISE">Enterprise (Unlimited)</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Expiration</span>
                          </label>
                          <select className="select select-bordered" value={newKeyExpiry} onChange={(e) => setNewKeyExpiry(e.target.value)}>
                            <option value="">Never</option>
                            <option value="30">30 days</option>
                            <option value="90">90 days</option>
                            <option value="365">1 year</option>
                          </select>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary"
                        disabled={loading || !newKeyName}
                        onClick={handleCreateKey}
                      >
                        <Plus className="h-4 w-4" />
                        Generate API Key
                      </button>
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
