import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#16a34a", // Modern Emerald
            fontFamily: "var(--font-inter)",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: "w-full",
            card: "bg-card text-card-foreground border border-border shadow-sm rounded-xl overflow-hidden",
            headerTitle:
              "font-display font-bold tracking-tight text-3xl text-foreground mb-1",
            headerSubtitle: "text-sm text-muted-foreground mb-6",
            formButtonPrimary:
              "bg-accent hover:bg-accent/90 text-black font-semibold h-10 px-4 py-2 rounded-md transition-colors",
            socialButtonsBlockButton:
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground h-10 px-4 py-2",
            socialButtonsBlockButtonText: "font-medium text-sm text-foreground",
            formFieldInput:
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all",
            formFieldLabel:
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-1.5",
            footerActionLink:
              "text-accent hover:text-accent/80 font-medium transition-colors",
            identityPreviewText: "text-foreground font-medium text-sm",
            identityPreviewEditButtonIcon: "text-accent",
            formResendCodeLink: "text-accent hover:text-accent/80",
            internal: "hidden", // Attempt to hide internal clerk elements
            footer: "bg-muted/50 border-t border-border",
            footerAction: "hidden", // Hides the "Secured by Clerk" and "Development Mode" in most cases
            footerAction__securedBy: "hidden",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground text-xs font-medium",
          },
        }}
      />
    </div>
  );
}
