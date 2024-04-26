import React, { useEffect, useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

export const CopyContent = ({ content }: { content: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [isCopied]);

  return (
    <span>
      {isCopied ? (
        <MdCheck className="text-green-600" />
      ) : (
        <MdContentCopy
          className="cursor-pointer"
          onClick={() => {
            setIsCopied(true);
            navigator.clipboard.writeText(content);
          }}
        />
      )}
    </span>
  );
};
