"use client";
import { getStoredSessionAndToken, setSessionAndToken } from "@/common/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfigurationSlice } from "./_store/userslice";
import { MdContentCopy } from "react-icons/md";

export default function Home() {
  const [socketPath, setSocketPath] = useState("");
  const [socketUrl, setSocketUrl] = useState("");
  const router = useRouter();
  const storedData = getStoredSessionAndToken();

  const { configuration } = useConfigurationSlice((state) => ({
    configuration: state.configuration,
  }));

  console.log({ storedData }, configuration?.username);

  const handleConfiguration = () => {
    setSessionAndToken({
      accessToken: storedData?.accessToken,
      refreshToken: storedData?.refreshToken,
      serverBaseUrl: storedData?.serverBaseUrl,
      sessionId: storedData?.sessionId,
      username: storedData?.username,
      socketUrl: socketUrl,
      socketPath: socketPath,
    });
    router.push("/socket");
    console.log({
      socketUrl,
      socketPath,
    });
  };
  return (
    <>
      <div className="flex flex-col gap-20 justify-between py-6 items-center">
        <div className="w-full lg:w-[700px] pb-20 shadow-lg border rounded-md flex flex-col gap-6 py-5 px-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold">Example</h1>
            <div className="flex font-bold items-center text-gray-400 gap-2">
              <span>Socket Url : </span>
              <span className="text-blue-500">
                https://dev-group.marsenger.com
              </span>
              <MdContentCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://dev-group.marsenger.com`
                  );
                }}
              />
            </div>

            <div className="flex font-bold items-center text-gray-400 gap-2">
              <span>Socket Path : </span>
              <span className="text-blue-500">/group-ws/</span>
              <MdContentCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(`/group-ws/`);
                }}
              />
            </div>
          </div>
          <h1 className="font-bold text-xl">Configuration Window</h1>

          <div className="flex flex-col gap-2">
            <label>Socket Url</label>
            <input
              className="p-2 border border-gray-400 rounded-lg"
              type="text"
              value={socketUrl}
              onChange={(e) => {
                setSocketUrl(e?.target?.value);
              }}
              placeholder="Enter socket Url"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>socket Path</label>
            <input
              className="p-2 border border-gray-400 rounded-lg"
              type="text"
              value={socketPath}
              onChange={(e) => {
                setSocketPath(e.target.value);
              }}
              placeholder={`Enter socket Path ( /group-ws/ )`}
            />
          </div>

          <button
            disabled={!socketPath && !socketUrl}
            onClick={() => {
              handleConfiguration();
            }}
            className={`p-2 w-24 ${
              !socketPath && !socketUrl
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 cursor-pointer"
            }  rounded-lg text-white`}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
