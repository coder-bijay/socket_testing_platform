"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import HandleUnauthorizedToken, {
  getStoredSessionAndToken,
} from "@/common/utils";
import { useConfigurationSlice } from "./_store/userslice";

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
                  <div className="flex items-center font-bold w-full justify-end gap-2">
                    <span>Username : </span>
                    <span>
                      {storedData?.username
                        ? storedData?.username
                        : configuration?.username}
                    </span>
                    <div
                      onClick={() => {
                        HandleUnauthorizedToken();
                        window.location.reload();
                      }}
                      className="ml-20 bg-blue-400 text-white rounded-md cursor-pointer px-4 p-2"
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
