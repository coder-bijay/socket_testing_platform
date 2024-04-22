import { MdClose } from "react-icons/md";

export const ErrorMessageContainer = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "SUCCESS" | "ERROR" | "";
  onClose: () => void;
}) => {
  return (
    <div
      className={`shadow-md ${
        type === "SUCCESS" ? "bg-green-100" : "bg-red-100"
      }  p-2 rounded-lg flex justify-between items-center border w-full`}
    >
      <div
        className={`${
          type === "SUCCESS" ? "text-green-500 " : "text-red-500 "
        } font-semibold text-12`}
      >
        {message}
      </div>
      <MdClose
        className="cursor-pointer text-red-500 h-6 w-6"
        onClick={onClose}
      />
    </div>
  );
};
