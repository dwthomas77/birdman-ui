const HomeWindow = ({ user }: { user: { displayName: string } }) => {
  return (
    <div className="flex-1 h-full">
      <div className="">Bird-UI - Welcome, {user.displayName}</div>
    </div>
  );
};

export default HomeWindow;