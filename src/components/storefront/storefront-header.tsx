import { ArrowUpRight } from "lucide-react";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StorefrontHeaderProps = {
  activeView: "Home" | "Product";
  onHome: () => void;
  onShop: () => void;
  onNavigateHomeSection: (sectionId: string) => void;
};

export function StorefrontHeader({
  activeView,
  onHome,
  onShop,
  onNavigateHomeSection
}: StorefrontHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-[color:var(--border)] bg-[color:var(--header-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-10">
          <button
            type="button"
            onClick={onHome}
            className="text-[25px] font-semibold leading-none tracking-[-0.055em]"
            aria-label="EMarket home"
          >
            EMarket<span className="text-[var(--accent)]">.</span>
          </button>

          <nav
            className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex"
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={onShop}
              className={cn(
                "transition-colors hover:text-[var(--text)]",
                activeView === "Product" && "font-medium text-[var(--text)]"
              )}
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() => onNavigateHomeSection("collection-section")}
              className="transition-colors hover:text-[var(--text)]"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => onNavigateHomeSection("story-section")}
              className="transition-colors hover:text-[var(--text)]"
            >
              Our approach
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShop}
            className="hidden rounded-full px-4 text-[var(--text)] sm:inline-flex"
          >
            Shop now
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Button>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
