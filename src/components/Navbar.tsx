"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Car, 
  Trophy, 
  User, 
  CreditCard, 
  Menu, 
  X,
  Zap,
  Search
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><Link href="/vehicles"><Car className="h-4 w-4" /> Vehicles</Link></li>
            <li><Link href="/leaderboard"><Trophy className="h-4 w-4" /> Leaderboard</Link></li>
            <li><Link href="/contribute"><Zap className="h-4 w-4" /> Contribute</Link></li>
            <li><Link href="/credits"><CreditCard className="h-4 w-4" /> Credits</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold">EV Hub</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href="/vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> Vehicles
            </Link>
          </li>
          <li>
            <Link href="/leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Leaderboard
            </Link>
          </li>
          <li>
            <Link href="/contribute" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Contribute
            </Link>
          </li>
          <li>
            <Link href="/credits" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Credits
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <div className="form-control hidden sm:block">
          <input
            type="text"
            placeholder="Search vehicles..."
            className="input input-bordered input-sm w-36 md:w-64"
          />
        </div>
        <Link href="/auth/login" className="btn btn-ghost btn-sm">
          <User className="h-4 w-4" /> Login
        </Link>
        <Link href="/auth/register" className="btn btn-primary btn-sm">
          Join Now
        </Link>
      </div>
    </div>
  );
}
