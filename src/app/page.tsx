import Link from "next/link";
import {
  Car,
  Trophy,
  Users,
  ChevronRight,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { vehicleSlug, voteScore } from "@/lib/vehicles";
import { formatNumber, formatCurrency } from "@/lib/format";
import { getLevel } from "@/lib/gamification";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [vehicles, contributors, totalVehicles, totalUsers] = await Promise.all([
    prisma.electricVehicle.findMany({
      take: 3,
      orderBy: { votes: { _count: "desc" } },
      include: { votes: { select: { value: true } } },
    }),
    prisma.user.findMany({
      where: { NOT: { role: "ADMIN" } },
      orderBy: { xp: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        xp: true,
        contributions: { where: { status: "APPROVED" }, select: { id: true } },
      },
    }),
    prisma.electricVehicle.count(),
    prisma.user.count({ where: { NOT: { role: "ADMIN" } } }),
  ]);

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

      {/* Stats Strip */}
      <div className="py-8 bg-base-100 border-b border-base-300">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{formatNumber(totalVehicles)}</div>
            <div className="text-sm text-base-content/60">Vehicles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{formatNumber(totalUsers)}</div>
            <div className="text-sm text-base-content/60">Contributors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">6</div>
            <div className="text-sm text-base-content/60">Merit Roles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">$1 = 100</div>
            <div className="text-sm text-base-content/60">Credits</div>
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
                <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-16 h-16 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-16 h-16 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-16 h-16 bg-info text-info-content rounded-full flex items-center justify-center mx-auto mb-4">
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

          {vehicles.length === 0 ? (
            <div className="card bg-base-100 shadow">
              <div className="card-body items-center text-center">
                <Car className="h-12 w-12 text-base-content/30" />
                <p className="text-base-content/60">No vehicles yet. Be the first to add one!</p>
                <Link href="/contribute" className="btn btn-primary">Add a Vehicle</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                  <figure className="h-48 bg-base-200 flex items-center justify-center">
                    <Car className="h-24 w-24 text-base-content/30" />
                  </figure>
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <div className="badge badge-primary">
                        {voteScore(vehicle.votes)} votes
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-base-content/70">
                      <span>{vehicle.range} km range</span>
                      <span>{vehicle.battery} kWh</span>
                    </div>
                    <p className="font-semibold text-primary">
                      {vehicle.price ? formatCurrency(vehicle.price) : "Price N/A"}
                    </p>
                    <div className="card-actions justify-end">
                      <Link href={`/vehicles/${vehicleSlug(vehicle)}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    {contributors.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-base-content/60 py-8">
                          No contributors yet.
                        </td>
                      </tr>
                    )}
                    {contributors.map((user, index) => {
                      const level = getLevel(user.xp);
                      return (
                        <tr key={user.id}>
                          <td className="font-bold text-lg">
                            {index === 0 && "🥇"}
                            {index === 1 && "🥈"}
                            {index === 2 && "🥉"}
                            {index > 2 && `#${index + 1}`}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                                  <span className="text-xs">
                                    {(user.name || "?").charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td>{formatNumber(user.contributions.length)}</td>
                          <td>{formatNumber(user.xp)}</td>
                          <td>
                            <span className="badge badge-primary badge-sm">
                              {level.current.name}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
