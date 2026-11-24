const Icon = () => {
  const hardCodedSize = { width: "50px", height: "50px" };
  return (
    <div className="border border-gray-600 p-4" data-id="icon" style={hardCodedSize}>
      {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
      </svg> */}
    </div>
  );
};

export default Icon;