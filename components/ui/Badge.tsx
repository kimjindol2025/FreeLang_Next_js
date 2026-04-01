import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error" | "warning" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", className, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center font-semibold rounded-full border";

    const variantStyles = {
      default: "bg-dark-tertiary text-editor-fg border-dark-border",
      success: "bg-state-success bg-opacity-20 text-state-success border-state-success",
      error: "bg-state-error bg-opacity-20 text-state-error border-state-error",
      warning:
        "bg-state-warning bg-opacity-20 text-state-warning border-state-warning",
      info: "bg-state-info bg-opacity-20 text-state-info border-state-info",
    };

    const sizeStyles = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
