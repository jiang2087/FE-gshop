import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputGroupProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "md" | "lg";
};

const heightClassMap: Record<NonNullable<InputGroupProps["height"]>, string> = {
  sm: "h-11",
  md: "h-12",
  lg: "h-14",
};

export default function InputGroup({
  label,
  icon,
  iconPosition = "left",
  height = "md",
  className,
  ...props
}: InputGroupProps) {
  const hasIcon = Boolean(icon);
  const inputPadding = hasIcon
    ? iconPosition === "left"
      ? "pl-12 pr-4"
      : "pl-4 pr-12"
    : "px-4";

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={props.id ?? props.name}
        className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {hasIcon && (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-body",
              iconPosition === "left" ? "left-4" : "right-4"
            )}
          >
            {icon}
          </span>
        )}

        <input
          {...props}
          id={props.id ?? props.name}
          className={cn(
            "w-full rounded-lg border border-stroke bg-transparent text-dark outline-none transition placeholder:text-body focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-3 dark:text-white",
            heightClassMap[height],
            inputPadding,
            props.className
          )}
        />
      </div>
    </div>
  );
}
