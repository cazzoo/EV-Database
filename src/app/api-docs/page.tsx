import Link from "next/link";
import { Code2 } from "lucide-react";

export const metadata = {
  title: "API Documentation - EV Community Hub",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/vehicles",
    tier: "Public",
    cost: "Free",
    description: "Browse and filter the vehicle database with pagination.",
  },
  {
    method: "GET",
    path: "/api/vehicles/:id",
    tier: "Public",
    cost: "Free",
    description: "Fetch full details for a single vehicle by ID.",
  },
  {
    method: "GET",
    path: "/api/reviews",
    tier: "Public",
    cost: "Free",
    description: "List community reviews, optionally filtered by vehicle.",
  },
  {
    method: "GET",
    path: "/api/leaderboard",
    tier: "Public",
    cost: "Free",
    description: "Top contributors ranked by XP, filterable by timeframe.",
  },
  {
    method: "GET",
    path: "/api/contributions",
    tier: "Registered",
    cost: "1 credit",
    description: "List contributions with filtering by user, vehicle, or status.",
  },
  {
    method: "GET",
    path: "/api/users/:id/usage",
    tier: "Registered",
    cost: "1 credit",
    description: "Your API usage statistics and aggregated metrics.",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Code2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">API Documentation</h1>
      </div>

      <div className="prose max-w-none mb-8">
        <p>
          The EV Community Hub API provides programmatic access to our
          community-curated vehicle database. The <strong>Public API</strong> is
          rate-limited and free. The <strong>Registered API</strong> offers
          higher limits and richer data, charged per request using virtual
          credits.
        </p>
        <p>
          To use the Registered API, generate an API key from your{" "}
          <Link href="/api-usage">API usage dashboard</Link> and pass it in the{" "}
          <code>Authorization</code> header.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Tier</th>
              <th>Cost</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {ENDPOINTS.map((e) => (
              <tr key={e.path}>
                <td>
                  <span className="badge badge-sm badge-info">{e.method}</span>
                </td>
                <td className="font-mono text-sm">{e.path}</td>
                <td>
                  <span className="badge badge-sm badge-ghost">{e.tier}</span>
                </td>
                <td className="text-sm">{e.cost}</td>
                <td className="text-sm text-base-content/70">{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card bg-base-200 mt-8">
        <div className="card-body">
          <h2 className="card-title">Example request</h2>
          <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-x-auto"><code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.evcommunityhub.example/api/vehicles?make=tesla&limit=10"`}</code></pre>
        </div>
      </div>
    </div>
  );
}
