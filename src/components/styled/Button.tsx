import React from "react";
export { default as Link } from "./Link";
export { default as Modal } from "./Modal";

type ButtonProps =  React.HTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
}

export default function Button({ primary = false, ...props }: ButtonProps) {
  const primaryColors = "border-orange text-orange";
  const secondaryColors = "border-brown text-brown";

  const colors = primary ? primaryColors : secondaryColors;

  return (
    <button
      className={`border-4 text-lg ${colors} px-12 py-1 w-full lg:w-auto`}
      {...props}
    />
  );
}
