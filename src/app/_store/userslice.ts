import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IConfiguration {
  configuration: {
    username?: string;
    userId?: string;
    socketPath?: string;
    socketUrl?: string;
  };
  setConfiguration: (payload: {
    username?: string;
    userId?: string;
    socketPath?: string;
    socketUrl?: string;
  }) => void;
}

export const useConfigurationSlice = create<IConfiguration>()(
  devtools((set) => ({
    configuration: {
      userId: "",
      username: "",
      socketUrl: "",
      socketPath: "",
    },
    setConfiguration: (payload: {
      userId?: string;
      username?: string;
      socketPath?: string;
      socketUrl?: string;
    }) => {
      set(
        produce<IConfiguration>((draft) => {
          draft.configuration.userId = payload?.userId;
          draft.configuration.username = payload?.username;
          draft.configuration.socketPath = payload?.socketPath;
          draft.configuration.socketUrl = payload?.socketUrl;
        })
      );
    },
  }))
);
