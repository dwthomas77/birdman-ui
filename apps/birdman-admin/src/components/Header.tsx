import { Link } from "@tanstack/react-router";
import { tabStyles } from "../styles";

const navigationItems = [
  { label: "Habitats", to: "/habitats" },
  { label: "Species", to: "/species" },
  { label: "Users", to: "/users" },
] as const;

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-4 py-2 border-b border-gray-400">
      <h1 className="text-lg font-semibold uppercase tracking-wide">bird-ui</h1>
      <nav aria-label="Admin navigation" className="flex justify-end gap-4">
        {navigationItems.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className={`${tabStyles.container} ${tabStyles.tab}`}
            activeProps={{
              className: `${tabStyles.activeContainer} ${tabStyles.activeTab}`,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
