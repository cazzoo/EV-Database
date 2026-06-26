import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link href="/about" className="link link-hover">About</Link>
          <Link href="/vehicles" className="link link-hover">Vehicles</Link>
          <Link href="/contribute" className="link link-hover">Contribute</Link>
          <Link href="/api-docs" className="link link-hover">API</Link>
          <Link href="/privacy" className="link link-hover">Privacy</Link>
          <Link href="/terms" className="link link-hover">Terms</Link>
        </div>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle">
            <Github className="h-5 w-5" />
          </a>

        </div>
      </nav>
      <aside>
        <p>
          <span className="font-bold">EV Community Hub</span> - The community-driven electric vehicle database
        </p>
        <p className="text-sm opacity-60">
          Built with Next.js, Tailwind CSS, and DaisyUI
        </p>
        <p className="text-xs opacity-40">
          © {new Date().getFullYear()} EV Community Hub. All rights reserved.
        </p>
      </aside>
    </footer>
  );
}
