"use client";
import {
  formatObject,
  formatString,
  generatePayload,
  getStoredSessionAndToken,
} from "@/common/utils";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MdContentCopy } from "react-icons/md";

const storedData = getStoredSessionAndToken();

export const socket = io(`${storedData?.socketUrl}`, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
  upgrade: false,
  path: `${storedData?.socketPath}`,
});

const copyToClipboard = () => {
  const payload = generatePayload();
  const formatedData = formatString(JSON.stringify(payload));
  navigator.clipboard.writeText(`${formatedData}`);
};

function Home() {
  const [connected, setConnected] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [selectedTab, setSelectedTab] = useState<"EMITTED" | "SUBSCRIBE">(
    "EMITTED"
  );

  const [eventName, setEventName] = useState("group:message");
  const [emittedMessage, setEmittedMessage] = useState<any[]>([]);

  const [subscribeEventName, setSubscribeEventName] = useState(
    "group:message-response"
  );
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([]);
  const [subscribedMessage, setSubscribedMessage] = useState<any[]>([]);

  socket.auth = {
    token: `Bearer ${storedData?.accessToken}`,
    sessionId: `${storedData?.sessionId}`,
  };

  const memoizedCallback = useCallback(() => {
    if (connected) {
      subscribedEvents.forEach((item) => {
        socket.off(item);
      });

      subscribedEvents.forEach((item) => {
        const eventListener = (data: any) => {
          setSubscribedMessage((prev) => [...prev, data]);
        };
        socket.on(item, eventListener);
      });
    }
  }, [connected, subscribedEvents, setSubscribedMessage]);

  useEffect(() => {
    memoizedCallback();

    return () => {
      subscribedEvents.forEach((item) => {
        socket.off(item);
      });
    };
  }, [connected, memoizedCallback, subscribedEvents]);

  const sendMessage = (eventName: string) => {
    socket.emit(`${eventName}`, jsonData, (data: any) => {
      setEmittedMessage((prev) => [...prev, data]);
    });
  };

  const handleSubscribe = (eventName: string) => {
    setSubscribedEvents((prev) => [...prev, eventName]);
    setSubscribeEventName("");
  };

  useEffect(() => {
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  console.log({ socket, emittedMessage, subscribedMessage, subscribedEvents });
  console.log({
    jsonData,
  });

  return (
    <>
      <div className="flex justify-center p-10 items-center">
        <div className="flex w-full gap-10">
          <div className="flex flex-col w-1/2 shadow-md rounded-md border p-4 gap-10">
            <div className="flex justify-between  w-full gap-10 items-center border-b-4 border-blue-500 pb-2">
              <div
                className={`h-8 w-8 rounded-full ${
                  connected ? "bg-green-500 animate-pulse" : "bg-red-600"
                }`}
              />
              <div className="flex justify-end items-center gap-6">
                <button
                  title={
                    !eventName
                      ? "Please Enter event name for the socket connection"
                      : ""
                  }
                  disabled={!eventName}
                  onClick={() => {
                    socket.connect();
                    setConnected(true);
                    socket.on("connect", () => {
                      console.log("Socket has been connected!", socket);
                    });
                  }}
                  className={`p-2 bg-green-700 ${
                    !eventName
                      ? "bg-gray-500 cursor-not-allowed"
                      : !connected
                      ? "animate-pulse"
                      : "cursor-not-allowed"
                  } rounded-lg text-white`}
                >
                  {connected ? "Connected" : "Connect"}
                </button>
                {connected && (
                  <button
                    onClick={() => {
                      socket.disconnect();
                      setConnected(false);
                      setEmittedMessage([]);
                      setSubscribedMessage([]);
                      socket.on("disconnect", () => {
                        console.log("Socket has been dis-connected!", socket);
                      });
                    }}
                    className="p-2 bg-red-500 rounded-lg text-white"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            {connected ? (
              <>
                <div className="flex flex-col gap-6 h-fit w-full">
                  <div className="flex w-full gap-6 justify-between items-center">
                    <input
                      className="p-2 w-1/2 border border-gray-400 rounded-lg"
                      type="text"
                      value={subscribeEventName}
                      placeholder="Enter eventName (Ex: group:message-response)"
                      onChange={(e) => {
                        setSubscribeEventName(e.target.value);
                      }}
                    />
                    <div className="w-[340px] justify-end flex items-center gap-6">
                      <button
                        disabled={!subscribeEventName}
                        onClick={() => handleSubscribe(subscribeEventName)}
                        className={`p-2 ${
                          subscribeEventName
                            ? "bg-green-700 cursor-pointer"
                            : "bg-green-300 cursor-not-allowed"
                        } rounded-lg text-white`}
                      >
                        Click to Subscribe
                      </button>

                      {subscribedEvents?.length > 0 && (
                        <button
                          onClick={() => {
                            socket.off(eventName);
                            setSubscribedMessage([]);
                            setSubscribeEventName("");
                            setSubscribedEvents([]);
                          }}
                          className={`p-2  bg-red-500 cursor-pointer rounded-lg text-white`}
                        >
                          UnSubscribe
                        </button>
                      )}
                    </div>
                  </div>
                  <ul className="list-decimal h-[60px] px-6 w-full">
                    <h1 className="font-bold underline">Subscribed events</h1>
                    {subscribedEvents?.map((item: string, index: number) => (
                      <li key={`${index}_${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full flex flex-col gap-6">
                  <div className="flex flex-col w-full gap-2">
                    <label>EventName</label>
                    <input
                      className="p-2 w-full border border-gray-400 rounded-lg"
                      type="text"
                      value={eventName}
                      placeholder=" Enter eventName (Ex: group:message)"
                      onChange={(e) => {
                        setEventName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-col justify-between items-center">
                      <div className="flex flex-row w-full pb-2 justify-between items-center">
                        <label>Payload</label>
                        <span
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          Copy payload
                          <MdContentCopy />
                        </span>
                      </div>

                      <textarea
                        className="p-2 w-full min-h-[200px] border border-gray-400 text-black rounded-lg"
                        onChange={(e) => {
                          const inputValue = e?.target?.value;
                          const abcd = inputValue.trim().replaceAll("\n", "");
                          const payload = JSON.parse(abcd);
                          setJsonData(payload);
                        }}
                        placeholder={`      {
         "messageId": "49d77e97-0c9e-4b3e-b70e-fb433db0b5a3",
          "data": "Hey",
          "createdAt": "2023-11-03T15:30:00Z",
          "groupId": "974c1a3d-b98b-4dee-b67a-da7f858d0dd5"
          }`}
                      />
                    </div>
                  </div>
                  <button
                    disabled={!jsonData}
                    onClick={() => {
                      sendMessage(eventName);
                    }}
                    className={`${
                      !jsonData
                        ? "bg-blue-200 cursor-not-allowed"
                        : "bg-blue-400 cursor-pointer"
                    } p-2 w-24  rounded-lg text-white`}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="w-11/12 flex h-[300px] justify-center text-blue-400 font-bold animate-pulse items-center gap-6 p-10">
                Please Click Connect Button for socket connection
              </div>
            )}
          </div>

          <div className="h-[820px] overflow-y-auto w-1/2 shadow-md rounded-md border p-4">
            <div className="flex justify-between items-center px-10">
              <h1
                onClick={() => setSelectedTab("EMITTED")}
                className={`${
                  selectedTab === "EMITTED" ? "text-blue-500 underline" : ""
                } cursor-pointer font-bold text-xl w-full flex justify-center items-center`}
              >
                Emitted Message
              </h1>
              <h1
                onClick={() => setSelectedTab("SUBSCRIBE")}
                className={`${
                  selectedTab === "SUBSCRIBE" ? "text-blue-500 underline" : ""
                } cursor-pointer font-bold text-xl w-full flex justify-center items-center`}
              >
                Subscribed Message
              </h1>
            </div>
            <div className="my-5 w-full">
              {selectedTab === "EMITTED" && emittedMessage?.length > 0 && (
                <div className="flex flex-col w-full gap-2">
                  {emittedMessage?.map((item: any, index: number) => {
                    const data = formatObject(item);
                    return (
                      <div
                        className="shadow-lg w-full break-all border-2 border-gray-200 rounded-md flex flex-col gap-2 px-3 py-1 mb-2 text-xs"
                        key={`${index}`}
                      >
                        <span className="text-base w-full flex justify-start">
                          {data}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedTab === "SUBSCRIBE" && subscribedMessage?.length > 0 && (
                <div className="flex flex-col w-full gap-2">
                  {subscribedMessage?.map((item: any, index: number) => {
                    const data = formatObject(item);
                    return (
                      <div
                        className="shadow-lg w-full break-all border-2 border-gray-200 rounded-md flex flex-col gap-2 px-3 py-1 mb-2 text-xs"
                        key={`${index}`}
                      >
                        <span className="text-base w-full flex justify-start">
                          {data}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
