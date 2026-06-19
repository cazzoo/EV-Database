"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { formatDate, formatNumber, formatDateTime } from "@/lib/format";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}
interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  createdAt: string;
}

type Tab = "overview" | "transactions" | "invoices" | "subscription";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", expMonth: "", expYear: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (!session?.user?.id) return;
    const id = session.user.id;
    Promise.all([
      fetch(`/api/users/${id}/credits`).then((r) => r.json()),
      fetch(`/api/users/${id}/payment-methods`).then((r) => r.json()),
    ]).then(([creditsJson, methodsJson]) => {
      setBalance(creditsJson.data?.currentBalance ?? 0);
      setTransactions(creditsJson.data?.transactions ?? []);
      setMethods(methodsJson.data ?? []);
      setLoading(false);
    });
  }, [session?.user?.id, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const purchases = transactions.filter((t) => t.type === "PURCHASE_CREDITS");
  const earned = transactions.filter((t) => t.amount > 0 && t.type !== "PURCHASE_CREDITS");
  const used = transactions.filter((t) => t.amount < 0);
  const totalSpentUsd = purchases.reduce((s, t) => s + t.amount, 0) / 100;
  const totalEarned = earned.reduce((s, t) => s + t.amount, 0);
  const totalUsed = Math.abs(used.reduce((s, t) => s + t.amount, 0));

  const TYPE_BADGE: Record<string, string> = {
    EARN_CONTRIBUTION: "badge-success",
    EARN_VOTE: "badge-success",
    EARN_STREAK: "badge-success",
    ACHIEVEMENT_REWARD: "badge-success",
    LEVEL_UP_BONUS: "badge-success",
    PURCHASE_CREDITS: "badge-primary",
    API_USAGE: "badge-accent",
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    const res = await fetch(`/api/users/${session.user.id}/payment-methods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: newCard.number,
        expMonth: Number(newCard.expMonth),
        expYear: Number(newCard.expYear),
        isDefault: methods.length === 0,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      setMethods([...methods, json.data]);
      setNewCard({ number: "", expMonth: "", expYear: "" });
      setShowAddCard(false);
    }
  };

  const removeCard = async (methodId: string) => {
    if (!session?.user?.id || !confirm("Remove this payment method?")) return;
    const res = await fetch(`/api/users/${session.user.id}/payment-methods/${methodId}`, { method: "DELETE" });
    if (res.ok) setMethods(methods.filter((m) => m.id !== methodId));
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <CreditCard className="inline-block h-10 w-10 mr-2 text-primary" />
              Billing &amp; Payments
            </h1>
            <p className="text-lg text-base-content/70">
              Manage your payment methods, view invoices, and track your transaction history.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary"><DollarSign className="h-8 w-8" /></div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-primary">${totalSpentUsd.toFixed(2)}</div>
            <div className="stat-desc">Lifetime</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary"><Package className="h-8 w-8" /></div>
            <div className="stat-title">Credits Earned</div>
            <div className="stat-value text-secondary">{formatNumber(totalEarned)}</div>
            <div className="stat-desc">From contributions</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent"><TrendingUp className="h-8 w-8" /></div>
            <div className="stat-title">Credits Used</div>
            <div className="stat-value text-accent">{formatNumber(totalUsed)}</div>
            <div className="stat-desc">API calls &amp; features</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success"><FileText className="h-8 w-8" /></div>
            <div className="stat-title">Invoices</div>
            <div className="stat-value text-success">{formatNumber(purchases.length)}</div>
            <div className="stat-desc">Purchases</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <nav className="space-y-1">
                  {(["overview", "transactions", "invoices", "subscription"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      className={`btn btn-block justify-start capitalize ${tab === t ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </nav>
                <div className="divider"></div>
                <Link href="/credits" className="btn btn-primary btn-block">
                  <Package className="h-4 w-4 mr-2" />
                  Buy Credits
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Account Balance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Current Credits</div>
                        <div className="stat-value text-primary">{formatNumber(balance)}</div>
                        <div className="stat-desc">Available</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Total Earned</div>
                        <div className="stat-value text-secondary">+{formatNumber(totalEarned)}</div>
                        <div className="stat-desc">From activity</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Total Used</div>
                        <div className="stat-value text-accent">-{formatNumber(totalUsed)}</div>
                        <div className="stat-desc">Consumed</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Payment Methods
                      </h2>
                      <button className="btn btn-sm btn-primary" onClick={() => setShowAddCard(!showAddCard)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </button>
                    </div>

                    {showAddCard && (
                      <form onSubmit={addCard} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-4 bg-base-200 rounded-lg">
                        <div className="form-control md:col-span-1">
                          <label className="label"><span className="label-text text-xs">Card Number</span></label>
                          <input required className="input input-bordered input-sm" placeholder="4242 4242 4242 4242" value={newCard.number} onChange={(e) => setNewCard({ ...newCard, number: e.target.value })} />
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text text-xs">Exp Month</span></label>
                          <input required type="number" min="1" max="12" className="input input-bordered input-sm" placeholder="12" value={newCard.expMonth} onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })} />
                        </div>
                        <div className="form-control flex items-end gap-2">
                          <label className="label"><span className="label-text text-xs">Exp Year</span></label>
                          <input required type="number" className="input input-bordered input-sm" placeholder="2027" value={newCard.expYear} onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })} />
                        </div>
                        <div className="md:col-span-3 flex gap-2 justify-end">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddCard(false)}>Cancel</button>
                          <button type="submit" className="btn btn-primary btn-sm">Save Card</button>
                        </div>
                      </form>
                    )}

                    {methods.length === 0 ? (
                      <p className="text-base-content/60 text-sm py-4">No payment methods on file.</p>
                    ) : (
                      <div className="space-y-3">
                        {methods.map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">💳</div>
                              <div>
                                <div className="font-semibold">{m.brand} •••• {m.last4}</div>
                                <div className="text-sm text-base-content/70">Expires {m.expMonth}/{m.expYear}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {m.isDefault && <span className="badge badge-primary badge-sm">Default</span>}
                              <button className="btn btn-ghost btn-sm text-error" onClick={() => removeCard(m.id)}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Activity
                      </h2>
                      <button className="btn btn-ghost btn-sm" onClick={() => setTab("transactions")}>View All</button>
                    </div>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{txn.description}</div>
                            <div className="text-xs text-base-content/70">{formatDate(txn.createdAt)}</div>
                          </div>
                          <div className={`font-bold ${txn.amount >= 0 ? "text-success" : "text-accent"}`}>
                            {txn.amount >= 0 ? "+" : ""}{formatNumber(txn.amount)}
                          </div>
                        </div>
                      ))}
                      {transactions.length === 0 && <p className="text-base-content/60 text-sm">No transactions yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "transactions" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Transaction History
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr key={txn.id}>
                            <td className="text-sm">{formatDate(txn.createdAt)}</td>
                            <td>
                              <span className={`badge badge-sm ${TYPE_BADGE[txn.type] || "badge-ghost"}`}>
                                {txn.type.replace(/_/g, " ").toLowerCase()}
                              </span>
                            </td>
                            <td className="text-sm">{txn.description}</td>
                            <td className={`text-sm font-bold ${txn.amount >= 0 ? "text-success" : "text-accent"}`}>
                              {txn.amount >= 0 ? "+" : ""}{formatNumber(txn.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-base-content/60">No transactions found.</div>
                  )}
                </div>
              </div>
            )}

            {tab === "invoices" && (
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
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map((txn, i) => (
                          <tr key={txn.id}>
                            <td className="font-mono text-sm">INV-{String(i + 1).padStart(4, "0")}</td>
                            <td className="text-sm">{formatDate(txn.createdAt)}</td>
                            <td className="text-sm">{txn.description}</td>
                            <td className="font-bold text-sm">${(txn.amount / 100).toFixed(2)}</td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                  const content = `Invoice INV-${String(i + 1).padStart(4, "0")}\nDate: ${formatDateTime(txn.createdAt)}\nDescription: ${txn.description}\nAmount: $${(txn.amount / 100).toFixed(2)}\nCredits: ${txn.amount}`;
                                  const blob = new Blob([content], { type: "text/plain" });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = `invoice-${i + 1}.txt`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {purchases.length === 0 && (
                    <div className="text-center py-8 text-base-content/60">No invoices yet. Purchase credits to generate invoices.</div>
                  )}
                </div>
              </div>
            )}

            {tab === "subscription" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      Current Subscription
                    </h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">Free Plan</div>
                        <div className="text-base-content/70">$0/month</div>
                      </div>
                      <div className="badge badge-success badge-lg">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </div>
                    </div>
                    <p className="text-sm text-base-content/60 mt-2">
                      You&apos;re on the free plan. Earn credits through contributions or purchase credits anytime — no subscription required.
                    </p>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-6">Available Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: "Free", price: "$0", unit: "", popular: false, features: ["10 credits/day", "500 API calls/day", "Basic data access"] },
                        { name: "Standard", price: "$9.99", unit: "/mo", popular: true, features: ["100 credits/day", "5,000 API calls/day", "Premium data", "Analytics"] },
                        { name: "Pro", price: "$29.99", unit: "/mo", popular: false, features: ["Unlimited credits", "100,000 API calls/day", "Real-time updates", "Webhooks", "Priority support"] },
                      ].map((plan) => (
                        <div key={plan.name} className={`card ${plan.popular ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                          <div className="card-body">
                            {plan.popular && <div className="badge badge-accent badge-sm mb-2 w-fit">Popular</div>}
                            <h3 className="card-title">{plan.name}</h3>
                            <div className="text-3xl font-bold">{plan.price}<span className="text-lg">{plan.unit}</span></div>
                            <ul className="list-none space-y-2 mt-4">
                              {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm">{f}</span>
                                </li>
                              ))}
                            </ul>
                            <Link href="/credits" className={`btn ${plan.popular ? "btn-secondary" : "btn-primary"} btn-block mt-4`}>
                              {plan.name === "Free" ? "Current" : "Get Started"}
                            </Link>
                          </div>
                        </div>
                      ))}
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
