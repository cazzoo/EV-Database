import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Battery,
  Zap,
  DollarSign,
  Star,
  Edit,
  Flag,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";

const VEHICLES: Record<string, {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  range: number;
  battery: number;
  acceleration: number;
  topSpeed: number;
  horsepower: number;
  drivetrain: string;
  seats: number;
  cargo: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  image: string;
}> = {
  "tesla-model-3-long-range": {
    id: "tesla-model-3-long-range",
    make: "Tesla",
    model: "Model 3 Long Range",
    year: 2024,
    price: 47740,
    range: 333,
    battery: 82,
    acceleration: 4.2,
    topSpeed: 145,
    horsepower: 425,
    drivetrain: "Dual Motor AWD",
    seats: 5,
    cargo: 23,
    rating: 4.5,
    reviews: 2847,
    description:
      "The Tesla Model 3 Long Range offers an impressive 333 miles of range with dual motor all-wheel drive. Experience instant torque, advanced autopilot capabilities, and a minimalist interior with a 15.4-inch touchscreen.",
    features: [
      "Dual Motor All-Wheel Drive",
      "15.4-inch Touchscreen",
      "Autopilot Ready",
      "Premium Audio with 13 Speakers",
      "Heated Seats & Steering Wheel",
      "Glass Roof",
      "Wireless Phone Charging",
      "Keyless Entry with Phone",
    ],
    image: "/images/tesla-model-3.jpg",
  },
  "ford-mustang-mach-e-gt": {
    id: "ford-mustang-mach-e-gt",
    make: "Ford",
    model: "Mustang Mach-E GT",
    year: 2024,
    price: 59995,
    range: 270,
    battery: 91,
    acceleration: 3.8,
    topSpeed: 130,
    horsepower: 480,
    drivetrain: "Dual Motor AWD",
    seats: 5,
    cargo: 59,
    rating: 4.3,
    reviews: 1234,
    description:
      "The Mustang Mach-E GT delivers thrilling performance with 480 horsepower and 600 lb-ft of torque. Experience the heritage of Mustang in an all-electric package with aggressive styling and track-inspired dynamics.",
    features: [
      "Dual Motor Performance AWD",
      "MagneRide Damping System",
      "Brembo Brakes",
      "20-inch Cast Aluminum Wheels",
      "Performance Seats",
      "15.5-inch Touchscreen with Sync 4A",
      "Ford Co-Pilot360 Active 2.0",
      "Hands-Free Driving Capability",
    ],
    image: "/images/mustang-mach-e.jpg",
  },
};

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = VEHICLES[slug];

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = Object.values(VEHICLES).filter(
    (v) => v.id !== vehicle.id
  );

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
                      {vehicle.year} • {vehicle.drivetrain}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-circle">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="btn btn-ghost btn-circle">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="btn btn-ghost btn-circle">
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(vehicle.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-base-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{vehicle.rating}</span>
                  <span className="text-base-content/70">
                    ({vehicle.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="text-3xl font-bold text-primary mt-4">
                  {vehicle.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
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
            {/* Key Stats */}
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
                      Range (EPA)
                    </div>
                    <div className="stat-value text-primary text-2xl">
                      {vehicle.range} mi
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
                      <span className="text-xl font-bold text-accent">0-60</span>
                      0-60 mph
                    </div>
                    <div className="stat-value text-accent text-2xl">
                      {vehicle.acceleration}s
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Top Speed</div>
                    <div className="stat-value text-2xl">{vehicle.topSpeed} mph</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Horsepower</div>
                    <div className="stat-value text-2xl">{vehicle.horsepower}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Cargo Space</div>
                    <div className="stat-value text-2xl">{vehicle.cargo} ft³</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Car className="h-6 w-6 text-primary" />
                  Overview
                </h2>
                <p className="text-base-content/80 mt-4 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Zap className="h-6 w-6 text-primary" />
                  Features & Equipment
                </h2>
                <ul className="list-none mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Community Rating */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">
                  <Star className="h-6 w-6 text-primary" />
                  Community Ratings
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">4.5</div>
                    <div className="text-sm text-base-content/70">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary">4.6</div>
                    <div className="text-sm text-base-content/70">Range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent">4.4</div>
                    <div className="text-sm text-base-content/70">Performance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-info">4.3</div>
                    <div className="text-sm text-base-content/70">Comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contribution Card */}
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
                  <Link href="/contribute" className="btn btn-secondary">
                    Edit This Vehicle
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Base Price</span>
                    <span className="font-semibold">
                      {vehicle.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Drivetrain</span>
                    <span className="font-semibold">{vehicle.drivetrain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Seating</span>
                    <span className="font-semibold">{vehicle.seats} passengers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Cargo</span>
                    <span className="font-semibold">{vehicle.cargo} ft³</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="font-bold text-lg mb-4">Browse More</h3>
                <div className="flex justify-between">
                  <Link href="/vehicles" className="btn btn-ghost">
                    <ChevronLeft className="h-4 w-4" />
                    All Vehicles
                  </Link>
                  <Link href="/compare" className="btn btn-ghost">
                    Compare
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Vehicles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedVehicles.map((v) => (
              <Link
                key={v.id}
                href={`/vehicles/${v.id}`}
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
                    {v.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <div className="text-sm text-base-content/70">
                    {v.range} mi range • {v.acceleration}s 0-60
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(VEHICLES).map((slug) => ({ slug }));
}
