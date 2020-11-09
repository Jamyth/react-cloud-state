import React from "react";

export interface ProviderProps {
  children?: React.ReactChild | React.ReactChild[];
}

export interface State {
  loading: {
    [key: string]: boolean;
  };
  app: any;
}

declare module "react-cloud-state" {}
