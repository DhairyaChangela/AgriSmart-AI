"use client";

import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const cardStyles = {
  base: "rounded-2xl transition-all duration-200 ease-out",
  variants: {
    default: `
      bg-white border border-neutral-200
      shadow-sm
    `,
    elevated: `
      bg-white border border-neutral-100
      shadow-lg hover:shadow-xl
    `,
    outlined: `
      bg-transparent border-2 border-neutral-200
      hover:border-neutral-300
    `,
    subtle: `
      bg-neutral-50 border border-neutral-200
      hover:bg-neutral-100
    `,
  },
  padding: {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  },
  hoverable: "hover:-translate-y-0.5 cursor-pointer",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hoverable = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          cardStyles.base,
          cardStyles.variants[variant],
          cardStyles.padding[padding],
          hoverable && cardStyles.hoverable,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("mb-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, as: Component = "h3", className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx("text-h4 text-neutral-900 font-semibold", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={clsx("mt-1 text-body-sm text-neutral-600", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("mt-4 pt-4 border-t border-neutral-100 flex items-center gap-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";