import { JsonViewer } from "@textea/json-viewer";
import React from "react";
import { AiOutlineClear } from "react-icons/ai";

export const MessageContainer = ({
  subscribedMessage,
  setSubscribedMessage,
  emittedMessage,
  setEmittedMessage,
}: {
  subscribedMessage: any;
  setSubscribedMessage: any;
  emittedMessage: any;
  setEmittedMessage: any;
}) => {
  return (
    <>
      <div className="h-full lg:h-[830px] pb-2 overflow-y-auto w-full shadow-md rounded-md border py-2">
        <div className="grid grid-cols-2">
          <div
            className={`border-b-2 border-blue-200 w-full flex justify-center gap-10 items-center`}
          >
            <span className="font-bold text-[13px]"> Emitted Message</span>
            {emittedMessage?.length > 0 ? (
              <span
                onClick={() => setEmittedMessage([])}
                className="flex items-center text-red-400 cursor-pointer"
              >
                Clear <AiOutlineClear className="text-red-400" />
              </span>
            ) : null}
          </div>
          <div
            className={`border-b-2 border-blue-200 w-full flex justify-center gap-10 items-center`}
          >
            <span className="font-bold text-[13px]">Subscribed Message</span>
            {subscribedMessage?.length > 0 ? (
              <span
                onClick={() => setSubscribedMessage([])}
                className="flex items-center text-red-400 cursor-pointer"
              >
                Clear <AiOutlineClear className="text-red-400" />
              </span>
            ) : null}
          </div>
          <div className="m-2 pr-6 overflow-y-auto h-[770px] border-r-2 border-gray-300">
            {emittedMessage?.map((item: any, index: number) => {
              return (
                <div
                  className="w-full break-all border border-gray-200 rounded-md flex flex-col gap-2 px-3 py-1 mb-1 text-[12px]"
                  key={`${index}`}
                >
                  <JsonViewer value={item} rootName={false} />
                </div>
              );
            })}
          </div>
          <div className="m-2 overflow-y-auto h-[770px]">
            {subscribedMessage?.map((item: any, index: number) => {
              return (
                <div
                  className="w-full break-all border border-gray-200 rounded-md flex flex-col gap-2 px-3 py-1 mb-1 text-[12px]"
                  key={`${index}`}
                >
                  <JsonViewer value={item} rootName={false} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
