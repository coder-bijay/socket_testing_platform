"use client";
import { getStoredSessionAndToken, setSessionAndToken } from "@/common/utils";
import { ExampleComponent } from "@/components/ExampleComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdContentCopy } from "react-icons/md";

export default function Home() {
  const [socketPath, setSocketPath] = useState("");
  const [socketUrl, setSocketUrl] = useState("");
  const router = useRouter();
  const storedData = getStoredSessionAndToken();

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
  };
  return (
    <>
      <div className="flex flex-col gap-20 justify-between p-6 px-20 items-center">
        <div className="w-full pb-20 shadow-lg border rounded-md flex flex-col gap-6 py-5 px-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold">Examples</h1>
            <ExampleComponent />
          </div>
          <div className="mt-10 flex flex-col gap-6">
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
      </div>
    </>
  );
}
