"use client";
import React, { useState } from "react";
import { GetOtp } from "./_components/NewFlow/GetOtp";
import { VerifyOtp } from "./_components/NewFlow/VerifyOtp";
import { ServerInfo } from "./_components/ServerInfo";

export interface IData {
  hasSignedUp: boolean | null;
  phoneNumber: string;
  code: string;
  verifyOtpSuccess?: boolean | null;
  signUpSuccess?: boolean | null;
}
const LoginPage = () => {
  const [apiResponse, setApiResponse] = useState<IData>({
    hasSignedUp: null,
    phoneNumber: "",
    code: "",
    verifyOtpSuccess: null,
    signUpSuccess: null,
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="p-10 flex flex-col gap-6">
        <ServerInfo />
        <div
          className={`grid ${
            apiResponse?.code ? "grid-cols-2 w-full" : "grid-cols-1 w-1/2"
          }  gap-10 `}
        >
          {!apiResponse?.code ? (
            <GetOtp setApiResponse={setApiResponse} apiResponse={apiResponse} />
          ) : (
            <VerifyOtp
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
