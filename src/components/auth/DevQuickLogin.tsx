"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FlaskConical, LogIn } from "lucide-react";

type DevUser = {
  role: string;
  label: string;
  email: string;
};

const DEV_USERS: DevUser[] = [
  { role: "NEWCOMER", label: "Newcomer", email: "newdriver@example.com" },
  { role: "CONTRIBUTOR", label: "Contributor", email: "volt@example.com" },
  { role: "EXPERT", label: "Expert", email: "teslafan@example.com" },
  { role: "MODERATOR", label: "Moderator", email: "moderator@example.com" },
  { role: "ADMIN", label: "Admin", email: "admin@example.com" },
  { role: "LEGEND", label: "Legend", email: "enthusiast@example.com" },
];

const DEV_PASSWORD = "demo123";

export default function DevQuickLogin() {
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  const handleLogin = async (email: string) => {
    setLoadingEmail(email);
    await signIn("credentials", {
      email,
      password: DEV_PASSWORD,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="alert alert-warning border-warning/40 bg-warning/10 text-base-content">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-warning" />
          <span className="font-semibold">Dev Quick Login</span>
          <span className="badge badge-warning badge-sm">dev only</span>
        </div>
        <p className="text-xs text-base-content/70">
          Sign in instantly as a seeded user for a given role. Password for all
          accounts is <code className="kbd kbd-xs">demo123</code>.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEV_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              className="btn btn-sm btn-outline btn-warning"
              disabled={loadingEmail !== null}
              onClick={() => handleLogin(user.email)}
            >
              {loadingEmail === user.email ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {user.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
