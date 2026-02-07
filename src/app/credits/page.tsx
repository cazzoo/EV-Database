"use client";

import { useState } from "react";
import { CreditCard, Zap, DollarSign, Shield, Badge, CheckCircle } from "lucide-react";

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
