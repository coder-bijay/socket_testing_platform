"use client";
import {
  formatString,
  generatePayload,
  getStoredSessionAndToken,
  handleSubscribeAllEvents,
} from "@/common/utils";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdCheck,
  MdClose,
  MdContentCopy,
} from "react-icons/md";
import { MessageContainer } from "../../components/MessageContainer";
import { AiOutlineClear } from "react-icons/ai";

const storedData = getStoredSessionAndToken();

export const socket = io(`${storedData?.socketUrl}`, {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
  upgrade: false,
  path: `${storedData?.socketPath}`,
});

const CopyPayload = () => {
  const payload = generatePayload();
  const formatedCopyData = formatString(JSON.stringify(payload));
  navigator.clipboard.writeText(`${formatedCopyData}`);
};

function Home() {
  const [apiCallCount, setApiCallCount] = useState<number>(10);
  const [tempEventName, setTempEventName] = useState("group:message");
  const [tempGroupId, setTempGroupId] = useState("");
  // for the testing

  const [connected, setConnected] = useState(false);
  const [jsonData, setJsonData] = useState("");

  const [eventName, setEventName] = useState("group:message");
  const [emittedMessage, setEmittedMessage] = useState<any[]>([]);

  const [subscribeEventName, setSubscribeEventName] = useState("");
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([]);
  const [subscribedMessage, setSubscribedMessage] = useState<any[]>([]);
  const [showSubscribedList, setShowSubscribedList] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [isCopied]);

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
          setSubscribedMessage((prev) => [{ [item]: data }, ...prev]);
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
      setEmittedMessage((prev) => [{ [eventName]: data }, ...prev]);
    });
  };

  const handleSubscribe = (eventName: string) => {
    if (!subscribedEvents.includes(eventName)) {
      setSubscribedEvents((prev) => [...prev, eventName]);
      setSubscribeEventName("");
    }
  };

  useEffect(() => {
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  console.log({ socket, emittedMessage, subscribedMessage, subscribedEvents });

  const triggerMessage = () => {
    for (let i = 1; i <= apiCallCount; i++) {
      setTimeout(() => {
        socket.emit(
          `${tempEventName}`,
          {
            data: `hello dev - ${i}`,
            iv: `${i}`,
            groupId: tempGroupId,
          },
          (data: any) => {
            setEmittedMessage((prev) => [{ [tempEventName]: data }, ...prev]);
          }
        );
      }, i * 200);
    }
  };

  return (
    <>
      <div className="flex justify-center px-10 py-4 items-center">
        <div className="flex w-full gap-8">
          <div className="flex flex-col w-1/2 shadow-md rounded-md border gap-6">
            <div className="flex justify-between w-full gap-10 items-center rounded-t-md border-b-2 border-blue-200 py-1 px-2">
              <div
                className={`h-5 w-5 rounded-full ${
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
                    setSubscribedEvents(["exception"]);
                    socket.on("connect", () => {
                      console.log("Socket has been connected!", socket);
                    });
                  }}
                  className={`p-1.5 text-sm bg-green-700 ${
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
                      setSubscribedEvents([]);
                      setEmittedMessage([]);
                      setSubscribedMessage([]);
                      socket.on("disconnect", () => {
                        console.log("Socket has been dis-connected!", socket);
                      });
                    }}
                    className="p-1.5 bg-red-500 text-sm rounded-lg text-white"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            {connected ? (
              <>
                <div className="flex flex-col gap-4 mx-2 h-fit bg-gray-200 rounded-md border p-2">
                  <div className="flex w-full gap-10 pb-1 text-sm justify-between border-2 border-b-blue-500 items-center">
                    <input
                      className="p-1.5 w-1/2 border border-gray-400 rounded-lg"
                      type="text"
                      value={subscribeEventName}
                      placeholder="Ex: group:message-response"
                      onChange={(e) => {
                        setSubscribeEventName(e.target.value);
                      }}
                    />

                    <div className="w-1/2 flex items-center justify-end gap-2">
                      <button
                        disabled={!subscribeEventName}
                        onClick={() => handleSubscribe(subscribeEventName)}
                        className={`p-1.5 text-sm ${
                          subscribeEventName
                            ? "bg-green-700 cursor-pointer"
                            : "bg-green-400 cursor-not-allowed"
                        } rounded-lg text-white `}
                      >
                        Click to Subscribe
                      </button>

                      <button
                        onClick={() =>
                          handleSubscribeAllEvents({
                            setSubscribedEvents,
                            subscribedEvents,
                          })
                        }
                        className={`p-1.5 bg-blue-500 cursor-pointer rounded-lg text-white `}
                      >
                        All
                      </button>

                      {!showSubscribedList ? (
                        <MdArrowDropDown
                          onClick={() => setShowSubscribedList((prev) => !prev)}
                          className="h-8 cursor-pointer w-8 text-blue-500"
                        />
                      ) : (
                        <MdArrowDropUp
                          onClick={() => setShowSubscribedList((prev) => !prev)}
                          className="h-8 cursor-pointer w-8 text-blue-500"
                        />
                      )}
                    </div>
                  </div>
                  {showSubscribedList && (
                    <div className="h-[260px] overflow-y-auto">
                      {subscribedEvents?.length > 0 && (
                        <ul className="list-decimal h-[60px] px-6 w-full">
                          <div className="flex gap-4 items-center">
                            <h1 className="font-bold text-[14px] underline">
                              Subscribed events
                            </h1>
                            <span
                              onClick={() => {
                                setSubscribedEvents((prev) => {
                                  // Filter out the provided value
                                  return prev.filter(
                                    (eventName) => eventName === "exception"
                                  );
                                });
                              }}
                              className="flex items-center text-red-400 cursor-pointer"
                            >
                              Clear <AiOutlineClear className="text-red-400" />
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {[...new Set(subscribedEvents)]?.map(
                              (item: string, index: number) => (
                                <div
                                  key={`${index}_${item}`}
                                  className="flex items-center text-[12px] w-full gap-2"
                                >
                                  <li className="w-[85%]">{item}</li>
                                  <MdClose
                                    className="text-white bg-red-500 cursor-pointer"
                                    onClick={() => {
                                      socket.off(eventName);
                                      const indexOfItem =
                                        subscribedEvents.indexOf(item);
                                      const filteredEvents = [
                                        ...subscribedEvents,
                                      ];
                                      filteredEvents.splice(indexOfItem, 1);

                                      setSubscribedEvents(filteredEvents);
                                    }}
                                    title="UnSubscribe"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col px-2 gap-6">
                  <div className="flex flex-col w-full gap-2">
                    <label className="text-sm">EventName</label>
                    <input
                      className="p-2 w-full border text-sm border-gray-400 rounded-lg"
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
                        <label className="text-sm">Payload</label>
                        <span
                          onClick={() => {
                            setIsCopied(true);
                            CopyPayload();
                          }}
                          className="flex text-sm items-center gap-2 cursor-pointer"
                        >
                          Copy payload
                          <span>
                            {isCopied ? (
                              <MdCheck className="text-green-600" />
                            ) : (
                              <MdContentCopy className="cursor-pointer" />
                            )}
                          </span>
                        </span>
                      </div>

                      <textarea
                        className="p-2 w-full min-h-[200px] border border-gray-400 text-sm text-black rounded-lg"
                        defaultValue={""}
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
                    onClick={() => {
                      sendMessage(eventName);
                      CopyPayload();
                    }}
                    className={`
                     cursor-pointer p-2 w-24 bg-blue-500 rounded-lg text-white`}
                  >
                    Send
                  </button>
                </div>

                {/* for the testing  */}

                <div className="flex flex-col gap-1 px-2">
                  <input
                    className="p-2 w-full border text-sm border-gray-400 rounded-lg"
                    type="text"
                    value={tempEventName}
                    placeholder=" Enter temp eventName"
                    onChange={(e) => {
                      setTempEventName(e.target.value);
                    }}
                  />

                  <input
                    className="p-2 w-full border text-sm border-gray-400 rounded-lg"
                    type="text"
                    value={tempGroupId}
                    placeholder=" Enter temp group Id"
                    onChange={(e) => {
                      setTempGroupId(e.target.value);
                    }}
                  />

                  <input
                    className="p-2 w-full border text-sm border-gray-400 rounded-lg"
                    type="number"
                    value={apiCallCount}
                    placeholder=" Enter the message count"
                    onChange={(e) => {
                      console.log("setApiCallCount :::", e.target.value);
                      console.log("apiCalls ::", apiCallCount);
                      setApiCallCount(Number(e.target.value));
                    }}
                  />
                  {tempGroupId && apiCallCount > 0 && (
                    <button
                      onClick={triggerMessage}
                      className={`
                     cursor-pointer p-2 w-24 bg-blue-500 rounded-lg text-white`}
                    >
                      Trigger Messages
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-11/12 flex h-[300px] justify-center text-[14px] text-blue-400 font-bold animate-pulse items-center gap-6 p-10">
                Please Click Connect Button for socket connection
              </div>
            )}
          </div>

          <MessageContainer
            emittedMessage={emittedMessage}
            setEmittedMessage={setEmittedMessage}
            subscribedMessage={subscribedMessage}
            setSubscribedMessage={setSubscribedMessage}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
