"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Server,
  Code,
  FileText,
  RefreshCw,
  Download,
} from "lucide-react";

// Mock API usage data
const API_USAGE_SUMMARY = {
  period: "current_month",
  startDate: "2024-02-01",
  endDate: "2024-02-29",
  totalRequests: 15234,
  successfulRequests: 14890,
  failedRequests: 344,
  creditsUsed: 892,
  creditsRemaining: 108,
  avgResponseTime: 145,
  rateLimitHits: 12,
};

const DAILY_USAGE = [
  { date: "2024-02-01", requests: 423, credits: 25, successRate: 99.1, avgResponseTime: 132 },
  { date: "2024-02-02", requests: 512, credits: 31, successRate: 98.8, avgResponseTime: 145 },
  { date: "2024-02-03", requests: 389, credits: 22, successRate: 99.5, avgResponseTime: 128 },
  { date: "2024-02-04", requests: 645, credits: 41, successRate: 97.2, avgResponseTime: 167 },
  { date: "2024-02-05", requests: 723, credits: 48, successRate: 98.9, avgResponseTime: 152 },
  { date: "2024-02-06", requests: 456, credits: 27, successRate: 99.3, avgResponseTime: 138 },
  { date: "2024-02-07", requests: 534, credits: 34, successRate: 98.1, avgResponseTime: 149 },
];

const ENDPOINT_BREAKDOWN = [
  {
    endpoint: "GET /api/vehicles",
    requests: 5423,
    percentage: 35.6,
    avgResponseTime: 98,
    successRate: 99.4,
    creditsPerCall: 1,
  },
  {
    endpoint: "GET /api/vehicles/[slug]",
    requests: 4892,
    percentage: 32.1,
    avgResponseTime: 112,
    successRate: 99.1,
    creditsPerCall: 1,
  },
  {
    endpoint: "POST /api/contributions",
    requests: 1823,
    percentage: 12.0,
    avgResponseTime: 234,
    successRate: 96.8,
    creditsPerCall: 1,
  },
  {
    endpoint: "GET /api/contributions",
    requests: 1234,
    percentage: 8.1,
    avgResponseTime: 87,
    successRate: 99.7,
    creditsPerCall: 0,
  },
  {
    endpoint: "GET /api/users/[id]/stats",
    requests: 892,
    percentage: 5.9,
    avgResponseTime: 95,
    successRate: 99.0,
    creditsPerCall: 1,
  },
  {
    endpoint: "POST /api/reviews",
    requests: 456,
    percentage: 3.0,
    avgResponseTime: 189,
    successRate: 97.8,
    creditsPerCall: 1,
  },
  {
    endpoint: "GET /api/leaderboard",
    requests: 345,
    percentage: 2.3,
    avgResponseTime: 76,
    successRate: 99.9,
    creditsPerCall: 0,
  },
  {
    endpoint: "GET /api/vehicles/search",
    requests: 169,
    percentage: 1.1,
    avgResponseTime: 156,
    successRate: 98.2,
    creditsPerCall: 1,
  },
];

const RECENT_REQUESTS = [
  {
    id: "REQ-2024-001",
    timestamp: "2024-02-07T14:32:15Z",
    method: "GET",
    endpoint: "/api/vehicles/tesla-model-3-2024",
    statusCode: 200,
    responseTime: 124,
    creditsUsed: 1,
    success: true,
  },
  {
    id: "REQ-2024-002",
    timestamp: "2024-02-07T14:31:58Z",
    method: "POST",
    endpoint: "/api/contributions",
    statusCode: 201,
    responseTime: 245,
    creditsUsed: 1,
    success: true,
  },
  {
    id: "REQ-2024-003",
    timestamp: "2024-02-07T14:31:42Z",
    method: "GET",
    endpoint: "/api/vehicles",
    statusCode: 200,
    responseTime: 89,
    creditsUsed: 1,
    success: true,
  },
  {
    id: "REQ-2024-004",
    timestamp: "2024-02-07T14:31:15Z",
    method: "GET",
    endpoint: "/api/users/me/stats",
    statusCode: 401,
    responseTime: 45,
    creditsUsed: 0,
    success: false,
    error: "Unauthorized - Invalid API key",
  },
  {
    id: "REQ-2024-005",
    timestamp: "2024-02-07T14:30:58Z",
    method: "GET",
    endpoint: "/api/leaderboard",
    statusCode: 200,
    responseTime: 72,
    creditsUsed: 0,
    success: true,
  },
  {
    id: "REQ-2024-006",
    timestamp: "2024-02-07T14:30:34Z",
    method: "GET",
    endpoint: "/api/vehicles/hyundai-ioniq-6-2024",
    statusCode: 429,
    responseTime: 23,
    creditsUsed: 0,
    success: false,
    error: "Rate limit exceeded",
  },
];

