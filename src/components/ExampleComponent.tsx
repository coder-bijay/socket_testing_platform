import React from "react";
import { MdContentCopy } from "react-icons/md";

const channel = [
  {
    title: "Development Socket Url",
    value: "https://dev-channel.marsenger.com",
  },
  {
    title: "Development Socket Path",
    value: "/channel-ws",
  },
  {
    title: "Staging Socket Url",
    value: "https://staging-channel.marsenger.com",
  },
  {
    title: "Staging Socket Path",
    value: "/channel-ws",
  },
];

const p2p = [
  {
    title: "Development Socket Url",
    value: "https://dev-chat.marsenger.com",
  },
  {
    title: "Development Socket Path",
    value: "/p2p-ws",
  },
  {
    title: "Staging Socket Url",
    value: "https://staging-chat.marsenger.com",
  },
  {
    title: "Staging Socket Path",
    value: "/p2p-ws",
  },
];

const Group = [
  {
    title: "Development Socket Url",
    value: "https://dev-group.marsenger.com",
  },
  {
    title: "Development Socket Path",
    value: "/group-ws",
  },
  {
    title: "Staging Socket Url",
    value: "https://staging-group.marsenger.com",
  },
  {
    title: "Staging Socket Path",
    value: "/group-ws",
  },
];

console.log("Test Build");

export const ExampleComponent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2 shadow-lg border rounded-md p-2">
        <h1 className="text-blue-500 font-bold underline pb-4">Group</h1>
        {Group?.map((item, index) => {
          return (
            <div
              className="flex font-bold flex-row items-center text-gray-400 gap-2"
              key={index}
            >
              <span>{item.title} : </span>
              <span className="text-blue-500">{item.value}</span>
              <MdContentCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(item.value);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 shadow-lg border rounded-md p-2">
        <h1 className="text-blue-500 font-bold underline pb-4">P2P</h1>
        {p2p?.map((item, index) => {
          return (
            <div
              className="flex font-bold flex-row items-center text-gray-400 gap-2"
              key={index}
            >
              <span>{item.title} : </span>
              <span className="text-blue-500">{item.value}</span>
              <MdContentCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(item.value);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 shadow-lg border rounded-md p-2">
        <h1 className="text-blue-500 font-bold underline pb-4">Channel</h1>
        {channel?.map((item, index) => {
          return (
            <div
              className="flex font-bold flex-row items-center text-gray-400 gap-2"
              key={index}
            >
              <span>{item.title} : </span>
              <span className="text-blue-500">{item.value}</span>
              <MdContentCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(item.value);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
