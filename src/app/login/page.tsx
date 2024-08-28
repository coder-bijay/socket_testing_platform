"use client";
import {
  generateDeviceId,
  generateRandomWord,
  setSessionAndToken,
} from "@/common/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useConfigurationSlice } from "../_store/userslice";
import { ErrorMessageContainer } from "../../components/ErrorMessage";
import { CopyContent } from "@/components/CopyContent";
import { BiRefresh } from "react-icons/bi";

// user1 = "bijay_subedi_dev2",pw:"3Cna0g$1"
// user2 = "bijay_subedi_dev",pw:"3Q#Aq@W9"

const Login = () => {
  const [loginUrl, setLoginUrl] = useState(
    "https://dev-api.marsenger.com/api/v2/auth/login"
  );
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
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
  const { setConfiguration } = useConfigurationSlice((state: any) => ({
    setConfiguration: state.setConfiguration,
  }));

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
        username,
        password,
        registrationToken: `${randomWord}n1boH6po7f8OBYT1SGGQn:Awao1fEeJPOzzqd2oqg2tflnZ_e1uZF5p4AbbFrVHMOLb6Znh6Uhe_vYxDit41J3KFbzUKYybpLKiwFTEdSq-yRSqFbJsbsQNuV3kF1ACsKUd-lK_8RXFoyAeGCje2vg6D_QMJq3fm6i`,
      });

      setSessionAndToken({
        serverBaseUrl: loginUrl.split("/api/")[0] || loginUrl,
        loginUrl: loginUrl,
        accessToken: data?.data?.accessToken,
        refreshToken: data?.data?.refreshToken,
        sessionId: data?.data?.sessionId,
        username: data?.data?.user?.username,
        userId: data?.data?.user?.id,
        socketUrl: "",
        socketPath: "",
      });

      setConfiguration({
        username: data?.data?.user?.username,
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
      <div className="w-full lg:w-[800px] pb-20 shadow-lg border rounded-md flex flex-col gap-6 py-5 px-10">
        <div className="p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <span className="text-[15px] font-bold">Staging server :</span>
              <span className="text-blue-500 text-[14px]">
                https://staging-api.marsenger.com/api/v2/auth/login
              </span>
              <CopyContent content="https://staging-api.marsenger.com/api/v2/auth/login" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-[15px] font-bold">
                Development server :
              </span>
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
          <h1 className="font-bold text-xl">Login Window</h1>
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
              <label>Username</label>
              <input
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setusername(e.target.value);
                }}
                placeholder="Username"
              />
            </div>
            <div className="flex flex-col gap-2 text-sm">
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
            </div>

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
              disabled={!username && !password && loading}
              type="submit"
              className={`p-2 text-sm bg-gray-700 ${
                !username && !password && loading
                  ? "!bg-blue-300 !cursor-not-allowed"
                  : "!bg-blue-600 !cursor-pointer"
              } rounded-lg text-white`}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
