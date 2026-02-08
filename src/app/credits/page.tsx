"use client";

import { useState } from "react";
import { CreditCard, Zap, DollarSign, Shield, Badge, CheckCircle, Activity, TrendingUp, Database } from "lucide-react";

const CREDIT_PACKAGES = [
  {
    id: "basic",
    name: "Starter Pack",
    description: "Perfect for casual users",
    credits: 100,
    price: 1.99,
    features: ["100 credits", "No expiration", "Basic support"],
    recommended: false,
  },
  {
    id: "popular",
    name: "Pro Pack",
    description: "Most popular choice",
    credits: 500,
    price: 8.99,
    features: ["500 credits", "No expiration", "Priority support", "Bonus 20%"],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Pack",
    description: "For power users",
    credits: 1500,
    price: 24.99,
    features: ["1500 credits", "No expiration", "24/7 support", "Bonus 30%"],
    recommended: false,
  },
];

const API_PRICING = [
  {
    plan: "Basic",
    price: 0,
    credits: "10 credits/day",
    calls: "500 calls/day",
    features: ["Public API", "Rate limited", "Basic data access"],
  },
  {
    plan: "Standard",
    price: 9.99,
    credits: "100 credits/day",
    calls: "5,000 calls/day",
    features: ["Extended API", "Higher limits", "Premium data", "Analytics"],
  },
  {
    plan: "Pro",
    price: 29.99,
    credits: "Unlimited",
    calls: "100,000 calls/day",
    features: ["Full API access", "Real-time updates", "Webhooks", "Priority support"],
  },
];

// Credit costs for different API operations
const API_CREDIT_COSTS = [
  {
    category: "Vehicle Data",
    operations: [
      { endpoint: "GET /api/vehicles", description: "List all vehicles", credits: 1 },
      { endpoint: "GET /api/vehicles/[slug]", description: "Get vehicle details", credits: 1 },
      { endpoint: "POST /api/vehicles", description: "Add new vehicle (contribution)", credits: 1 },
    ],
  },
  {
    category: "User Data",
    operations: [
      { endpoint: "GET /api/users/[id]/stats", description: "Get user statistics", credits: 1 },
      { endpoint: "GET /api/users/[id]/achievements", description: "Get user achievements", credits: 1 },
      { endpoint: "GET /api/users/[id]/credits", description: "Get credit balance", credits: 0 },
    ],
  },
  {
    category: "Community Features",
    operations: [
      { endpoint: "GET /api/contributions", description: "List contributions", credits: 0 },
      { endpoint: "POST /api/contributions", description: "Submit contribution", credits: 1 },
      { endpoint: "GET /api/reviews", description: "List reviews", credits: 0 },
      { endpoint: "POST /api/reviews", description: "Submit review", credits: 1 },
      { endpoint: "GET /api/leaderboard", description: "Get leaderboard", credits: 0 },
    ],
  },
  {
    category: "Purchases & Credits",
    operations: [
      { endpoint: "GET /api/purchases", description: "List purchases", credits: 1 },
      { endpoint: "POST /api/purchases", description: "Purchase credits package", credits: 0 },
      { endpoint: "POST /api/users/[id]/credits", description: "Add credits (admin)", credits: 0 },
    ],
  },
];

// Usage examples
const USAGE_EXAMPLES = [
  {
    scenario: "Small App / Hobby Project",
    usage: "100-500 API calls/day",
    credits: "100-500 credits/day",
    recommended: "Basic Plan or Pro Pack (1500 credits)",
  },
  {
    scenario: "Production Application",
    usage: "1,000-10,000 API calls/day",
    credits: "1,000-10,000 credits/day",
    recommended: "Standard Plan or Pro Pack",
  },
  {
    scenario: "Enterprise Integration",
    usage: "50,000+ API calls/day",
    credits: "Unlimited",
    recommended: "Pro Plan or Enterprise Contact",
  },
];

