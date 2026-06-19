"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Car, Battery, Zap, Gauge, Search } from "lucide-react";
import { vehicleSlug } from "@/lib/vehicles";
import { formatNumber, formatCurrency } from "@/lib/format";

interface VehicleCard {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number | null;
  range: number;
  battery: number;
  performance: { acceleration: number } | null;
  charging: { dcPower: number } | null;
  votes: { value: number }[];
  voteScore: number;
}

const PAGE_SIZE = 9;

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <VehiclesContent />
    </Suspense>
  );
}

function VehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [price, setPrice] = useState(searchParams.get("price") || "any");
  const [range, setRange] = useState(searchParams.get("range") || "any");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [data, setData] = useState<{ data: VehicleCard[]; pagination: { pages: number; total: number } } | null>(null);
  const [loading, setLoading] = useState(true);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("make", query.trim());
    if (price !== "any") {
      const ranges: Record<string, [number, number]> = {
        under30: [0, 30000],
        "30to50": [30000, 50000],
        "50to75": [50000, 75000],
        over75: [75000, 9999999],
      };
      const r = ranges[price];
      if (r) {
        params.set("priceMin", String(r[0]));
        params.set("priceMax", String(r[1]));
      }
    }
    if (range !== "any") params.set("rangeMin", range);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    return params;
  }, [query, price, range, page]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/vehicles?${buildParams().toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    const urlParams = new URLSearchParams(buildParams().toString());
    if (sortBy !== "popular") urlParams.set("sort", sortBy);
    router.replace(`/vehicles?${urlParams.toString()}`, { scroll: false });
    return () => {
      active = false;
    };
  }, [buildParams, router, sortBy]);

  const applySearch = () => {
    setPage(1);
  };

  const sorted = data?.data
    ? [...data.data].sort((a, b) => {
        switch (sortBy) {
          case "priceAsc":
            return (a.price ?? Infinity) - (b.price ?? Infinity);
          case "priceDesc":
            return (b.price ?? 0) - (a.price ?? 0);
          case "range":
            return b.range - a.range;
          case "acceleration":
            return (a.performance?.acceleration ?? 99) - (b.performance?.acceleration ?? 99);
          default:
            return b.voteScore - a.voteScore;
        }
      })
    : [];

  return (
    <div className="min-h-screen bg-base-200">
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

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
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
                    placeholder="Search by make or model..."
                    className="input input-bordered w-full pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applySearch()}
                  />
                  <button
                    onClick={applySearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  >
                    <Search className="h-5 w-5 text-base-content/50" />
                  </button>
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price Range</span>
                </label>
                <select
                  className="select select-bordered"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="any">Any Price</option>
                  <option value="under30">Under $30,000</option>
                  <option value="30to50">$30,000 - $50,000</option>
                  <option value="50to75">$50,000 - $75,000</option>
                  <option value="over75">Over $75,000</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Min Range (km)</span>
                </label>
                <select
                  className="select select-bordered"
                  value={range}
                  onChange={(e) => {
                    setRange(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="any">Any Range</option>
                  <option value="300">300+ km</option>
                  <option value="400">400+ km</option>
                  <option value="500">500+ km</option>
                  <option value="600">600+ km</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select select-bordered"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="range">Range</option>
                  <option value="acceleration">Acceleration</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <Car className="h-12 w-12 text-base-content/30" />
              <p className="text-base-content/60">No vehicles match your filters.</p>
              <Link href="/contribute" className="btn btn-primary">Add a Vehicle</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicleSlug(vehicle)}`}
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
                        <span className="text-sm text-base-content/70">
                          {vehicle.price ? formatCurrency(vehicle.price) : "Price N/A"}
                        </span>
                      </div>
                      <div className="badge badge-primary badge-lg">
                        {formatNumber(vehicle.voteScore)} votes
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
                        <div className="font-semibold">{formatNumber(vehicle.range)} km</div>
                      </div>
                      <div className="text-center p-2 bg-base-200 rounded-lg">
                        <Gauge className="h-5 w-5 mx-auto text-accent mb-1" />
                        <div className="text-xs text-base-content/70">0-100</div>
                        <div className="font-semibold">
                          {vehicle.performance ? `${vehicle.performance.acceleration}s` : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <span className="btn btn-primary btn-sm">View Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {(data?.pagination.pages ?? 0) > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    «
                  </button>
                  {Array.from({ length: data!.pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`join-item btn ${p === page ? "btn-active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="join-item btn"
                    disabled={page >= (data?.pagination.pages ?? 1)}
                    onClick={() => setPage(page + 1)}
                  >
                    »
                  </button>
                </div>
                <span className="text-sm text-base-content/60 ml-2">
                  {formatNumber(data!.pagination.total)} vehicles
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
