"use client";
import { generateDeviceId, generateRandomWord } from "@/common/utils";
import { JsonViewer } from "@textea/json-viewer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";

export const SignUp = ({
  apiResponse,
  setApiResponse,
}: {
  apiResponse: {
    hasSignedUp: boolean | null;
    phoneNumber: string;
    code: string;
    verifyOtpSuccess?: boolean | null;
    signUpSuccess?: boolean | null;
  };
  setApiResponse: React.Dispatch<
    React.SetStateAction<{
      hasSignedUp: boolean | null;
      phoneNumber: string;
      code: string;
      verifyOtpSuccess?: boolean | null;
      signUpSuccess?: boolean | null;
    }>
  >;
}) => {
  const [url, setUrl] = useState(
    "https://dev-api.marsenger.com/api/v2/auth/v2/signup"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    apiResponse?.phoneNumber || ""
  );
  const [deviceId, setDeviceId] = useState(generateDeviceId());

  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    data?: boolean | null;
    message: string;
    type: "SUCCESS" | "ERROR" | "";
  }>({
    data: null,
    message: "",
    type: "SUCCESS",
  });

  const Axios = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "device-id": deviceId,
    },
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

  const randomWord = generateRandomWord();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(url, {
        fullname,
        phoneNumber,
        registrationToken: `${randomWord}n1boH6po7f8OBYT1SGGQn:Awao1fEeJPOzzqd2oqg2tflnZ_e1uZF5p4AbbFrVHMOLb6Znh6Uhe_vYxDit41J3KFbzUKYybpLKiwFTEdSq-yRSqFbJsbsQNuV3kF1ACsKUd-lK_8RXFoyAeGCje2vg6D_QMJq3fm6i`,
      });

      console.log("data ::::", data);
      setResponse({
        data: data.data,
        message: data.message,
        type: "SUCCESS",
      });
      setApiResponse({
        ...apiResponse,
        signUpSuccess: data?.success,
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
        className={` ${
          response.type ? "grid grid-cols-2 w-full" : "flex flex-wrap w-full"
        } gap-20 shadow-md border p-6 rounded-lg`}
      >
        <div className="flex flex-col gap-4 w-full text-sm">
          <h1 className="font-bold text-2xl w-full text-center  text-blue-700">
            Signup Window
          </h1>
          <div className="flex flex-col gap-2 text-sm">
            <label className="w-full">
              Signup (
              <span className="text-blue-500 text-sm font-bold">
                Enter the you fullname.
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
          <div className="flex flex-row gap-6 items-center">
            <div className="flex flex-col gap-2 text-sm w-full">
              <label>Full name</label>
              <div className="flex relative w-full">
                <input
                  autoComplete="on"
                  className="p-2 border border-gray-400 rounded-lg w-full"
                  type="text"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                  }}
                  placeholder="full name"
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
            {loading ? "Loading..." : "Signup"}
          </button>
        </div>
        {response?.type && (
          <div className="flex flex-col w-full h-[400px] overflow-y-scroll gap-4">
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
