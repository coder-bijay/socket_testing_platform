"use client";
import { JsonViewer } from "@textea/json-viewer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { IData } from "../../page";
import { useConfigurationSlice } from "@/app/_store/userslice";
import { Login } from "./Login";
import { SignUp } from "./Signup";

export const VerifyOtp = ({
  apiResponse,
  setApiResponse,
}: {
  apiResponse: IData;
  setApiResponse: React.Dispatch<React.SetStateAction<IData>>;
}) => {
  const [url, setUrl] = useState(
    "https://dev-api.marsenger.com/api/v2/auth/v2/verify-otp"
  );

  const [phoneNumber, setPhoneNumber] = useState(
    apiResponse?.phoneNumber || ""
  );

  const [otp, setOtp] = useState(apiResponse?.code || "");
  const [type, setType] = useState(
    apiResponse?.hasSignedUp === true
      ? "LOGIN"
      : apiResponse?.hasSignedUp === false
      ? "SIGNUP"
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    data?: boolean | null;
    message: string;
    type: "SUCCESS" | "ERROR" | "";
  }>({
    data: null,
    message: "",
    type: "",
  });

  const Axios = axios.create({
    withCredentials: false,
    headers: {},
    baseURL: url,
  });

  useEffect(() => {
    return () => {
      setResponse({
        data: null,
        message: "",
        type: "",
      });
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(url, {
        phoneNumber,
        otp,
        type,
      });

      setResponse({
        data: data.data,
        message: data.message,
        type: "SUCCESS",
      });
      setApiResponse({
        ...apiResponse,
        verifyOtpSuccess: data?.success,
      });
    } catch (err: any) {
      console.log(err);
      if (err.response && err.response.status === 404) {
        setResponse({
          message: "404 - Api not found",
          type: "ERROR",
        });
      } else {
        setResponse({
          message: err?.response?.data?.message || "An error occurred",
          type: "ERROR",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full justify-center items-center flex flex-col">
      <form
        onSubmit={handleSubmit}
        className={` 
          grid grid-cols-1 w-full gap-10 shadow-md border p-6 rounded-lg`}
      >
        <div className="flex flex-col gap-4 w-full text-sm">
          <div className="flex flex-row gap-6 items-center w-full">
            <div className="flex flex-col gap-2 text-sm w-full">
              <label className="w-full">
                Verify OTP (
                <span className="text-blue-500 text-sm font-bold">
                  Enter the valid OTP code to verify the OTP.
                </span>
                )
              </label>
              <input
                value={url}
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                placeholder="Please specify the login url"
              />
            </div>
            <div className="flex flex-col gap-2 text-sm w-full">
              <label>Phone Number</label>
              <div className="flex relative w-full">
                <input
                  autoComplete="on"
                  className="p-2 border border-gray-400 rounded-lg w-full"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  placeholder="+9779811558820"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <div className="flex flex-col gap-2 text-sm w-full">
              <label>OTP Code</label>
              <div className="flex relative w-full">
                <input
                  autoComplete="on"
                  className="p-2 border border-gray-400 rounded-lg w-full"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  placeholder="37492"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm w-full">
              <label>Type</label>
              <div className="flex relative w-full">
                <input
                  autoComplete="on"
                  className="p-2 border border-gray-400 rounded-lg w-full"
                  type="text"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  placeholder="SIGNUP || LOGIN "
                />
              </div>
            </div>
          </div>

          <button
            disabled={!phoneNumber && loading}
            type="submit"
            className={`p-2 text-sm bg-gray-700 ${
              !phoneNumber && loading
                ? "!bg-blue-300 !cursor-not-allowed"
                : "!bg-blue-600 !cursor-pointer"
            } rounded-lg text-white`}
          >
            {loading ? "Loading..." : "Verify OTP"}
          </button>
        </div>
        {response?.type && (
          <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-10">
              <label className="font-bold">Response:</label>
              <span
                onClick={() =>
                  setResponse({
                    message: "",
                    type: "",
                    data: null,
                  })
                }
                className="flex items-center text-red-400 cursor-pointer"
              >
                Clear <AiOutlineClear className="text-red-400" />
              </span>
            </div>
            <JsonViewer value={response} rootName={false} />
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 w-full gap-10 mt-6">
        {apiResponse?.phoneNumber &&
        apiResponse?.verifyOtpSuccess &&
        apiResponse?.hasSignedUp === true ? (
          <Login apiResponse={apiResponse} />
        ) : (
          apiResponse?.hasSignedUp === false &&
          apiResponse?.verifyOtpSuccess && (
            <SignUp apiResponse={apiResponse} setApiResponse={setApiResponse} />
          )
        )}
      </div>
    </div>
  );
};
