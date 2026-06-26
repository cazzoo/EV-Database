export const metadata = {
  title: "Terms of Service - EV Community Hub",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        <p>
          By accessing or using EV Community Hub, you agree to be bound by these
          Terms of Service.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Contributions must be accurate and sourced where possible</li>
          <li>Do not submit copyrighted material without permission</li>
          <li>Do not abuse, spam, or disrupt the community</li>
        </ul>
        <h2>Contributions</h2>
        <p>
          Content you contribute is subject to review by moderators. We reserve
          the right to remove contributions that violate these terms.
        </p>
        <h2>Virtual credits</h2>
        <p>
          Virtual credits have no monetary value outside the platform and may be
          earned through contributions or purchased. Purchased credits are
          non-refundable except where required by law.
        </p>
        <p className="text-sm opacity-70 mt-8">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
