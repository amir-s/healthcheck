import { useAppContext } from "./appState";

export const useUser = () => {
  const {
    state: { user },
  } = useAppContext();
  if (!user) {
    throw new Error("User is not available");
  }
  return user;
};
