"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Code,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import { formatNumber, formatDateTime } from "@/lib/format";

interface UsageSummary {
  totalCalls: number;
  totalCreditsUsed: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  avgResponseTime: number;
}
interface EndpointUsage {
  endpoint: string;
  count: number;
}
interface DailyUsage {
  date: string;
  calls: number;
  credits: number;
}
interface RecentCall {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  creditsUsed: number;
  responseTime: number;
  createdAt: string;
}
interface UsageData {
  summary: UsageSummary;
  endpointUsage: EndpointUsage[];
  dailyUsage: DailyUsage[];
  recentCalls: RecentCall[];
}

export default function ApiUsagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = (id: string) => {
    setLoading(true);
    fetch(`/api/users/${id}/usage?period=30`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (session?.user?.id) load(session.user.id);
  }, [session?.user?.id, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const s = data?.summary;
  const maxDaily = data ? Math.max(1, ...data.dailyUsage.map((d) => d.calls)) : 1;
  const maxEndpoint = data ? Math.max(1, ...data.endpointUsage.map((e) => e.count)) : 1;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Activity className="inline-block h-10 w-10 mr-2 text-primary" />
              API Usage
            </h1>
            <p className="text-lg text-base-content/70">
              Monitor your API consumption, performance, and credit usage over the last 30 days.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => session?.user?.id && load(session.user.id)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <SummaryCard icon={Activity} label="Total Requests" value={s ? formatNumber(s.totalCalls) : "0"} />
          <SummaryCard icon={CheckCircle} label="Successful" value={s ? formatNumber(s.successfulCalls) : "0"} color="text-success" />
          <SummaryCard icon={AlertTriangle} label="Failed" value={s ? formatNumber(s.failedCalls) : "0"} color="text-error" />
          <SummaryCard icon={Zap} label="Credits Used" value={s ? formatNumber(s.totalCreditsUsed) : "0"} color="text-secondary" />
          <SummaryCard icon={TrendingUp} label="Success Rate" value={s ? `${s.successRate}%` : "-"} color="text-primary" />
          <SummaryCard icon={Clock} label="Avg Response" value={s ? `${s.avgResponseTime}ms` : "-"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily usage */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                <Calendar className="h-5 w-5 text-primary" />
                Daily Requests
              </h2>
              {!data || data.dailyUsage.length === 0 ? (
                <p className="text-base-content/60 py-8 text-center">No usage recorded yet.</p>
              ) : (
                <div className="flex items-end gap-2 h-48 mt-4">
                  {data.dailyUsage.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-primary rounded-t" style={{ height: `${(d.calls / maxDaily) * 100}%`, minHeight: "2px" }} title={`${d.calls} calls`}></div>
                      <span className="text-[10px] text-base-content/50 rotate-45 origin-left">{d.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Endpoint breakdown */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                <Code className="h-5 w-5 text-primary" />
                Endpoint Breakdown
              </h2>
              {!data || data.endpointUsage.length === 0 ? (
                <p className="text-base-content/60 py-8 text-center">No endpoints called yet.</p>
              ) : (
                <div className="space-y-3 mt-4">
                  {data.endpointUsage.map((e) => (
                    <div key={e.endpoint}>
                      <div className="flex justify-between text-sm mb-1">
                        <code className="text-xs">{e.endpoint}</code>
                        <span className="font-semibold">{formatNumber(e.count)}</span>
                      </div>
                      <progress className="progress progress-primary w-full" value={e.count} max={maxEndpoint}></progress>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent calls */}
        <div className="card bg-base-100 shadow-lg mt-8">
          <div className="card-body">
            <h2 className="card-title">
              <Activity className="h-5 w-5 text-primary" />
              Recent Requests
            </h2>
            {!data || data.recentCalls.length === 0 ? (
              <p className="text-base-content/60 py-8 text-center">No requests recorded yet.</p>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Credits</th>
                      <th>Response</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCalls.slice(0, 20).map((c) => (
                      <tr key={c.id}>
                        <td><code className="text-xs">{c.endpoint}</code></td>
                        <td><span className="badge badge-ghost badge-sm">{c.method}</span></td>
                        <td>
                          <span className={`badge badge-sm ${c.statusCode < 300 ? "badge-success" : "badge-error"}`}>
                            {c.statusCode}
                          </span>
                        </td>
                        <td>{c.creditsUsed}</td>
                        <td>{c.responseTime}ms</td>
                        <td className="text-xs text-base-content/60">{formatDateTime(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-primary text-primary-content shadow-lg mt-8">
          <div className="card-body sm:flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <KeyRound className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">Manage your API keys</h3>
                <p className="text-sm opacity-80">Create or revoke keys from your profile settings.</p>
              </div>
            </div>
            <Link href="/profile" className="btn btn-secondary">Go to API Keys</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="stat bg-base-100 shadow-lg rounded-lg">
      <div className="stat-figure text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="stat-title text-xs">{label}</div>
      <div className={`stat-value text-2xl ${color || ""}`}>{value}</div>
    </div>
  );
}
