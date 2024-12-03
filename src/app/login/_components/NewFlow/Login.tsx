"use client";
import {
  generateDeviceId,
  generateRandomWord,
  setSessionAndToken,
} from "@/common/utils/general";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { useConfigurationSlice } from "@/app/_store/userslice";
import { ErrorMessageContainer } from "@/components/ErrorMessage";

export const Login = ({
  apiResponse,
}: {
  apiResponse: {
    hasSignedUp: boolean | null;
    phoneNumber: string;
    code: string;
    verifyOtpSuccess?: boolean | null;
    signUpSuccess?: boolean | null;
  };
}) => {
  const [loginUrl, setLoginUrl] = useState(
    "https://dev-api.marsenger.com/api/v2/auth/v2/login"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    apiResponse?.phoneNumber || "+9779811558820"
  );

  const { setConfiguration } = useConfigurationSlice((state: any) => ({
    setConfiguration: state.setConfiguration,
  }));

  const [deviceId, setDeviceId] = useState(generateDeviceId());

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{
    message: string;
    type: "SUCCESS" | "ERROR" | "";
  }>({
    message: "",
    type: "SUCCESS",
  });
  const router = useRouter();

  const randomWord = generateRandomWord();

  const Axios = axios.create({
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "device-id": deviceId,
    },
    baseURL: loginUrl,
  });

  useEffect(() => {
    return () => {
      setResponseMessage({
        message: "",
        type: "",
      });
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post(loginUrl, {
        phoneNumber,
        registrationToken: randomWord,
      });

      setSessionAndToken({
        serverBaseUrl: loginUrl.split("/api/")[0] || loginUrl,
        loginUrl: loginUrl,
        accessToken: data?.data?.accessToken,
        refreshToken: data?.data?.refreshToken,
        sessionId: data?.data?.sessionId,
        username: `${data?.data?.user?.fullname} (${data?.data?.user?.phoneNumber})`,
        userId: data?.data?.user?.id,
        socketUrl: "",
        socketPath: "",
      });

      setConfiguration({
        username: data?.data?.user?.fullname,
      });
      setResponseMessage({
        message: "Successfully Logged in",
        type: "SUCCESS",
      });
      router.push("/");
    } catch (err: any) {
      console.log(err);
      if (err.response && err.response.status === 404) {
        setResponseMessage({
          message: "404 - Api not found",
          type: "ERROR",
        });
      } else {
        setResponseMessage({
          message: err?.response?.data?.message || "An error occurred",
          type: "ERROR",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-6 items-center">
      <div className="w-full pb-10 shadow-lg border rounded-md flex flex-col gap-6 py-8 px-10">
        <h1 className="font-bold text-2xl w-full text-center  text-blue-700">
          Login Window
        </h1>
        <div className="px-10 pb-10 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm">
              <label className="w-full">
                Login Url (
                <span className="text-blue-500 text-sm font-bold">
                  Please specify the login URL for requesting access.
                </span>
                )
              </label>
              <input
                value={loginUrl}
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setLoginUrl(e.target.value);
                }}
                placeholder="Please specify the login url"
              />
              <div className="flex flex-col gap-2 text-sm">
                <label>Headers (device-id)</label>
                <div className="flex relative w-full">
                  <input
                    autoComplete="on"
                    className="p-2 border border-gray-400 rounded-lg w-full"
                    type="text"
                    value={deviceId}
                    onChange={(e) => {
                      setDeviceId(e.target.value);
                    }}
                    placeholder="Password"
                  />
                  <BiRefresh
                    onClick={() => {
                      const device = generateDeviceId();
                      setDeviceId(device);
                    }}
                    className="absolute right-2 cursor-pointer top-2 w-6 h-6"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <label>Phone Number</label>
              <input
                value={phoneNumber}
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                placeholder="+9779811558820"
              />
            </div>
            {/* <div className="flex flex-col gap-2 text-sm">
              <label>Password</label>
              <input
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                placeholder="Password"
              />
            </div> */}

            {responseMessage?.message && (
              <ErrorMessageContainer
                type={responseMessage?.type}
                message={responseMessage?.message}
                onClose={() =>
                  setResponseMessage({
                    message: "",
                    type: "",
                  })
                }
              />
            )}

            <button
              disabled={!phoneNumber && loading}
              type="submit"
              className={`p-2 text-sm bg-gray-700 ${
                !phoneNumber && loading
                  ? "!bg-blue-300 !cursor-not-allowed"
                  : "!bg-blue-600 !cursor-pointer"
              } rounded-lg text-white`}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            {/* <button
              disabled={!username && !password && loading}
              type="submit"
              className={`p-2 text-sm bg-gray-700 ${
                !username && !password && loading
                  ? "!bg-blue-300 !cursor-not-allowed"
                  : "!bg-blue-600 !cursor-pointer"
              } rounded-lg text-white`}
            >
              {loading ? "Loading..." : "Submit"}
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};
