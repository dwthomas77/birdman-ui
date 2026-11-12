import { Button } from "@birdman/shared-ui";

interface HomeWindowProps {
  user: { displayName: string };
  setActiveActivity: (activity: 'home' | 'journal' | 'observe') => void;
}

const HomeWindow = ({ user, setActiveActivity }: HomeWindowProps) => {
  return (
    <div className="flex-1 h-full">
      <div className="">Bird-UI - Welcome, {user.displayName}</div>
      <Button onClick={() => setActiveActivity('observe')} >Observe Bird</Button>
    </div>
  );
};

export default HomeWindow;