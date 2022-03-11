import { User } from "firebase/auth";
import { createContext, useContext, useReducer } from "react";

export enum AppStateActions {
  setUser,
}

interface AppState {
  user: User | null;
}

interface SetUserAction {
  type: AppStateActions.setUser;
  payload: User | null;
}

type AppStateAction = SetUserAction;

const appReducer = (state: AppState, action: AppStateAction) => {
  switch (action.type) {
    case AppStateActions.setUser:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const useAppReducer = () => {
  return useReducer(appReducer, {} as AppState);
};

export const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppStateAction>;
    }
  | undefined
>(undefined);

export const useAppContext = () => {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("AppContext is used outside of AppContextProvider");
  }
  return value;
};
