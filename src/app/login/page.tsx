"use client";
import { setSessionAndToken } from "@/common/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useConfigurationSlice } from "../_store/userslice";
import { ErrorMessageContainer } from "../../components/ErrorMessage";
import { CopyContent } from "@/components/CopyContent";

// user1 = "bijay_subedi_dev2",pw:"3Cna0g$1"
// user2 = "bijay_subedi_dev",pw:"3Q#Aq@W9"

const generateRandomWord = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomWord = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomWord += characters[randomIndex];
  }
  return randomWord;
};

const Login = () => {
  const [baseUrl, setBaseUrl] = useState(
    "https://dev-api.marsenger.com/api/v1"
  );
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

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
      const { data } = await axios.post(`${baseUrl}/auth/login`, {
        username,
        password,
        registrationToken: `${randomWord}n1boH6po7f8OBYT1SGGQn:Awao1fEeJPOzzqd2oqg2tflnZ_e1uZF5p4AbbFrVHMOLb6Znh6Uhe_vYxDit41J3KFbzUKYybpLKiwFTEdSq-yRSqFbJsbsQNuV3kF1ACsKUd-lK_8RXFoyAeGCje2vg6D_QMJq3fm6i`,
        deviceId: `${randomWord}2102J20SG::SKQ1.211006.001`,
      });

      setSessionAndToken({
        serverBaseUrl: baseUrl,
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
      setResponseMessage({
        message: err?.response?.data?.message,
        type: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-6 items-center">
      <div className="w-full lg:w-[700px] pb-20 shadow-lg border rounded-md flex flex-col gap-6 py-5 px-10">
        <div className="p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <span className="font-bold">Staging server :</span>
              <span className="text-blue-500">
                https://staging-api.marsenger.com/api/v1
              </span>
              <CopyContent content="https://staging-api.marsenger.com/api/v1" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="font-bold">Development server :</span>
              <span className="text-blue-500">
                https://dev-api.marsenger.com/api/v1
              </span>
              <CopyContent content="https://dev-api.marsenger.com/api/v1" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="font-bold">Local server :</span>
              <span className="text-blue-500">https://chat-app.dev/api/v1</span>
              <CopyContent content="https://chat-app.dev/api/v1" />
            </div>
          </div>
          <h1 className="font-bold text-xl">Login Window</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label>Server Base Url</label>
              <input
                value={baseUrl}
                autoComplete="on"
                className="p-2 border border-gray-400 rounded-lg"
                type="text"
                onChange={(e) => {
                  setBaseUrl(e.target.value);
                }}
                placeholder="Username"
              />
            </div>

            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
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
              className={`p-2 bg-gray-700 ${
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
