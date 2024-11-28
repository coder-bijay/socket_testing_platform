import { CopyContent } from "@/components/CopyContent";
import React from "react";

export const ServerInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <span className="text-[15px] font-bold">Staging server :</span>
        <span className="text-blue-500 text-[14px]">
          https://staging-api.marsenger.com/api/v2/auth/login
        </span>
        <CopyContent content="https://staging-api.marsenger.com/api/v2/auth/login" />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <span className="text-[15px] font-bold">Development server :</span>
        <span className="text-blue-500 text-[14px]">
          https://dev-api.marsenger.com/api/v2/auth/login
        </span>
        <CopyContent content="https://dev-api.marsenger.com/api/v2/auth/login" />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <span className="text-[15px] font-bold">Local server :</span>
        <span className="text-blue-500 text-[14px]">
          https://chat-app.dev/api/v2/auth/login
        </span>
        <CopyContent content="https://chat-app.dev/api/v2/auth/login" />
      </div>
    </div>
  );
};
