import { Suspense } from "react";
import Link from "next/link";
import { Car, Battery, Zap, DollarSign, Filter, Search } from "lucide-react";

// Mock data for demonstration
const VEHICLES = [
  {
    id: "tesla-model-3-long-range",
    make: "Tesla",
    model: "Model 3 Long Range",
    price: 47740,
    range: 333,
    battery: 82,
    acceleration: 4.2,
    image: "/images/tesla-model-3.jpg",
    rating: 4.5,
  },
  {
    id: "ford-mustang-mach-e-gt",
    make: "Ford",
    model: "Mustang Mach-E GT",
    price: 59995,
    range: 270,
    battery: 91,
    acceleration: 3.8,
    image: "/images/mustang-mach-e.jpg",
    rating: 4.3,
  },
  {
    id: "hyundai-ioniq-6",
    make: "Hyundai",
    model: "Ioniq 6",
    price: 42450,
    range: 361,
    battery: 77.4,
    acceleration: 5.1,
    image: "/images/ioniq-6.jpg",
    rating: 4.6,
  },
  {
    id: "rivian-r1t",
    make: "Rivian",
    model: "R1T",
    price: 69900,
    range: 352,
    battery: 135,
    acceleration: 3.0,
    image: "/images/rivian-r1t.jpg",
    rating: 4.7,
  },
  {
    id: "chevrolet-bolt-euv",
    make: "Chevrolet",
    model: "Bolt EUV",
    price: 27495,
    range: 247,
    battery: 65,
    acceleration: 7.0,
    image: "/images/bolt-euv.jpg",
    rating: 4.2,
  },
  {
    id: "bmw-ix-xdrive50",
    make: "BMW",
    model: "iX xDrive50",
    price: 87100,
    range: 324,
    battery: 111.5,
    acceleration: 4.4,
    image: "/images/bmw-ix.jpg",
    rating: 4.4,
  },
];

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero py-12 bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              <Car className="inline-block h-10 w-10 mr-2 text-primary" />
              Electric Vehicle Database
            </h1>
            <p className="text-lg text-base-content/70">
              Explore the most comprehensive database of electric vehicles. 
              Compare specs, read reviews, and find your perfect EV.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-lg mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Search Vehicles</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by make, model..."
                    className="input input-bordered w-full pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50" />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price Range</span>
                </label>
                <select className="select select-bordered">
                  <option>Any Price</option>
                  <option>Under $30,000</option>
                  <option>$30,000 - $50,000</option>
                  <option>$50,000 - $75,000</option>
                  <option>Over $75,000</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Range</span>
                </label>
                <select className="select select-bordered">
                  <option>Any Range</option>
                  <option>200+ miles</option>
                  <option>250+ miles</option>
                  <option>300+ miles</option>
                  <option>350+ miles</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select className="select select-bordered">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Range</option>
                  <option>Acceleration</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/vehicles/${vehicle.id}`}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <figure className="h-48 bg-base-200 flex items-center justify-center">
                <Car className="h-24 w-24 text-base-content/30" />
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-lg">
                      {vehicle.make} {vehicle.model}
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-base-content/70">
                        {vehicle.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="badge badge-primary badge-lg">
                    ⭐ {vehicle.rating}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-base-200 rounded-lg">
                    <Battery className="h-5 w-5 mx-auto text-primary mb-1" />
                    <div className="text-xs text-base-content/70">Battery</div>
                    <div className="font-semibold">{vehicle.battery} kWh</div>
                  </div>
                  <div className="text-center p-2 bg-base-200 rounded-lg">
                    <Zap className="h-5 w-5 mx-auto text-secondary mb-1" />
                    <div className="text-xs text-base-content/70">Range</div>
                    <div className="font-semibold">{vehicle.range} mi</div>
                  </div>
                  <div className="text-center p-2 bg-base-200 rounded-lg">
                    <span className="text-xl font-bold text-accent">0-60</span>
                    <div className="text-xs text-base-content/70">Acceleration</div>
                    <div className="font-semibold">{vehicle.acceleration}s</div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn">1</button>
            <button className="join-item btn btn-active">2</button>
            <button className="join-item btn">3</button>
            <button className="join-item btn">4</button>
            <button className="join-item btn">5</button>
          </div>
        </div>
      </div>
    </div>
  );
}
