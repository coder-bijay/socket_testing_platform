import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IConfiguration {
  configuration: {
    username: string;
    socketPath: string;
    socketUrl: string;
  };
  setConfiguration: (payload: {
    username: string;
    socketPath: string;
    socketUrl: string;
  }) => void;
}

export const useConfigurationSlice = create<IConfiguration>()(
  devtools((set) => ({
    configuration: {
      username: "",
      socketUrl: "",
      socketPath: "",
    },
    setConfiguration: (payload: {
      username: string;
      socketPath: string;
      socketUrl: string;
    }) => {
      set(
        produce<IConfiguration>((draft) => {
          draft.configuration.username = payload?.username;
          draft.configuration.socketPath = payload?.socketPath;
          draft.configuration.socketUrl = payload?.socketUrl;
        })
      );
    },
  }))
);
