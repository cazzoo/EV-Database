"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Activity } from "lucide-react";

interface UsageData {
  totalCalls: number;
  totalCreditsUsed: number;
  avgResponseTime: number;
}

export default function UsageStats() {
  const { data: session, status } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}/usage?period=30`);
        if (res.ok) {
          const json = await res.json();
          const summary = json?.data?.summary;
          if (active && summary) {
            setUsage({
              totalCalls: summary.totalCalls ?? 0,
              totalCreditsUsed: summary.totalCreditsUsed ?? 0,
              avgResponseTime: summary.avgResponseTime ?? 0,
            });
          }
        }
      } catch {
        // leave default zeroes
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [status, session?.user?.id]);

  const value = (n: number) => (loading ? "…" : String(n));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total API Calls</div>
          <div className="stat-value text-primary">{usage ? value(usage.totalCalls) : "-"}</div>
          <div className="stat-desc">Last 30 days</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Credits Used</div>
          <div className="stat-value text-secondary">{usage ? value(usage.totalCreditsUsed) : "-"}</div>
          <div className="stat-desc">Last 30 days</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Avg Response Time</div>
          <div className="stat-value text-accent">
            {usage ? `${value(usage.avgResponseTime)}ms` : "-"}
          </div>
          <div className="stat-desc">Last 30 days</div>
        </div>
      </div>
      <div className="alert alert-info mt-6">
        <Activity className="h-6 w-6" />
        <div>
          <h4 className="font-bold">Pro Tip</h4>
          <p className="text-sm">
            Check your{" "}
            <Link href="/api-usage" className="link">
              API usage dashboard
            </Link>{" "}
            for detailed analytics including endpoint breakdown, error rates, and
            response times.
          </p>
        </div>
      </div>
    </>
  );
}
