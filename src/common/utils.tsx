import cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const setSessionAndToken = ({
  serverBaseUrl,
  loginUrl,
  accessToken,
  refreshToken,
  sessionId,
  socketUrl,
  socketPath,
  username,
  userId,
}: {
  serverBaseUrl?: string;
  accessToken?: string;
  loginUrl?: string;
  refreshToken?: string;
  sessionId?: string;
  socketUrl?: string;
  socketPath?: string;
  username?: string;
  userId?: string;
}) => {
  serverBaseUrl && cookies.set("baseUrl", serverBaseUrl);
  loginUrl && cookies.set("loginUrl", loginUrl);
  accessToken && cookies.set("token", accessToken);
  refreshToken && cookies.set("refreshToken", refreshToken);
  sessionId && cookies.set("sessionId", sessionId);
  socketUrl && cookies.set("socketUrl", socketUrl);
  socketPath && cookies.set("socketPath", socketPath);
  username && cookies.set("username", username);
  userId && cookies.set("userId", userId);
};

export function getStoredSessionAndToken() {
  let serverBaseUrl: string | undefined;
  let loginUrl: string | undefined;
  let accessToken: string | undefined;
  let refreshToken: string | undefined;
  let sessionId: string | undefined;
  let socketUrl: string | undefined;
  let socketPath: string | undefined;
  let username: string | undefined;
  let userId: string | undefined;

  if (typeof window !== "undefined") {
    serverBaseUrl = cookies.get("baseUrl");
    loginUrl = cookies.get("loginUrl");
    accessToken = cookies.get("token");
    refreshToken = cookies.get("refreshToken");
    sessionId = cookies.get("sessionId");
    socketUrl = cookies.get("socketUrl");
    socketPath = cookies.get("socketPath");
    username = cookies.get("username");
    userId = cookies.get("userId");

    return {
      serverBaseUrl,
      loginUrl,
      accessToken,
      refreshToken,
      sessionId,
      socketUrl,
      socketPath,
      username,
      userId,
    };
  }
}

export default function HandleUnauthorizedToken() {
  cookies.remove("username");
  cookies.remove("userId");
  cookies.remove("token");
  cookies.remove("refreshToken");
  cookies.remove("sessionId");
  cookies.remove("socketPath");
  cookies.remove("socketUrl");
  cookies.remove("loginUrl");
  cookies.remove("baseUrl");
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

export const formatString = (originalString: any) => {
  try {
    const obj = JSON.parse(originalString);
    let formatted = "";
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      formatted += `"${key}":"${obj[key]}"`;
      if (index < keys.length - 1) {
        formatted += ",\n";
      }
    });
    return `{${formatted}}`;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};

export const generatePayload = () => {
  const payload = {
    messageId: uuidv4(),
    data: "Hey",
    createdAt: new Date().toISOString(),
    groupId: "ab775113-8e44-4a90-bada-784cd9b59111",
  };
  return payload;
};

