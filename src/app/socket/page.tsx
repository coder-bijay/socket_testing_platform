"use client";
import { formatObject, getStoredSessionAndToken } from "@/common/utils";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MdContentCopy } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const storedData = getStoredSessionAndToken();

export const socket = io(`${storedData?.socketUrl}`, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
  upgrade: false,
  path: `${storedData?.socketPath}`,
});

const generatePayload = () => {
  const payload = {
    messageId: uuidv4(),
    data: "Hey",
    createdAt: new Date().toISOString(),
    groupId: "b4001aa5-0a75-43a8-b706-cbd8505b5670",
  };
  return payload;
};

const copyToClipboard = () => {
  const payload = generatePayload();
  navigator.clipboard.writeText(JSON.stringify(payload));
};

function Home() {
  const [connected, setConnected] = useState(false);
  const [jsonData, setJsonData] = useState("");

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
      socket.on(subscribeEventName, (data: any) => {
        setSubscribedMessage((prev) => [...prev, data]);
      });
    }
  }, [connected, subscribeEventName]);

  useEffect(() => {
    memoizedCallback();
  }, [connected, memoizedCallback]);

  const sendMessage = (eventName: string) => {
    socket.emit(`${eventName}`, jsonData, (data: any) => {
      setEmittedMessage((prev) => [...prev, data]);
    });
    setJsonData("");
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

  return (
    <>
      <div className="flex justify-center lg:p-10 items-center">
        <div className="flex flex-col w-full lg:w-3/4 shadow-md border rounded-md gap-10 justify-between p-6 items-center">
          <div className="flex w-full flex-col gap-8 items-center">
            <div className="flex justify-between  w-full gap-10 items-center border-b-4 border-blue-500 pb-2">
              <div
                className={`h-8 w-8 rounded-full ${
                  connected ? "bg-green-500 animate-pulse" : "bg-red-600"
                }`}
              />
              <div className="flex justify-end items-center gap-6">
                <div className="flex flex-row items-center w-full gap-2">
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
                    DisConnect
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex w-full gap-6 justify-between items-center">
                <input
                  className="p-2 w-3/4 border border-gray-400 rounded-lg"
                  type="text"
                  value={subscribeEventName}
                  placeholder="Enter subscribe eventName (Ex: group:message-response)"
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
          </div>

          {connected ? (
            <>
              <div className="w-full flex flex-col gap-6 py-10">
                <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-col justify-between items-center">
                    <div className="flex flex-row w-full pb-2 justify-between items-center">
                      <label>Payload</label>
                      <span className="flex items-center gap-2">
                        Copy payload
                        <MdContentCopy
                          className="cursor-pointer"
                          onClick={copyToClipboard}
                        />
                      </span>
                    </div>

                    <textarea
                      className="p-2 w-full h-[200px] border border-gray-400 text-black rounded-lg"
                      onChange={(e) => {
                        const inputValue = e?.target?.value;
                        const abcd = inputValue.trim().replaceAll("\n", "");
                        const payload = JSON.parse(abcd);
                        setJsonData(payload);
                      }}
                      placeholder={`
                {
                  "messageId": "49d77e97-0c9e-4b3e-b70e-fb433db0b5a3",
                  "data": "Hey",
                  "createdAt": "2023-11-03T15:30:00Z",
                  "groupId": "b4001aa5-0a75-43a8-b706-cbd8505b5670"
                }`}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    sendMessage(eventName);
                  }}
                  className={`p-2 w-24 bg-blue-400 rounded-lg text-white`}
                >
                  Send
                </button>
              </div>

              <div className="grid grid-cols-2 w-full gap-10">
                <div className="flex flex-col w-full gap-2">
                  <h1 className="font-bold text-xl w-full flex justify-center items-center underline">
                    Emitted Message
                  </h1>
                  {emittedMessage?.length > 0 &&
                    emittedMessage?.map((item: any, index: number) => {
                      const data = formatObject(item);
                      return (
                        <div
                          className="shadow-lg w-[600px] break-all  border rounded-md flex flex-col gap-2 px-3 py-1"
                          key={`${index}`}
                        >
                          <span className="text-base w-full flex justify-start">
                            {data}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div className="flex flex-col w-full gap-2">
                  <h1 className="font-bold text-xl w-full flex justify-center items-center underline">
                    Subscribed Message
                  </h1>
                  {subscribedMessage?.length > 0 &&
                    subscribedMessage?.map((item: any, index: number) => {
                      const data = formatObject(item);
                      return (
                        <div
                          className="shadow-lg w-[600px] break-all  border rounded-md flex flex-col gap-2 px-3 py-1"
                          key={`${index}`}
                        >
                          <span className="text-base w-full flex justify-start">
                            {data}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <div className="w-11/12 flex justify-center items-center gap-6 p-10">
              Please Click Connect Button for socket connection
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
