"use client";
import { JsonViewer } from "@textea/json-viewer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";

export const GetOtp = ({
  setApiResponse,
}: {
  setApiResponse: React.Dispatch<
    React.SetStateAction<{
      hasSignedUp: boolean | null;
      phoneNumber: string;
      code: string;
      verifyOtpSuccess?: boolean | null;
    }>
  >;
}) => {
  const [url, setUrl] = useState(
    "https://dev-api.marsenger.com/api/v2/auth/v2/get-otp"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    data?: {
      otp: string;
      waitTime: number | null;
      timeUnit: string;
      hasSignedUp: boolean | null;
    } | null;
    message: string;
    type: "SUCCESS" | "ERROR" | "";
  }>({
    data: {
      hasSignedUp: null,
      otp: "",
      timeUnit: "",
      waitTime: null,
    },
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
      });

      setResponse({
        data: {
          hasSignedUp: data?.data?.hasSignedUp,
          otp: data?.data?.otp,
          waitTime: data?.data?.waitTime,
          timeUnit: data?.data?.timeUnit,
        },
        message: data.message,
        type: "SUCCESS",
      });
      setApiResponse({
        hasSignedUp: data?.data?.hasSignedUp,
        code: data?.data?.otp,
        phoneNumber,
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
    <div className="w-full justify-center items-center flex">
      <form
        onSubmit={handleSubmit}
        className={` grid grid-cols-1 w-full gap-20 shadow-md border p-6 rounded-lg`}
      >
        <div className="flex flex-col gap-4 w-full text-sm">
          <div className="flex flex-col gap-2 text-sm">
            <label className="w-full">
              Get OTP (
              <span className="text-blue-500 text-sm font-bold">
                Enter the valid phoneNumber To get the OTP.
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
          <div className="flex flex-col gap-2 text-sm">
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

          <button
            disabled={!phoneNumber && loading}
            type="submit"
            className={`p-2 text-sm bg-gray-700 ${
              !phoneNumber && loading
                ? "!bg-blue-300 !cursor-not-allowed"
                : "!bg-blue-600 !cursor-pointer"
            } rounded-lg text-white`}
          >
            {loading ? "Loading..." : "Get OTP"}
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
    </div>
  );
};
