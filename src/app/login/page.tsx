"use client";
import React, { useState } from "react";
import { Login } from "./_components/NewFlow/Login";
import { GetOtp } from "./_components/NewFlow/GetOtp";
import { VerifyOtp } from "./_components/NewFlow/VerifyOtp";
import { SignUp } from "./_components/NewFlow/Signup";

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
    <div className="mt-10 flex flex-col gap-6">
      <GetOtp setApiResponse={setApiResponse} />
      {apiResponse?.code && (
        <VerifyOtp apiResponse={apiResponse} setApiResponse={setApiResponse} />
      )}
      {apiResponse?.verifyOtpSuccess === true && (
        <SignUp apiResponse={apiResponse} setApiResponse={setApiResponse} />
      )}
      {<Login />}
    </div>
  );
};

export default LoginPage;
