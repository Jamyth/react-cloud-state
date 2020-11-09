import React from "react";
import { ProviderProps, State } from "../../index";
import { State as initialState } from "../State";

const StateContext = React.createContext({});

export const Provider = React.memo(({ children }: ProviderProps) => {
  const [globalState, setGlobalState] = React.useState<State>(initialState);

  const register = (name: keyof State["app"], initialState: any) => {
    if (globalState.app[name]) {
      return;
    }
    initialState = {
      ...globalState,
      app: {
        ...globalState.app,
        [name]: initialState,
      },
    };
    setGlobalState(initialState);
  };

  const createSetState = (moduleName: string) =>
    function <T extends State["app"][typeof moduleName]>(
      state: (
        state: State["app"][T]
      ) => State["app"][T] | Partial<State["app"][T]>
    ) {
      if (typeof state === "function") {
        const originalState = globalState.app[moduleName];
        const newState = (state as (state: State["app"][T]) => State["app"][T])(
          globalState.app[moduleName]
        );
        if (newState !== originalState) {
          setGlobalState({
            ...globalState,
            app: {
              ...globalState.app,
              [moduleName]: { ...newState },
            },
          });
        }
      } else {
      }
    };

  return <StateContext.Provider value={{}}>{children}</StateContext.Provider>;
});
