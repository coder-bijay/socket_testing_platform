import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IConfiguration {
  configuration: {
    username?: string;
    phoneNumber?: string;
    userId?: string;
    socketPath?: string;
    socketUrl?: string;
  };
  setConfiguration: (payload: {
    username?: string;
    phoneNumber?: string;
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
      phoneNumber: "",
      socketUrl: "",
      socketPath: "",
    },
    setConfiguration: (payload: {
      userId?: string;
      username?: string;
      phoneNumber?: string;
      socketPath?: string;
      socketUrl?: string;
    }) => {
      set(
        produce<IConfiguration>((draft) => {
          draft.configuration.userId = payload?.userId;
          draft.configuration.username = payload?.username;
          draft.configuration.phoneNumber = payload?.phoneNumber;
          draft.configuration.socketPath = payload?.socketPath;
          draft.configuration.socketUrl = payload?.socketUrl;
        })
      );
    },
  }))
);
