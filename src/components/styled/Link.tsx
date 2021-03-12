import React from "react";

type LinkProps = {
  href: string;
  external: boolean;
  children?: React.ReactNode;
};

export default function Link({ href, external, children }: LinkProps) {
  return (
    <a
      rel="noreferrer"
      className="text-orange font-bold"
      href={href}
      {...(external ? { target: "_blank" } : {})}
    >
      {children}
    </a>
  );
}

