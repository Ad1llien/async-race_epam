import { NavLink } from 'react-router-dom';

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  const base = 'px-4 py-2 rounded border text-sm uppercase tracking-wide';
  return isActive
    ? `${base} bg-accent-cyan text-bg border-accent-cyan`
    : `${base} border-accent-cyan text-accent-cyan`;
}

export default function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <nav className="flex gap-3">
        <NavLink to="/garage" className={navLinkClassName}>
          Garage
        </NavLink>
        <NavLink to="/winners" className={navLinkClassName}>
          Winners
        </NavLink>
      </nav>
      <span className="font-bold tracking-widest text-accent-pink">Async Race</span>
    </header>
  );
}
