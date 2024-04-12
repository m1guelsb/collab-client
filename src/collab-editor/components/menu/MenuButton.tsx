import { ComponentProps } from "react";
import { cx } from "class-variance-authority";

export const MenuButton = ({
  isActive,
  ...props
}: ComponentProps<"button"> & { isActive: boolean }) => {
  return (
    <button
      className={cx(
        "h-8 w-8 flex justify-center items-center text-center rounded-md border border-gray-100 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"
      )}
      {...props}
    />
  );
};
