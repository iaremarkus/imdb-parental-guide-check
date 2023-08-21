"use client";

import { useCaseSwapper } from "@/lib/useCaseSwapper";
import classNames from "classnames";

export interface CaseSwapperProps {
  tag: React.ElementType;
  text: string;
  timeout?: number;
  className?: string;
}

export const CaseSwapper = ({ tag, text, timeout = 100, className = "", ...props }: CaseSwapperProps) => {
  const swapText = useCaseSwapper(text, timeout);

  if (!tag || !text) return null;

  const Component = tag;

  return (
    <Component className={classNames("", className)} {...props}>
      {swapText}
    </Component>
  );
};
