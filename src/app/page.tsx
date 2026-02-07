import { Suspense } from "react";
import Link from "next/link";
import {
  Car,
  Zap,
  Trophy,
  Users,
  ChevronRight,
  ArrowRight,
  Star,
  CreditCard,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">
              <Car className="inline-block h-12 w-12 mr-3" />
              EV Hub
            </h1>
            <p className="text-xl mb-8">
              The ultimate community-driven electric vehicle database.
              Contribute, earn rewards, and connect with fellow EV enthusiasts.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/vehicles" className="btn btn-xl btn-accent btn-outline text-white border-white">
                Explore Vehicles
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
              <Link href="/contribute" className="btn btn-xl btn-primary">
                Start Contributing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EV Hub?</h2>
            <p className="text-lg text-base-content/70">
              A community-driven platform with gamification and rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  <Car className="h-8 w-8" />
                </div>
                <h3 className="card-title justify-center mb-2">Comprehensive Database</h3>
                <p className="text-base-content/70">
                  The most complete and up-to-date electric vehicle information
                  powered by community contributions.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-secondary text-secondary-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="card-title justify-center mb-2">Gamification</h3>
                <p className="text-base-content/70">
                  Earn XP, badges, and credits for your contributions. Level up
                  and compete with the community.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-accent text-accent-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="card-title justify-center mb-2">Virtual Credits</h3>
                <p className="text-base-content/70">
                  Purchase or earn credits to access premium features and API
                  services. Support the community while accessing exclusive content.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-info text-info-content rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="card-title justify-center mb-2">Community First</h3>
                <p className="text-base-content/70">
                  Contribute, review, and improve the database. Your voice helps
                  shape the future of EV information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Vehicles */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Most Popular EVs</h2>
            <Link href="/vehicles" className="btn btn-ghost">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <figure className="h-48 bg-base-200 flex items-center justify-center">
                  <Car className="h-24 w-24 text-base-content/30" />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title">Tesla Model 3</h3>
                    <div className="badge badge-primary">4.8⭐</div>
                  </div>
                  <p className="text-base-content/70">
                    The best-selling EV with industry-leading range and performance.
                  </p>
                  <div className="card-actions justify-end">
                    <Link href="/vehicles/tesla-model-3" className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Contributors</h2>
            <Link href="/leaderboard" className="btn btn-ghost">
              View Leaderboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Contributions</th>
                      <th>XP</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, name: "EVEnthusiast", contributions: 156, xp: 2450, level: "Expert" },
                      { rank: 2, name: "TeslaFan42", contributions: 128, xp: 2100, level: "Contributor" },
                      { rank: 3, name: "GreenMachine", contributions: 112, xp: 1890, level: "Contributor" },
                      { rank: 4, name: "ChargeMaster", contributions: 98, xp: 1650, level: "Contributor" },
                      { rank: 5, name: "ElectronX", contributions: 87, xp: 1420, level: "Contributor" },
                    ].map((user) => (
                      <tr key={user.rank}>
                        <td className="font-bold text-lg">
                          {user.rank === 1 && "🥇"}
                          {user.rank === 2 && "🥈"}
                          {user.rank === 3 && "🥉"}
                          {user.rank > 3 && `#${user.rank}`}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                                <span className="text-xs">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td>{user.contributions}</td>
                        <td>{user.xp.toLocaleString()}</td>
                        <td>
                          <span className="badge badge-primary badge-sm">
                            {user.level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the fastest-growing community of EV enthusiasts. Start
            contributing today and earn rewards while helping others.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contribute" className="btn btn-xl btn-accent">
              Start Contributing
            </Link>
            <Link href="/auth/register" className="btn btn-xl btn-primary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
