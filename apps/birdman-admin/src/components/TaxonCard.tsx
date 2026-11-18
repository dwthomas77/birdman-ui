import appStyles from '../styles/appStyles';

const TaxonCard = ({ taxon, isSelected }: { taxon: { taxonId: string; name: string }; isSelected: boolean }) => {

  const taxonCardStyles = `
    flex
    items-center
    gap-4 border
    p-2
    border-gray-600
    rounded basis-[350px]
    items-start
    ${appStyles.primaryContent}
    cursor-pointer
  `;


  return <div className={taxonCardStyles}>
    <div><input type="checkbox" checked={isSelected} /></div>
    <div>
      <div>{taxon.name}</div>
      <div className="italic">{taxon.taxonId}</div>
    </div>
    <div>
      <div id="fake-icon"></div>
    </div>
  </div>;
};

export default TaxonCard;