export const subscribeEventList = {
  // p2p
  MESSAGE_RESPONSE: "message-response",
  MESSAGE_REACT_RESPONSE: "message:react-response",
  MESSAGE_HISTORY_RESPONSE: "message:history-response",
  MESSAGE_TYPING_RESPONSE: "message:typing-response",
  MESSAGE_PIN_RESPONSE: "message:pin-response",
  MESSAGE_UNPIN_RESPONSE: "message:unpin-response",
  MESSAGE_READ_RESPONSE: "message:read-response",
  MESSAGE_REPLY_RESPONSE: "message:reply-response",
  MESSAGE_DELETE_RESPONSE: "message:delete-response",
  MESSAGE_DELETE_FOR_ME_RESPONSE: "message:delete-for-me-response",
  MESSAGE_ACTION_RESPONSE: "message:action-response",
  MESSAGE_EDIT_RESPONSE: "message:edit-response",
  MESSAGE_RECEIVED_RESPONSE: "message:received-response",

  // others
  USER_UPDATE_RESPONSE: "user:update-response",
  PROFILE_UPDATE_RESPONSE: "profile:update-response",
  STATUS_UPDATE_RESPONSE: "status:update-response",
  ONLINE_FRIENDS_RESPONSE: "online:friends-response",

  // channel
  CHANNEL_MESSAGE_RESPONSE: "channel:message-response",
  CHANNEL_USER_UPDATE_RESPONSE: "channel-user:update-response",
  CHANNEL_PROFILE_UPDATE_RESPONSE: "channel-profile:update-response",
  CHANNEL_CREATE_RESPONSE: "channel:create-response",
  CHANNEL_ADD_MEMBER_RESPONSE: "channel:add-member-response",
  CHANNEL_NEW_MEMBER_RESPONSE: "channel:new-member-response",
  CHANNEL_EDIT_RESPONSE: "channel:edit-response",
  CHANNEL_DELETE_RESPONSE: "channel:delete-response",
  CHANNEL_JOIN_RESPONSE: "channel:join-response",
  CHANNEL_LEAVE_RESPONSE: "channel:leave-response",
  CHANNEL_REMOVE_RESPONSE: "channel:remove-response",
  CHANNEL_REACTION_STATUS_RESPONSE: "channel:reaction-status-response",
  CHANNEL_ANONYMOUS_USER_RESPONSE: "channel:anonymous-user-response",
  CHANNEL_PERMISSION_SETTING_UPDATE_RESPONSE:
    "channel-permission-setting:update-response",
  CHANNEL_MUTED_RESPONSE: "channel:muted-response",
  CHANNEL_MUTED_UNTIL_RESPONSE: "channel:muted-until-response",
  CHANNEL_MESSAGE_DELETE_RESPONSE: "channel:message-delete-response",
  CHANNEL_MESSAGE_EDIT_RESPONSE: "channel:message-edit-response",
  CHANNEL_MESSAGE_REPLY_RESPONSE: "channel:message-reply-response",
  CHANNEL_MESSAGE_REACT_RESPONSE: "channel:message-react-response",
  CHANNEL_MESSAGE_PIN_RESPONSE: "channel:message-pin-response",
  CHANNEL_MESSAGE_REPLY_DELETE_RESPONSE: "channel:reply-delete-for-me-response",
  CHANNEL_MESSAGE_REPLY_DELETE_EVERYONE_RESPONSE:
    "channel:reply-delete-for-everyone-response",

  // group
  GROUP_CREATED_RESPONSE: "group:created-response",
  GROUP_ADD_MEMBER_RESPONSE: "group:add-member-response",
  GROUP_NEW_MEMBER_RESPONSE: "group:new-member-response",
  GROUP_UPDATE_RESPONSE: "group:update-response",
  GROUP_LEAVE_RESPONSE: "group:leave-response",
  GROUP_DELETE_RESPONSE: "group:delete-response",
  GROUP_REMOVE_RESPONSE: "group:remove-response",
  GROUP_ASSIGN_ROLE_RESPONSE: "group:assign-role-response",
  GROUP_REACTION_STATUS_RESPONSE: "group:reaction-status-response",
  GROUP_ANONYMOUS_USER_RESPONSE: "group:anonymous-user-response",
  GROUP_MUTED_RESPONSE: "group:muted-response",
  GROUP_MUTED_UNTIL_RESPONSE: "group:muted-until-response",
  GROUP_BLOCKED_MEMBER_RESPONSE: "group:blocked-member-response",
  GROUP_PERMISSION_SETTING_UPDATE_RESPONSE:
    "group-permission-setting:update-response",
  GROUP_BLACKLIST_MEMBER_RESPONSE: "group:blacklist-member-response",
  GROUP_REMOVE_BLACKLIST_MEMBER_RESPONSE:
    "group:remove-blacklist-member-response",
  GROUP_USER_UPDATE_RESPONSE: "group-user:update-response",
  GROUP_PROFILE_UPDATE_RESPONSE: "group-profile:update-response",
  GROUP_MESSAGE_RESPONSE: "group:message-response",
  GROUP_MESSAGE_REPLY_RESPONSE: "group:message-reply-response",
  GROUP_MESSAGE_REACT_RESPONSE: "group:message-react-response",
  GROUP_MESSAGE_RECEIVED_RESPONSE: "group:message-received-response",
  GROUP_HISTORY_RESPONSE: "group:history-response",
  GROUP_MESSAGE_TYPING_RESPONSE: "group:message-typing-response",
  GROUP_MESSAGE_READ_RESPONSE: "group:message-read-response",
  GROUP_MESSAGE_DELETE_RESPONSE: "group:message-delete-response",
  GROUP_MESSAGE_DELETE_FOR_ME_RESPONSE: "group:message-delete-for-me-response",
  GROUP_MESSAGE_EDIT_RESPONSE: "group:message-edit-response",
  GROUP_MESSAGE_PIN_RESPONSE: "group:message-pin-response",
};

export const handleSubscribeAllEvents = ({
  setSubscribedEvents,
  subscribedEvents,
}: {
  setSubscribedEvents: any;
  subscribedEvents: string[];
}) => {
  Object.entries(subscribeEventList)?.forEach((item) => {
    !subscribedEvents.includes(item[1]) &&
      setSubscribedEvents((prev: any) => [...prev, item[1]]);
  });
};
