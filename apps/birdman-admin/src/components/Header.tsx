import { tabStyles } from "../styles";

export type HeaderTab = "habitats" | "species" | "users";

interface HeaderProps {
  activeTab: HeaderTab;
  onTabChange: (tab: HeaderTab) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <div className="flex justify-between items-center w-full px-4 py-2 border-b border-gray-400">
      <h1 className="text-lg font-semibold uppercase tracking-wide">
        bird-ui
      </h1>
      <div className="flex justify-end gap-4">
        <div
          className={
            activeTab === "habitats"
              ? tabStyles.activeContainer
              : tabStyles.container
          }
        >
          <button
            onClick={() => onTabChange("habitats")}
            type="button"
            className={
              activeTab === "habitats" ? tabStyles.activeTab : tabStyles.tab
            }
          >
            Habitats
          </button>
        </div>
        <div
          className={
            activeTab === "species"
              ? tabStyles.activeContainer
              : tabStyles.container
          }
        >
          <button
            onClick={() => onTabChange("species")}
            type="button"
            className={
              activeTab === "species" ? tabStyles.activeTab : tabStyles.tab
            }
          >
            Species
          </button>
        </div>
        <div
          className={
            activeTab === "users"
              ? tabStyles.activeContainer
              : tabStyles.container
          }
        >
          <button
            onClick={() => onTabChange("users")}
            type="button"
            className={activeTab === "users" ? tabStyles.activeTab : tabStyles.tab}
          >
            Users
          </button>
        </div>
      </div>
    </div>
  );
}
