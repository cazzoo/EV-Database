import Link from "next/link";
import { Car } from "lucide-react";

export const metadata = {
  title: "About - EV Community Hub",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Car className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">About EV Community Hub</h1>
      </div>
      <div className="prose max-w-none">
        <p>
          EV Community Hub is a community-driven electric vehicle database. Our
          mission is to build the most comprehensive, community-curated catalog
          of electric vehicles — powered by contributors like you.
        </p>
        <h2>How it works</h2>
        <p>
          Anyone can browse the vehicle database for free. By creating an
          account, you can contribute data, verify edits, write reviews, and
          earn XP, badges, and virtual credits for your contributions.
        </p>
        <h2>Merit-based roles</h2>
        <p>
          As you contribute, you unlock new roles with additional privileges —
          from Newcomer all the way to Legend. Roles are earned purely through
          meaningful contributions to the database.
        </p>
        <p className="mt-8">
          <Link href="/contribute" className="btn btn-primary">
            Start contributing
          </Link>
        </p>
      </div>
    </div>
  );
}
