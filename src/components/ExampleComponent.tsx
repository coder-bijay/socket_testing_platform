import React from "react";
import { CopyContent } from "./CopyContent";

const socketUrlAndPath = [
  {
    title: "Development Socket Url",
    value: "https://dev-messaging.marsenger.com",
  },

  {
    title: "Local Socket Url",
    value: "https://chat-app.dev",
  },

  {
    title: "Staging Socket Url",
    value: "https://staging-messaging.marsenger.com",
  },
];

export const ExampleComponent = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col p-6 gap-2 shadow-lg border rounded-md">
        <h1 className="text-blue-500 font-bold underline pb-4">Socket</h1>
        {socketUrlAndPath?.map((item, index) => {
          return (
            <div
              className="flex font-bold flex-row items-center text-gray-400 gap-2"
              key={index}
            >
              <span className="text-[15px]">{item.title} : </span>
              <span className="text-blue-500 text-sm">{item.value}</span>
              <CopyContent content={item.value} />
            </div>
          );
        })}
        <div className="flex font-bold flex-row items-center text-gray-400 gap-2">
          <span className="text-[15px]">Socket Path : </span>
          <span className="text-blue-500 text-sm">/ws</span>
          <CopyContent content={`/ws`} />
        </div>
      </div>
    </div>
  );
};