const API_KEYS = [
  {
    id: "pk_ev_hub_prod",
    name: "Production Key",
    tier: "Standard",
    rateLimit: 5000,
    requestsThisMonth: 12453,
    createdAt: "2024-01-01",
    lastUsed: "2024-02-07T14:32:15Z",
    status: "active",
  },
  {
    id: "pk_test_ev_hub",
    name: "Test Key",
    tier: "Basic",
    rateLimit: 500,
    requestsThisMonth: 2781,
    createdAt: "2024-01-15",
    lastUsed: "2024-02-06T09:15:42Z",
    status: "active",
  },
];

type TimeRange = "24h" | "7d" | "30d" | "90d";
type StatusFilter = "all" | "success" | "error";

export default function ApiUsagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-success";
    if (statusCode >= 300 && statusCode < 400) return "text-warning";
    if (statusCode >= 400 && statusCode < 500) return "text-error";
    return "text-base-content";
  };

  const successRate = ((API_USAGE_SUMMARY.successfulRequests / API_USAGE_SUMMARY.totalRequests) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Activity className="inline-block h-10 w-10 mr-2 text-primary" />
              API Usage Monitoring
            </h1>
            <p className="text-lg text-base-content/70">
              Track your API consumption, analyze performance, and optimize your integration.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="join">
            {(["24h", "7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <button
                key={range}
                className={`join-item btn ${timeRange === range ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTimeRange(range)}
              >
                {range === "24h" ? "24 Hours" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <Activity className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Requests</div>
            <div className="stat-value text-2xl">{API_USAGE_SUMMARY.totalRequests.toLocaleString()}</div>
            <div className="stat-desc">This month</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="stat-title">Success Rate</div>
            <div className="stat-value text-2xl text-success">{successRate}%</div>
            <div className="stat-desc">{API_USAGE_SUMMARY.successfulRequests.toLocaleString()} OK</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-error">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="stat-title">Failed</div>
            <div className="stat-value text-2xl text-error">{API_USAGE_SUMMARY.failedRequests}</div>
            <div className="stat-desc">Errors</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <Zap className="h-8 w-8" />
            </div>
            <div className="stat-title">Credits Used</div>
            <div className="stat-value text-2xl text-secondary">{API_USAGE_SUMMARY.creditsUsed}</div>
            <div className="stat-desc">{API_USAGE_SUMMARY.creditsRemaining} remaining</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <Clock className="h-8 w-8" />
            </div>
            <div className="stat-title">Avg Response</div>
            <div className="stat-value text-2xl text-accent">{API_USAGE_SUMMARY.avgResponseTime}</div>
            <div className="stat-desc">Milliseconds</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-warning">
              <Server className="h-8 w-8" />
            </div>
            <div className="stat-title">Rate Limits</div>
            <div className="stat-value text-2xl text-warning">{API_USAGE_SUMMARY.rateLimitHits}</div>
            <div className="stat-desc">Hits this month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Usage Chart */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Daily Usage
                  </h2>
                  <button
                    className={`btn btn-ghost btn-sm ${refreshing ? "loading" : ""}`}
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Requests</th>
                        <th>Credits</th>
                        <th>Success Rate</th>
                        <th>Avg Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAILY_USAGE.map((day) => (
                        <tr key={day.date}>
                          <td className="text-sm">{new Date(day.date).toLocaleDateString()}</td>
                          <td className="font-semibold">{day.requests}</td>
                          <td>{day.credits}</td>
                          <td>
                            <span className={`text-sm ${day.successRate >= 99 ? "text-success" : day.successRate >= 95 ? "text-warning" : "text-error"}`}>
                              {day.successRate}%
                            </span>
                          </td>
                          <td className="text-sm">{day.avgResponseTime}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Endpoint Breakdown */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-6">
                  <Code className="h-5 w-5 text-primary" />
                  Endpoint Breakdown
                </h2>
                <div className="space-y-4">
                  {ENDPOINT_BREAKDOWN.map((endpoint) => (
                    <div key={endpoint.endpoint} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-semibold">{endpoint.endpoint}</code>
                        <span className="text-xs text-base-content/70">
                          {endpoint.percentage}% of total
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-base-content/70">Requests</div>
                          <div className="font-semibold">{endpoint.requests.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-base-content/70">Avg Response</div>
                          <div className="font-semibold">{endpoint.avgResponseTime}ms</div>
                        </div>
                        <div>
                          <div className="text-base-content/70">Success Rate</div>
                          <div className={`font-semibold ${endpoint.successRate >= 99 ? "text-success" : "text-warning"}`}>
                            {endpoint.successRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-base-content/70">Credits/Call</div>
                          <div className="font-semibold">{endpoint.creditsPerCall}</div>
                        </div>
                      </div>
                      <progress
                        className="progress progress-primary w-full mt-3"
                        value={endpoint.percentage}
                        max="100"
                      ></progress>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title">
                    <FileText className="h-5 w-5 text-primary" />
                    Recent Requests
                  </h2>
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered select-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    >
                      <option value="all">All Status</option>
                      <option value="success">Success Only</option>
                      <option value="error">Errors Only</option>
                    </select>
                    <button className="btn btn-ghost btn-sm">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {RECENT_REQUESTS.filter((req) => {
                    if (statusFilter === "success") return req.success;
                    if (statusFilter === "error") return !req.success;
                    return true;
                  }).map((request) => (
                    <div
                      key={request.id}
                      className={`p-3 rounded-lg ${request.success ? "bg-base-200" : "bg-error/10"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span
                            className={`badge badge-sm ${
                              request.method === "GET"
                                ? "badge-info"
                                : request.method === "POST"
                                ? "badge-success"
                                : request.method === "PUT"
                                ? "badge-warning"
                                : "badge-error"
                            }`}
                          >
                            {request.method}
                          </span>
                          <code className="text-sm flex-1">{request.endpoint}</code>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={getStatusColor(request.statusCode)}>
                            {request.statusCode}
                          </span>
                          <span className={request.responseTime > 200 ? "text-warning" : "text-base-content/70"}>
                            {request.responseTime}ms
                          </span>
                          {request.creditsUsed > 0 && (
                            <span className="badge badge-secondary badge-xs">
                              -{request.creditsUsed}
                            </span>
                          )}
                          <span className="text-xs text-base-content/50">
                            {new Date(request.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {request.error && (
                        <div className="mt-2 text-xs text-error">
                          {request.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Keys */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  API Keys
                </h2>
                <div className="space-y-3">
                  {API_KEYS.map((key) => (
                    <div key={key.id} className="p-3 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">{key.name}</div>
                        <span className={`badge badge-xs ${key.status === "active" ? "badge-success" : "badge-error"}`}>
                          {key.status}
                        </span>
                      </div>
                      <div className="text-xs text-base-content/70 space-y-1">
                        <div>Tier: {key.tier}</div>
                        <div>Rate Limit: {key.rateLimit.toLocaleString()}/day</div>
                        <div>Requests: {key.requestsThisMonth.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-base-content/50 mt-2">
                        Last used: {new Date(key.lastUsed).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/profile?tab=api" className="btn btn-ghost btn-sm btn-block mt-4">
                  Manage Keys
                </a>
              </div>
            </div>

            {/* Alerts & Warnings */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Alerts
                </h2>
                <div className="space-y-3">
                  <div className="alert alert-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      <h4 className="font-bold text-sm">Low Credits</h4>
                      <p className="text-xs">
                        You have {API_USAGE_SUMMARY.creditsRemaining} credits remaining. Consider purchasing more.
                      </p>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <TrendingUp className="h-4 w-4" />
                    <div>
                      <h4 className="font-bold text-sm">Rate Limit Approaching</h4>
                      <p className="text-xs">
                        Your production key is at 85% of its daily rate limit.
                      </p>
                    </div>
                  </div>
                  {API_USAGE_SUMMARY.failedRequests > 100 && (
                    <div className="alert alert-error">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <h4 className="font-bold text-sm">High Error Rate</h4>
                        <p className="text-xs">
                          {API_USAGE_SUMMARY.failedRequests} failed requests this month. Check your integration.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Optimization Tips
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Cache Responses</div>
                      <div className="text-xs text-base-content/70">
                        Vehicle data doesn't change often. Cache GET requests for 1-24 hours.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Use Specific Endpoints</div>
                      <div className="text-xs text-base-content/70">
                        Get vehicle by slug instead of listing all vehicles.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Batch Requests</div>
                      <div className="text-xs text-base-content/70">
                        Combine multiple requests into fewer API calls when possible.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Monitor Usage</div>
                      <div className="text-xs text-base-content/70">
                        Set up alerts for rate limits and error thresholds.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
