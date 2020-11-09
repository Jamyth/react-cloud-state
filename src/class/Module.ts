import { State } from "../..";
import { State as state } from "../State";

export class Module<
  RootState extends State,
  ModuleName extends keyof RootState["app"] & string
> {
  constructor(
    readonly name: ModuleName,
    readonly initialState: RootState["app"][ModuleName]
  ) {}

  get state(): Readonly<RootState["app"][ModuleName]> {
    return state.app[this.name];
  }

  get rootState(): Readonly<RootState["app"]> {
    return state.app;
  }

  setState<K extends keyof RootState["app"][ModuleName]>(
    stateOrUpdater:
      | ((state: RootState["app"][ModuleName]) => RootState["app"][ModuleName])
      | Pick<RootState["app"][ModuleName], K>
      | RootState["app"][ModuleName]
  ) {
    if (typeof stateOrUpdater === "function") {
      const originalState = this.state;
      const newState = (stateOrUpdater as (
        state: RootState["app"][ModuleName]
      ) => RootState["app"][ModuleName])(originalState);
      if (newState !== originalState) {
      }
    }
  }
}
