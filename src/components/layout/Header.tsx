import { ThemeToggle } from '../ui/theme-toggle';

export default function Header() {
  return (
    <header className="bg-card border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold truncate lg:block hidden">ToolitHub</h2>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
