"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Download,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// Mock transaction data
const TRANSACTIONS = [
  {
    id: "TXN-2024-001",
    date: "2024-02-05",
    type: "purchase",
    description: "Pro Pack - 500 Credits",
    amount: 8.99,
    status: "completed",
    credits: 500,
    invoiceId: "INV-2024-001",
  },
  {
    id: "TXN-2024-002",
    date: "2024-02-01",
    type: "earned",
    description: "Contribution Reward: Tesla Model 3",
    amount: 0,
    status: "completed",
    credits: 25,
    invoiceId: null,
  },
  {
    id: "TXN-2024-003",
    date: "2024-01-28",
    type: "subscription",
    description: "Standard Plan - Monthly",
    amount: 9.99,
    status: "completed",
    credits: 0,
    invoiceId: "INV-2024-002",
  },
  {
    id: "TXN-2024-004",
    date: "2024-01-25",
    type: "earned",
    description: "Achievement Unlocked: Data Master",
    amount: 0,
    status: "completed",
    credits: 50,
    invoiceId: null,
  },
  {
    id: "TXN-2024-005",
    date: "2024-01-20",
    type: "purchase",
    description: "Starter Pack - 100 Credits",
    amount: 1.99,
    status: "completed",
    credits: 100,
    invoiceId: "INV-2024-003",
  },
  {
    id: "TXN-2024-006",
    date: "2024-01-15",
    type: "earned",
    description: "Contribution Reward: Hyundai Ioniq 6",
    amount: 0,
    status: "completed",
    credits: 15,
    invoiceId: null,
  },
  {
    id: "TXN-2024-007",
    date: "2024-01-10",
    type: "api_usage",
    description: "API Usage Deduction",
    amount: 0,
    status: "completed",
    credits: -50,
    invoiceId: null,
  },
];

// Mock invoice data
const INVOICES = [
  {
    id: "INV-2024-001",
    date: "2024-02-05",
    dueDate: "2024-02-05",
    amount: 8.99,
    status: "paid",
    description: "Pro Pack - 500 Credits",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-002",
    date: "2024-01-28",
    dueDate: "2024-01-28",
    amount: 9.99,
    status: "paid",
    description: "Standard Plan - Monthly",
    downloadUrl: "#",
  },
  {
    id: "INV-2024-003",
    date: "2024-01-20",
    dueDate: "2024-01-20",
    amount: 1.99,
    status: "paid",
    description: "Starter Pack - 100 Credits",
    downloadUrl: "#",
  },
];

// Mock subscription data
const SUBSCRIPTION = {
  plan: "Standard",
  status: "active",
  startDate: "2024-01-01",
  nextBillingDate: "2024-02-28",
  monthlyPrice: 9.99,
  features: [
    "5,000 API calls/day",
    "100 credits/day",
    "Premium data access",
    "Analytics dashboard",
    "Priority support",
  ],
};

// Mock payment methods
const PAYMENT_METHODS = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expiryMonth: 8,
    expiryYear: 2024,
    isDefault: false,
  },
];

