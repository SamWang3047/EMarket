export function StorefrontFooter() {
  return (
    <footer className="bg-[#151a16] px-5 py-10 text-white md:px-8">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-between gap-8 border-t border-white/15 pt-8 md:flex-row md:items-end">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.055em]">
            EMarket<span className="text-[var(--signal)]">.</span>
          </p>
          <p className="mt-3 max-w-[360px] text-sm leading-6 text-white/50">
            A focused edit of tools for calmer desks and better work.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <span>Sydney, Australia</span>
          <span>© {new Date().getFullYear()} EMarket</span>
        </div>
      </div>
    </footer>
  );
}
