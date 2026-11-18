import { useState } from "react";
import { tabStyles } from "../styles";
import { taxonData } from "@birdman/shared-data";
import TaxonCard from "./TaxonCard";
import type { TaxonData, Taxon, TaxonGenus } from "@birdman/shared-types";

const ManageObvGroupRelationships = () => {
  const [activeTab, setActiveTab] = useState<"family" | "genus" | "species">(
    "family",
  );

  const taxonomyData: TaxonData = taxonData;
  const { families, genera }: { families: Taxon[]; genera: TaxonGenus[] } =
    taxonomyData;

  return (
    <div>
      <div className="flex justify-start gap-4 mb-2">
        <div
          className={
            activeTab === "family"
              ? tabStyles.activeContainer
              : tabStyles.container
          }
        >
          <button
            onClick={() => setActiveTab("family")}
            type="button"
            aria-pressed={activeTab === "family"}
            className={
              activeTab === "family" ? tabStyles.activeTab : tabStyles.tab
            }
          >
            Family
          </button>
        </div>
        <div
          className={
            activeTab === "genus"
              ? tabStyles.activeContainer
              : tabStyles.container
          }
        >
          <button
            onClick={() => setActiveTab("genus")}
            type="button"
            aria-pressed={activeTab === "genus"}
            className={
              activeTab === "genus" ? tabStyles.activeTab : tabStyles.tab
            }
          >
            Genus
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
            onClick={() => setActiveTab("species")}
            type="button"
            aria-pressed={activeTab === "species"}
            className={
              activeTab === "species" ? tabStyles.activeTab : tabStyles.tab
            }
          >
            Species
          </button>
        </div>
      </div>
      <div id="families-tab" hidden={activeTab !== "family"}>
        <div className="flex flex-wrap gap-2">
          {families.map((family) => (
            <TaxonCard key={family.taxonId} taxon={family} />
          ))}
        </div>
      </div>
      <div id="genera-tab" hidden={activeTab !== "genus"}>
        <div className="flex flex-wrap gap-2">
          {genera.map((genus) => (
            <TaxonCard key={genus.taxonId} taxon={genus} />
          ))}
        </div>
      </div>
      <div id="species-tab" hidden={activeTab !== "species"}>
        {/* Species data would be mapped here similar to families and genera */}
      </div>
    </div>
  );
};

export default ManageObvGroupRelationships;
