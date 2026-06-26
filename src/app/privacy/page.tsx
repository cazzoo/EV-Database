export const metadata = {
  title: "Privacy Policy - EV Community Hub",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p>
          This Privacy Policy describes how EV Community Hub (&quot;we&quot;)
          collects, uses, and protects your information when you use our
          service.
        </p>
        <h2>Information we collect</h2>
        <p>
          We collect the account information you provide at registration (name,
          email, and password), as well as contributions, reviews, and activity
          data you generate while using the platform.
        </p>
        <h2>How we use your information</h2>
        <ul>
          <li>To provide and maintain the service</li>
          <li>To track contributions and award XP, badges, and credits</li>
          <li>To communicate with you about your account</li>
        </ul>
        <h2>Data security</h2>
        <p>
          Passwords are stored using one-way cryptographic hashing (bcrypt). We
          do not sell or rent your personal information to third parties.
        </p>
        <p className="text-sm opacity-70 mt-8">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