export default function CreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to payment
    alert("Redirecting to payment...");
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Zap className="inline-block h-10 w-10 mr-2 text-primary" />
              EV Credits
            </h1>
            <p className="text-lg text-base-content/70">
              Purchase credits or subscribe to API plans for enhanced access to our EV database.
              Support the community while accessing premium features!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Credit Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <CreditCard className="h-6 w-6 inline mr-2" />
            Buy Credits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`card bg-base-100 shadow-lg transition-all ${
                  selectedPackage === pkg.id
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                } ${
                  pkg.recommended
                    ? "relative bg-primary text-primary-content"
                    : ""
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-accent badge-md">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="card-body">
                  <h3 className="card-title">{pkg.name}</h3>
                  <p className="text-sm opacity-80 mb-4">{pkg.description}</p>
                  <div className="text-center my-4">
                    <div className="text-4xl font-bold">
                      {pkg.credits.toLocaleString()}
                      <span className="text-lg opacity-70"> credits</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">
                      ${pkg.price.toFixed(2)}
                    </div>
                  </div>
                  <ul className="list-none space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn btn-block ${
                      pkg.recommended ? "btn-secondary" : "btn-primary"
                    }`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <Shield className="h-6 w-6 inline mr-2" />
            API Access Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {API_PRICING.map((plan, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">{plan.plan}</h3>
                  <div className="text-center my-4">
                    <div className="text-2xl font-bold">
                      {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                    </div>
                  </div>
                  <ul className="list-none space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      <span className="text-sm">{plan.credits}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      <span className="text-sm">{plan.calls}</span>
                    </li>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-block btn-primary">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="card bg-base-100 shadow-lg mb-12">
          <div className="card-body">
            <h2 className="card-title">
              <DollarSign className="h-6 w-6 text-primary" />
              How Credits Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">Purchase Credits</h3>
                <p className="text-base-content/70">
                  Buy credits packages using your preferred payment method.
                  Credits never expire!
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary text-secondary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">Use Credits</h3>
                <p className="text-base-content/70">
                  Spend credits on API calls, premium content, or special features.
                  Pay only for what you use.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-accent-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">Earn Rewards</h3>
                <p className="text-base-content/70">
                  Contribute to the community and earn free credits.
                  Help others while building your credit balance!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Credit Costs */}
        <div className="card bg-base-100 shadow-lg mb-12">
          <div className="card-body">
            <h2 className="card-title mb-6">
              <Database className="h-6 w-6 text-primary" />
              API Credit Costs
            </h2>
            <p className="text-base-content/70 mb-6">
              Each API call consumes credits based on the operation. GET requests typically cost 1 credit,
              while POST/PUT/DELETE operations may cost more due to their impact on the database.
            </p>
            <div className="alert alert-success mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold">Community Contributions are Encouraged!</h4>
                <p className="text-sm">Community-related operations (contributions, reviews, leaderboard) are free or minimal cost to encourage participation. Help grow our EV database!</p>
              </div>
            </div>
            {API_CREDIT_COSTS.map((category) => (
              <div key={category.category} className="mb-8">
                <h3 className="font-bold text-lg mb-4 text-primary">{category.category}</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Endpoint</th>
                        <th>Description</th>
                        <th className="text-center">Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.operations.map((op, idx) => (
                        <tr key={idx}>
                          <td>
                            <code className="bg-base-300 px-2 py-1 rounded text-sm">
                              {op.endpoint}
                            </code>
                          </td>
                          <td>{op.description}</td>
                          <td className="text-center">
                            <span className={`badge ${op.credits === 0 ? "badge-success" : op.credits <= 1 ? "badge-info" : "badge-warning"}`}>
                              {op.credits === 0 ? "Free" : `${op.credits} credit${op.credits > 1 ? "s" : ""}`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="card bg-base-100 shadow-lg mb-12">
          <div className="card-body">
            <h2 className="card-title mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              Usage Examples
            </h2>
            <p className="text-base-content/70 mb-6">
              Not sure how many credits you need? Here are some common use cases to help you plan.
            </p>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Use Case</th>
                    <th>Estimated Usage</th>
                    <th>Credit Consumption</th>
                    <th>Recommended Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {USAGE_EXAMPLES.map((example, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{example.scenario}</td>
                      <td>{example.usage}</td>
                      <td>{example.credits}</td>
                      <td>
                        <span className="badge badge-primary">{example.recommended}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* API Usage Tracking */}
        <div className="card bg-base-100 shadow-lg mb-12">
          <div className="card-body">
            <h2 className="card-title mb-6">
              <Activity className="h-6 w-6 text-primary" />
              Track Your API Usage
            </h2>
            <p className="text-base-content/70 mb-6">
              All API calls are automatically tracked. You can monitor your usage in real-time
              through the dashboard or by checking your credit balance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Total API Calls</div>
                <div className="stat-value text-primary">-</div>
                <div className="stat-desc">This month</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Credits Used</div>
                <div className="stat-value text-secondary">-</div>
                <div className="stat-desc">This month</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Avg Response Time</div>
                <div className="stat-value text-accent">-</div>
                <div className="stat-desc">Last 30 days</div>
              </div>
            </div>
            <div className="alert alert-info mt-6">
              <Activity className="h-6 w-6" />
              <div>
                <h4 className="font-bold">Pro Tip</h4>
                <p className="text-sm">Check your dashboard for detailed usage analytics including endpoint breakdown, error rates, and response times.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Section */}
        {selectedPackage && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Checkout</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Package</span>
                      <span className="font-semibold">
                        {CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Credits</span>
                      <span className="font-semibold">
                        {CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.credits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Price</span>
                      <span className="font-semibold">
                        ${CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        defaultChecked
                        className="radio radio-primary"
                        onChange={() => setPaymentMethod("card")}
                      />
                      <label className="cursor-pointer">Credit / Debit Card</label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        className="radio radio-primary"
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      <label className="cursor-pointer">PayPal</label>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Card Number</span>
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9010 1112"
                            className="input input-bordered"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Expiry Date</span>
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input input-bordered"
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">CVV</span>
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="input input-bordered"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-base-content/70">You will be redirected to PayPal</p>
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-block mt-6"
                      onClick={handleCheckout}
                    >
                      Complete Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
