import React from "react";

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
};

export default function Modal({ open, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-end min-h-screen pt-4 sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-brown opacity-50"></div>
        </div>
        <div className="z-10 bg-peach p-4 border-t-8 border-yellow">{children}</div>
      </div>
    </div>
  );
}
