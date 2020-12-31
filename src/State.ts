import { InitialState } from "./type";

export let initialState: InitialState = {
  app: {},
};

export const setState = (state: InitialState) => {
  initialState = state;
};
