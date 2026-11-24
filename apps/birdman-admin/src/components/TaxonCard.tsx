import appStyles from "../styles/appStyles";
import { Icon } from "./atomic";

const TaxonCard = ({
  taxon,
  isSelected,
  taxonPressHandler,
}: {
  taxon: { taxonId: string; name: string; rank: "family" | "genus" | "species" };
  isSelected: boolean;
  taxonPressHandler: (taxonId: string, rank: "family" | "genus" | "species") => void;
}) => {
  const taxonCardStyles = `
    flex
    justify-between
    basis-[350px]
    border
    border-gray-600
    rounded
    ${appStyles.secondaryContent}
    cursor-pointer
    px-2
    py-2
  `;

  return (
    <div className={taxonCardStyles} onClick={() => taxonPressHandler(taxon.taxonId, taxon.rank)}>
      <div className="flex">
        <div className="mt-[1px]"><input type="checkbox" checked={isSelected} /></div>
        <div className="ml-2">
          <div>{taxon.name}</div>
          <div className="italic">{taxon.taxonId}</div>
        </div>
      </div>
      <div id="fake-icon" className="flex items-center">
        <Icon />
      </div>
    </div>
  );
};

export default TaxonCard;
