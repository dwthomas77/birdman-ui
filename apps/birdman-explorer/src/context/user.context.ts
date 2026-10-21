import {
  createElement,
  createContext,
  use,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { User } from "@birdman/shared-types";

export type UserContextValue = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function UserProvider({
  children,
  initialUser = null,
}: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const value = useMemo(() => ({ user, setUser }), [user]);

  return createElement(UserContext, { value }, children);
}

export function useUser(): UserContextValue {
  const context = use(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider.");
  }

  return context;
}

export { UserContext };
