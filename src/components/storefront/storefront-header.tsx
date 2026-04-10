import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/storefront/cart-sheet";
import {
  PRIMARY_NAV,
  SECONDARY_NAV,
  THEMES,
  type PrimaryNavItem,
  type StorefrontView,
  type ThemeId
} from "@/components/storefront/storefront-page-config";
import { cn } from "@/lib/utils";

type StorefrontHeaderProps = {
  activeView: StorefrontView;
  theme: ThemeId;
  onHome: () => void;
  onPrimaryNavClick: (item: PrimaryNavItem) => void;
  onThemeChange: (theme: ThemeId) => void;
};

export function StorefrontHeader({
  activeView,
  theme,
  onHome,
  onPrimaryNavClick,
  onThemeChange
}: StorefrontHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--header-bg)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={onHome}
            className="text-[36px] font-semibold leading-none tracking-[-0.06em]"
          >
            EMarket
          </button>
          <nav className="hidden items-center gap-6 text-[15px] text-[var(--muted)] lg:flex">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "transition hover:text-[var(--text)]",
                  activeView === item && "font-semibold text-[var(--text)]"
                )}
                onClick={() => onPrimaryNavClick(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-3 text-sm md:flex">
          <div className="flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--theme-chip-bg)] p-1">
            {THEMES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition",
                  theme === item.id
                    ? "bg-[color:var(--theme-chip-active-bg)] text-[color:var(--theme-chip-active-text)]"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                )}
                onClick={() => onThemeChange(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button
            className="h-10 px-5 shadow-none hover:brightness-95"
            style={{
              backgroundColor: "var(--action)",
              color: "var(--action-contrast)"
            }}
            size="sm"
          >
            Log in
          </Button>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
          <p className="text-lg font-semibold tracking-[-0.02em]">eCommerce</p>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--theme-chip-bg)] p-1 md:hidden">
              {THEMES.map((item) => (
                <button
                  key={`mobile-${item.id}`}
                  type="button"
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition",
                    theme === item.id
                      ? "bg-[color:var(--theme-chip-active-bg)] text-[color:var(--theme-chip-active-text)]"
                      : "text-[var(--muted)]"
                  )}
                  onClick={() => onThemeChange(item.id)}
                >
                  {item.label.slice(0, 1)}
                </button>
              ))}
            </div>
            <nav className="hidden items-center gap-5 text-[15px] text-[var(--muted)] md:flex">
              {SECONDARY_NAV.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="transition hover:text-[var(--text)]"
                >
                  {item}
                </button>
              ))}
            </nav>
            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  );
}
