import { cn } from "@/lib/utils";
import type { ReactNode, TextareaHTMLAttributes } from "react";

type TextAreaGroupProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  icon?: ReactNode;
};

export function TextAreaGroup({
  label,
  icon,
  className,
  ...props
}: TextAreaGroupProps) {
  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={props.id ?? props.name}
        className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-4 text-body">
            {icon}
          </span>
        )}

        <textarea
          {...props}
          id={props.id ?? props.name}
          rows={props.rows ?? 6}
          className={cn(
            "w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition placeholder:text-body focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-3 dark:text-white",
            icon ? "pl-12" : "",
            props.className
          )}
        />
      </div>
    </div>
  );
}
