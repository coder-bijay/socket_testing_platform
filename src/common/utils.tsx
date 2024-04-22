import cookies from "js-cookie";

export const setSessionAndToken = ({
  serverBaseUrl,
  accessToken,
  refreshToken,
  sessionId,
  socketUrl,
  socketPath,
  username,
}: {
  serverBaseUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  sessionId?: string;
  socketUrl?: string;
  socketPath?: string;
  username?: string;
}) => {
  serverBaseUrl && cookies.set("baseUrl", serverBaseUrl);
  accessToken && cookies.set("token", accessToken);
  refreshToken && cookies.set("refreshToken", refreshToken);
  sessionId && cookies.set("sessionId", sessionId);
  socketUrl && cookies.set("socketUrl", socketUrl);
  socketPath && cookies.set("socketPath", socketPath);
  username && cookies.set("username", username);
};

export function getStoredSessionAndToken() {
  let serverBaseUrl: string | undefined;
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let sessionId: string | undefined;
  let socketUrl: string | undefined;
  let socketPath: string | undefined;
  let username: string | undefined;

  if (typeof window !== "undefined") {
    serverBaseUrl = cookies.get("baseUrl");
    accessToken = cookies.get("token");
    refreshToken = cookies.get("refreshToken");
    sessionId = cookies.get("sessionId");
    socketUrl = cookies.get("socketUrl");
    socketPath = cookies.get("socketPath");
    username = cookies.get("username");

    return {
      serverBaseUrl,
      accessToken,
      refreshToken,
      sessionId,
      socketUrl,
      socketPath,
      username,
    };
  }
}

export function formatObject(object: any) {
  return (
    <>
      <div>
        {object &&
          Object?.entries(object).map(([key, value]) => (
            <div key={key}>
              <span>{key}: </span>
              {typeof value === "object" ? (
                formatObject(value)
              ) : (
                <span>{JSON.stringify(value)}</span>
              )}
              <br />
            </div>
          ))}
      </div>
    </>
  );
}
