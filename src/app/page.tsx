import { BackgroundGrid } from "@/components/landing/BackgroundGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 py-24 text-center overflow-hidden">
      <BackgroundGrid />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">
            InfiniteResume has reached its Finite End.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium italic">
            "We were too busy optimizing our React hooks to actually tell anyone we existed."
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-secondary/50 border border-border backdrop-blur-md space-y-6">
          <h2 className="text-2xl font-semibold text-accent">Status: Officially Shutdown</h2>
          
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Legend has it that the marketing budget was $0, and the developer's 
              commitment to "building in public" was limited to staring at a 
              Vercel deployment screen while eating cold pizza.
            </p>
            <p className="font-bold text-foreground">
              Reason for Failure: Extreme, terminal cases of "Lazy Marketing Syndrome."
            </p>
            <p>
              100% of the failure was attributed to human error (specifically, 
              forgetting to tweet about it), and 0% was due to the code. 
              The code was perfect. It was <span className="italic">too</span> perfect for this world.
            </p>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <p className="text-muted-foreground">
            If you actually used this service, thank you for being one of the 
            twelve people who found it. You are elite. You are legendary. 
            Now go back to Microsoft Word for your resume needs. 
          </p>
          <div className="flex justify-center gap-4 text-sm font-medium text-muted-foreground">
            <span>RIP InfiniteResume</span>
            <span>•</span>
            <span>2025 - 2026</span>
            <span>•</span>
            <span>Death by Silence</span>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />
    </main>
  );
}
