"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import HandleUnauthorizedToken, {
  getStoredSessionAndToken,
} from "@/common/utils";
import { useConfigurationSlice } from "./_store/userslice";
import { CopyContent } from "@/components/CopyContent";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storedData = getStoredSessionAndToken();

  const { configuration } = useConfigurationSlice((state) => ({
    configuration: state.configuration,
  }));

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col gap-10">
          <div className="h-16 flex flex-row border justify-end shadow-md fixed z-50 bg-white items-center rounded-lg w-full">
            <div className="flex flex-row justify-end items-center px-10 w-full">
              {(storedData?.username || configuration?.username) && (
                <>
                  <div className="flex flex-col w-full">
                    {storedData?.serverBaseUrl && (
                      <div className="flex gap-2">
                        <span className="font-bold text-[14px]">Server : </span>
                        <span className="font-bold text-[14px] text-blue-500 flex gap-2 items-center">
                          {storedData?.serverBaseUrl &&
                            storedData?.serverBaseUrl}
                          <CopyContent
                            content={
                              storedData?.serverBaseUrl
                                ? storedData?.serverBaseUrl
                                : ""
                            }
                          />
                        </span>
                      </div>
                    )}

                    {storedData?.socketUrl && (
                      <div className="flex gap-2">
                        <span className="font-bold text-[14px]">
                          Socket url :
                        </span>
                        <span className="font-bold text-[14px] text-blue-500 flex gap-2 items-center">
                          {storedData?.socketUrl && storedData?.socketUrl}
                          <CopyContent
                            content={
                              storedData?.socketUrl ? storedData?.socketUrl : ""
                            }
                          />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col w-[500px]">
                      {(storedData?.username || configuration?.username) && (
                        <div className="flex gap-2">
                          <span className="font-bold text-[14px]">
                            Username :
                          </span>
                          <span className="font-bold text-[14px] text-blue-500">
                            {storedData?.username
                              ? storedData?.username
                              : configuration?.username}
                          </span>
                        </div>
                      )}

                      {(storedData?.userId || configuration?.userId) && (
                        <div className="flex gap-2">
                          <span className="font-bold text-[14px]">
                            UserId :
                          </span>
                          <span className="font-bold text-[14px] flex gap-2 items-center text-blue-500">
                            {storedData?.userId
                              ? storedData?.userId
                              : configuration?.userId}

                            <CopyContent
                              content={
                                storedData?.userId ||
                                configuration?.userId ||
                                ""
                              }
                            />
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => {
                        HandleUnauthorizedToken();
                        window.location.reload();
                      }}
                      className="bg-blue-500 text-white rounded-md cursor-pointer px-4 p-2"
                    >
                      Logout
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-16">{children}</div>
        </div>
      </body>
    </html>
  );
}
