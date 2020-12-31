import React from "react";
import { initialState as rootState, setState } from "./state";
import { InitialState } from "./type";
import { produce } from "immer";

const useForceRender = () => {
  const [, fn] = React.useReducer((s) => s + 1, []);
  return fn;
};

export const useSelector = <M extends InitialState, T>(
  fn: (state: M) => T
): T => {
  return fn(rootState as M);
};

export const useAction = (action: Function) => {
  const fn = useForceRender();
  return (...args: any[]) => {
    action(...args);
    fn();
  };
};

export const registerModule = <
  ModuleState extends InitialState,
  ModuleName extends keyof ModuleState["app"] & string
>(
  moduleName: ModuleName,
  initialState: ModuleState["app"][ModuleName],
  actionCreators: (store: {
    setState: <K extends keyof ModuleState["app"][ModuleName]>(
      stateOrUpdater:
        | ModuleState["app"][ModuleName]
        | Pick<ModuleState["app"][ModuleName], K>
        | ((state: ModuleState["app"][ModuleName]) => void)
    ) => void;
    getState: () => ModuleState["app"][ModuleName];
    getRootState: () => ModuleState;
  }) => Record<string, Function>
) => {
  if (!(moduleName in rootState.app)) {
    setState({
      ...rootState,
      app: {
        ...rootState.app,
        [moduleName]: initialState,
      },
    });
  }

  const setModuleState = <K extends keyof ModuleState["app"][ModuleName]>(
    stateOrUpdater:
      | ((state: ModuleState["app"][ModuleName]) => void)
      | Pick<ModuleState["app"][ModuleName], K>
      | ModuleState["app"][ModuleName]
  ): void => {
    if (typeof stateOrUpdater === "function") {
      const originalState = getModuleState();
      const updater = stateOrUpdater as (
        state: ModuleState["app"][ModuleName]
      ) => void;
      const newState = produce<
        Readonly<ModuleState["app"][ModuleName]>,
        ModuleState["app"][ModuleName]
      >(originalState, (draftState) => {
        // Wrap into a void function, in case updater() might return anything
        updater(draftState);
      });
      if (newState !== originalState) {
        setState({
          ...rootState,
          app: {
            ...rootState.app,
            [moduleName]: newState,
          },
        });
      }
    } else {
      const partialState = stateOrUpdater as object;
      setModuleState((state) => Object.assign(state, partialState));
    }
  };

  const getModuleState = (): ModuleState["app"][ModuleName] => {
    return (rootState.app as ModuleState["app"])[moduleName];
  };

  const getRootState = () => {
    return rootState as ModuleState;
  };

  const actions = actionCreators({
    setState: setModuleState,
    getState: getModuleState,
    getRootState,
  });

  const getKeys = <T extends string>(module: { [key in T]: unknown }) => {
    const keys: Array<T> = [];
    for (const propertyName of Object.getOwnPropertyNames(module)) {
      if (
        module[propertyName as T] instanceof Function &&
        propertyName !== "constructor"
      ) {
        keys.push(propertyName as T);
      }
    }
    return keys;
  };

  const keys = getKeys(actions);
  console.log(keys);

  const getActions = () => {
    return actions;
  };

  return {
    getActions,
  };
};
