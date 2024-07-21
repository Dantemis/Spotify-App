import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col gap-5 rounded bg-background-alt p-5 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
