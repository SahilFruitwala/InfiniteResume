import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-transparent text-black/60 dark:text-white/60 py-20 border-t border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <Image
                src="/icon.png"
                alt="InfiniteResume Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-black dark:text-white">
              InfiniteResume
            </span>
          </Link>
          <p className="max-w-xs font-light text-sm leading-relaxed">
            The ATS analysis engine built to get you past the bots and in front
            of human recruiters.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                href="#features"
                className="hover:text-accent transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                className="hover:text-accent transition-colors"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                className="hover:text-accent transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/templates"
                className="hover:text-accent transition-colors"
              >
                ATS Templates
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-6">
            Company
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                href="/about"
                className="hover:text-accent transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-accent transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono uppercase tracking-widest">
          © InfiniteResume Inc. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs font-mono uppercase tracking-widest">
          <Link href="/terms" className="hover:text-accent transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
