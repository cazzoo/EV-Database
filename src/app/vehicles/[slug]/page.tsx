import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Battery,
  Zap,
  Edit,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Flag,
  Star,
  Gauge,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { vehicleSlug, voteScore } from "@/lib/vehicles";
import { formatCurrency, formatNumber, formatDate, timeAgo } from "@/lib/format";
import VehicleReviewForm from "@/components/vehicles/VehicleReviewForm";

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const vehicles = await prisma.electricVehicle.findMany({
    select: { make: true, model: true },
  });
  return vehicles.map((v) => ({ slug: vehicleSlug(v) }));
}

async function getVehicleBySlug(slug: string) {
  const candidates = await prisma.electricVehicle.findMany({
    select: { id: true, make: true, model: true },
  });
  const match = candidates.find((v) => vehicleSlug(v) === slug);
  if (!match) return null;

  return prisma.electricVehicle.findUnique({
    where: { id: match.id },
    include: {
      charging: true,
      performance: true,
      comments: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      votes: { select: { value: true } },
    },
  });
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const score = voteScore(vehicle.votes);
  const related = await prisma.electricVehicle.findMany({
    where: { id: { not: vehicle.id } },
    take: 3,
    orderBy: { votes: { _count: "desc" } },
    include: { votes: { select: { value: true } } },
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center w-full max-w-4xl">
          <div className="w-full">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <figure className="h-64 md:h-96 bg-base-200 flex items-center justify-center">
                <Car className="h-32 w-32 text-base-content/30" />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {vehicle.make} {vehicle.model}
                    </h1>
                    <p className="text-lg text-base-content/70 mt-1">
                      {vehicle.year}
                      {vehicle.trim ? ` • ${vehicle.trim}` : ""}
                      {vehicle.performance?.drivetrain ? ` • ${vehicle.performance.drivetrain}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-circle" title="Save">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button
                      className="btn btn-ghost btn-circle"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <Link href="/contribute" className="btn btn-ghost btn-circle" title="Report issue">
                      <Flag className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{formatNumber(score)}</span>
                  <span className="text-base-content/70">
                    community votes ({vehicle.votes.length})
                  </span>
                </div>

                <div className="text-3xl font-bold text-primary mt-4">
                  {vehicle.price ? formatCurrency(vehicle.price) : "Price N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Battery className="h-6 w-6 text-primary" />
                  Key Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">
                      <Zap className="h-4 w-4 inline mr-1" />
                      Range (WLTP)
                    </div>
                    <div className="stat-value text-primary text-2xl">
                      {formatNumber(vehicle.range)} km
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">
                      <Battery className="h-4 w-4 inline mr-1" />
                      Battery
                    </div>
                    <div className="stat-value text-secondary text-2xl">
                      {vehicle.battery} kWh
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">
                      <Gauge className="h-4 w-4 inline mr-1" />
                      0-100 km/h
                    </div>
                    <div className="stat-value text-accent text-2xl">
                      {vehicle.performance ? `${vehicle.performance.acceleration}s` : "-"}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Top Speed</div>
                    <div className="stat-value text-2xl">
                      {vehicle.performance ? `${vehicle.performance.topSpeed} km/h` : "-"}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Efficiency</div>
                    <div className="stat-value text-2xl">{vehicle.efficiency} Wh/km</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">DC Fast Charge</div>
                    <div className="stat-value text-2xl">
                      {vehicle.charging ? `${vehicle.charging.dcPower} kW` : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charging & Drivetrain */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Zap className="h-6 w-6 text-primary" />
                  Charging & Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex justify-between p-3 bg-base-200 rounded-lg">
                    <span className="text-base-content/70">AC Charging</span>
                    <span className="font-semibold">
                      {vehicle.charging ? `${vehicle.charging.acPower} kW` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-base-200 rounded-lg">
                    <span className="text-base-content/70">DC Fast Charging</span>
                    <span className="font-semibold">
                      {vehicle.charging ? `${vehicle.charging.dcPower} kW` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-base-200 rounded-lg">
                    <span className="text-base-content/70">Drivetrain</span>
                    <span className="font-semibold">
                      {vehicle.performance?.drivetrain || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-base-200 rounded-lg">
                    <span className="text-base-content/70">Acceleration</span>
                    <span className="font-semibold">
                      {vehicle.performance ? `${vehicle.performance.acceleration}s (0-100)` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Reviews */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Star className="h-6 w-6 text-primary" />
                  Community Reviews ({vehicle.comments.length})
                </h2>
                <VehicleReviewForm vehicleId={vehicle.id} />
                <div className="mt-6 space-y-4">
                  {vehicle.comments.length === 0 && (
                    <p className="text-base-content/60 text-center py-6">
                      No reviews yet. Be the first to share your thoughts!
                    </p>
                  )}
                  {vehicle.comments.map((comment) => (
                    <div key={comment.id} className="bg-base-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                            <span className="text-xs">
                              {(comment.user.name || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold">{comment.user.name}</span>
                        <span className="text-xs text-base-content/50">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-base-content/80">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Edit className="h-6 w-6" />
                  Contribute
                </h2>
                <p className="text-sm opacity-90 mt-2">
                  Spot an error? Have additional specs or photos? Help the
                  community by contributing!
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    href={`/contribute?vehicleId=${vehicle.id}&type=UPDATE_SPECS`}
                    className="btn btn-secondary"
                  >
                    Edit This Vehicle
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Base Price</span>
                    <span className="font-semibold">
                      {vehicle.price ? formatCurrency(vehicle.price) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Battery</span>
                    <span className="font-semibold">{vehicle.battery} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Range</span>
                    <span className="font-semibold">{formatNumber(vehicle.range)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Drivetrain</span>
                    <span className="font-semibold">
                      {vehicle.performance?.drivetrain || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Added</span>
                    <span className="font-semibold">{formatDate(vehicle.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Browse More</h3>
                <div className="flex justify-between">
                  <Link href="/vehicles" className="btn btn-ghost">
                    <ChevronLeft className="h-4 w-4" />
                    All Vehicles
                  </Link>
                  <Link href="/vehicles" className="btn btn-ghost">
                    Compare
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Vehicles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((v) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${vehicleSlug(v)}`}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <figure className="h-40 bg-base-200 flex items-center justify-center">
                    <Car className="h-20 w-20 text-base-content/30" />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg">
                      {v.make} {v.model}
                    </h3>
                    <p className="text-primary font-bold">
                      {v.price ? formatCurrency(v.price) : "N/A"}
                    </p>
                    <div className="text-sm text-base-content/70">
                      {formatNumber(v.range)} km range • {voteScore(v.votes)} votes
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
