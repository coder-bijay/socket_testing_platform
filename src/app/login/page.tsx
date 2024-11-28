"use client";
import React, { useState } from "react";
import { Login } from "./_components/NewFlow/Login";
import { GetOtp } from "./_components/NewFlow/GetOtp";
import { VerifyOtp } from "./_components/NewFlow/VerifyOtp";
import { SignUp } from "./_components/NewFlow/Signup";
import { ServerInfo } from "./_components/ServerInfo";

const LoginPage = () => {
  const [apiResponse, setApiResponse] = useState<{
    hasSignedUp: boolean | null;
    phoneNumber: string;
    code: string;
    verifyOtpSuccess?: boolean | null;
    signUpSuccess?: boolean | null;
  }>({
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
          <GetOtp setApiResponse={setApiResponse} />
          {apiResponse?.code && (
            <VerifyOtp
              apiResponse={apiResponse}
              setApiResponse={setApiResponse}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 p-10 w-full gap-10">
        <Login apiResponse={apiResponse} />
        <SignUp apiResponse={apiResponse} setApiResponse={setApiResponse} />
      </div>
    </div>
  );
};

export default LoginPage;
