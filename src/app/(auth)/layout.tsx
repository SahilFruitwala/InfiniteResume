import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <BackgroundGrid />

      {/* Premium Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="absolute top-10 left-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-black transition-transform group-hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(22,163,74,0.3)]">
            <FileText className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight hidden sm:block">
            InfiniteResume
          </span>
        </Link>
      </div>
      <main className="w-full max-w-md mt-10 relative z-10">{children}</main>
    </div>
  );
}
