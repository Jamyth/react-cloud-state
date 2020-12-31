declare module "react-cloud-state" {
  export interface CloudState {
    app: object;
  }
  export const useSelector: <M extends CloudState, T>(fn: (state: M) => T) => T;
  export const useAction: (action: Function) => (...args: any[]) => void;
  export const registerModule: <
    ModuleState extends CloudState,
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
  ) => { getAction: () => Record<string, Function> };
}