type StatusFilter = "all" | "completed" | "pending" | "failed";
type TypeFilter = "all" | "purchase" | "earned" | "subscription" | "api_usage";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "invoices" | "subscription">("overview");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

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

  const filteredTransactions = TRANSACTIONS.filter((txn) => {
    if (statusFilter !== "all" && txn.status !== statusFilter) return false;
    if (typeFilter !== "all" && txn.type !== typeFilter) return false;
    return true;
  });

  const totalSpent = TRANSACTIONS
    .filter((t) => t.type === "purchase" || t.type === "subscription")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarned = TRANSACTIONS.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.credits, 0);

  const totalSpentCredits = TRANSACTIONS.filter((t) => t.credits < 0).reduce((sum, t) => sum + Math.abs(t.credits), 0);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <CreditCard className="inline-block h-10 w-10 mr-2 text-primary" />
              Billing & Payments
            </h1>
            <p className="text-lg text-base-content/70">
              Manage your subscriptions, view invoices, and track your transaction history.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <DollarSign className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-primary">${totalSpent.toFixed(2)}</div>
            <div className="stat-desc">Lifetime</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <Package className="h-8 w-8" />
            </div>
            <div className="stat-title">Credits Earned</div>
            <div className="stat-value text-secondary">{totalEarned}</div>
            <div className="stat-desc">From contributions</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="stat-title">Credits Used</div>
            <div className="stat-value text-accent">{totalSpentCredits}</div>
            <div className="stat-desc">API calls & features</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success">
              <FileText className="h-8 w-8" />
            </div>
            <div className="stat-title">Invoices</div>
            <div className="stat-value text-success">{INVOICES.length}</div>
            <div className="stat-desc">Total invoices</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "overview" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Overview
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "transactions" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("transactions")}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Transactions
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "invoices" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("invoices")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices
                  </button>
                  <button
                    className={`btn btn-block justify-start ${
                      activeTab === "subscription" ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab("subscription")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Subscription
                  </button>
                </nav>

                <div className="divider"></div>

                <a href="/credits" className="btn btn-primary btn-block">
                  <Package className="h-4 w-4 mr-2" />
                  Buy Credits
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Current Balance */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Account Balance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Current Credits</div>
                        <div className="stat-value text-primary">245</div>
                        <div className="stat-desc">Available</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">This Month</div>
                        <div className="stat-value text-secondary">+40</div>
                        <div className="stat-desc">Earned</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">This Month</div>
                        <div className="stat-value text-accent">-85</div>
                        <div className="stat-desc">Used</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Methods
                      </h2>
                      <button className="btn btn-sm btn-primary">Add New</button>
                    </div>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {method.brand === "visa" ? "💳" : method.brand === "mastercard" ? "💳" : "💳"}
                            </div>
                            <div>
                              <div className="font-semibold">
                                {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                              </div>
                              <div className="text-sm text-base-content/70">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && <span className="badge badge-primary badge-sm">Default</span>}
                            <button className="btn btn-ghost btn-sm">Edit</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Transactions Preview */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Activity
                      </h2>
                      <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("transactions")}>
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {TRANSACTIONS.slice(0, 5).map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center">
                              {txn.type === "earned" ? (
                                <div className="bg-success text-success-content rounded-full p-2">
                                  <CheckCircle className="h-5 w-5" />
                                </div>
                              ) : txn.type === "purchase" ? (
                                <div className="bg-primary text-primary-content rounded-full p-2">
                                  <Package className="h-5 w-5" />
                                </div>
                              ) : (
                                <div className="bg-secondary text-secondary-content rounded-full p-2">
                                  <Calendar className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{txn.description}</div>
                              <div className="text-xs text-base-content/70">{txn.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {txn.amount > 0 ? (
                              <div className="font-bold text-error">-${txn.amount.toFixed(2)}</div>
                            ) : txn.credits > 0 ? (
                              <div className="font-bold text-success">+{txn.credits} credits</div>
                            ) : (
                              <div className="font-bold text-accent">{txn.credits} credits</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Transaction History
                  </h2>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <select
                      className="select select-bordered select-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <select
                      className="select select-bordered select-sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                    >
                      <option value="all">All Types</option>
                      <option value="purchase">Purchases</option>
                      <option value="earned">Earned</option>
                      <option value="subscription">Subscriptions</option>
                      <option value="api_usage">API Usage</option>
                    </select>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((txn) => (
                          <tr key={txn.id}>
                            <td className="text-sm">{txn.date}</td>
                            <td>
                              <span
                                className={`badge badge-sm ${
                                  txn.type === "earned"
                                    ? "badge-success"
                                    : txn.type === "purchase"
                                    ? "badge-primary"
                                    : txn.type === "subscription"
                                    ? "badge-secondary"
                                    : "badge-accent"
                                }`}
                              >
                                {txn.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="text-sm">
                              <div>{txn.description}</div>
                              <div className="text-xs text-base-content/70">{txn.id}</div>
                            </td>
                            <td>
                              {txn.status === "completed" ? (
                                <span className="badge badge-success badge-sm">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              ) : txn.status === "pending" ? (
                                <span className="badge badge-warning badge-sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              ) : (
                                <span className="badge badge-error badge-sm">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="text-sm font-semibold">
                              {txn.amount > 0 ? (
                                <span className="text-error">-${txn.amount.toFixed(2)}</span>
                              ) : txn.credits > 0 ? (
                                <span className="text-success">+{txn.credits}</span>
                              ) : (
                                <span className="text-accent">{txn.credits}</span>
                              )}
                              <span className="text-xs text-base-content/70 ml-1">
                                {txn.amount > 0 ? "USD" : "credits"}
                              </span>
                            </td>
                            <td>
                              {txn.invoiceId ? (
                                <a
                                  href={`/billing/invoices/${txn.invoiceId}`}
                                  className="btn btn-ghost btn-sm"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  {txn.invoiceId}
                                </a>
                              ) : (
                                <span className="text-base-content/50 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                      <p className="text-base-content/70">No transactions found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <FileText className="h-5 w-5 text-primary" />
                    Invoices
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Invoice ID</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INVOICES.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="font-mono text-sm">{invoice.id}</td>
                            <td className="text-sm">{invoice.date}</td>
                            <td className="text-sm">{invoice.description}</td>
                            <td>
                              <span className="badge badge-success badge-sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {invoice.status}
                              </span>
                            </td>
                            <td className="font-bold text-sm">${invoice.amount.toFixed(2)}</td>
                            <td>
                              <button className="btn btn-ghost btn-sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {INVOICES.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
                      <p className="text-base-content/70">No invoices found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">
                      <Calendar className="h-5 w-5 text-primary" />
                      Current Subscription
                    </h2>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-2xl font-bold">{SUBSCRIPTION.plan} Plan</div>
                        <div className="text-base-content/70">
                          ${SUBSCRIPTION.monthlyPrice}/month
                        </div>
                      </div>
                      <div className="badge badge-success badge-lg">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {SUBSCRIPTION.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Started</div>
                        <div className="stat-value text-lg">{SUBSCRIPTION.startDate}</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Next Billing</div>
                        <div className="stat-value text-lg">{SUBSCRIPTION.nextBillingDate}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-3">Plan Features</h3>
                      <ul className="space-y-2">
                        {SUBSCRIPTION.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card-actions">
                      <button className="btn btn-primary">Upgrade Plan</button>
                      <button className="btn btn-ghost">Cancel Subscription</button>
                    </div>
                  </div>
                </div>

                {/* Available Plans */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">Available Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="card bg-base-200">
                        <div className="card-body">
                          <h3 className="card-title">Basic</h3>
                          <div className="text-3xl font-bold">Free</div>
                          <ul className="list-none space-y-2 mt-4">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">10 credits/day</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">500 API calls/day</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">Basic data access</span>
                            </li>
                          </ul>
                          <button className="btn btn-ghost btn-block mt-4">Current</button>
                        </div>
                      </div>

                      <div className="card bg-primary text-primary-content">
                        <div className="card-body">
                          <div className="badge badge-accent badge-sm mb-2">Popular</div>
                          <h3 className="card-title">Standard</h3>
                          <div className="text-3xl font-bold">$9.99<span className="text-lg">/mo</span></div>
                          <ul className="list-none space-y-2 mt-4">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">100 credits/day</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">5,000 API calls/day</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Premium data</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Analytics</span>
                            </li>
                          </ul>
                          <button className="btn btn-secondary btn-block mt-4">Current Plan</button>
                        </div>
                      </div>

                      <div className="card bg-base-200">
                        <div className="card-body">
                          <h3 className="card-title">Pro</h3>
                          <div className="text-3xl font-bold">$29.99<span className="text-lg">/mo</span></div>
                          <ul className="list-none space-y-2 mt-4">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">Unlimited credits</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">100,000 API calls/day</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">Real-time updates</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">Webhooks</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm">Priority support</span>
                            </li>
                          </ul>
                          <button className="btn btn-primary btn-block mt-4">Upgrade</button>
                        </div>
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
