import { useState } from "react";
import { tabStyles } from "../styles";
import { taxonData } from "@birdman/shared-data";
import TaxonCard from "./TaxonCard";
import type {
  ObservationGroupFamily,
  ObservationGroupGenus,
  ObservationGroupSpecies,
  Taxon,
  TaxonGenus,
} from "@birdman/shared-types";

interface ManageObvGroupRelationshipsProps {
  relatedFamilies?: ObservationGroupFamily[];
  relatedGenera?: ObservationGroupGenus[];
  relatedSpecies?: ObservationGroupSpecies[];
  taxonPressHandler: (taxonId: string, rank: "family" | "genus" | "species") => void;
}

const ManageObvGroupRelationships = (
  props: ManageObvGroupRelationshipsProps,
) => {
  const [activeTab, setActiveTab] = useState<"family" | "genus" | "species">(
    "family",
  );

  const taxonomyData: {
    families: Taxon[];
    genera: TaxonGenus[];
  } = taxonData as {
    families: Taxon[];
    genera: TaxonGenus[];
  };

  const { families, genera } = taxonomyData;
  const { relatedFamilies, relatedGenera } = props;

  const isTaxonSelected = (taxonId: string, rank: "family" | "genus" | "species") => {
    if (rank === "family") {
      return relatedFamilies?.some((family) => family.familyId === taxonId) ?? false;
    }
    if (rank === "genus") {
      return relatedGenera?.some((genus) => genus.genusId === taxonId) ?? false;
    }
    // if (rank === "species") {
    //   return relatedSpecies?.some((species) => species.speciesId === taxonId) ?? false;
    // }
    return false;
  };

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
            <TaxonCard key={family.taxonId} taxon={{ ...family, rank: "family" }} isSelected={isTaxonSelected(family.taxonId, "family")} taxonPressHandler={props.taxonPressHandler} />
          ))}
        </div>
      </div>
      <div id="genera-tab" hidden={activeTab !== "genus"}>
        <div className="flex flex-wrap gap-2">
          {genera?.map((genus) => (
            <TaxonCard key={genus.taxonId} taxon={{ ...genus, rank: "genus" }} isSelected={isTaxonSelected(genus.taxonId, "genus")} taxonPressHandler={props.taxonPressHandler} />
          ))}
        </div>
      </div>
      <div id="species-tab" hidden={activeTab !== "species"}>

      </div>
    </div>
  );
};

export default ManageObvGroupRelationships;
