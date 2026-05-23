import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-sky-500 text-primary-foreground hover:bg-sky-500/90 shadow-[0_4px_0_0_#0ea5e9]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_4px_0_0_#ef4444]",
        outline: "border-2 border-slate-200 bg-background hover:bg-slate-100 text-slate-700",
        secondary: "bg-purple-500 text-secondary-foreground hover:bg-purple-500/80 shadow-[0_4px_0_0_#a855f7]",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_0_0_#10b981]",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, we fallback to standard React button for simplicity 
    // unless you have @radix-ui/react-slot installed.
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export interface AnimatedButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95, y: 4 }}
        className={cn(buttonVariants({ variant, size, className }), "shadow-none relative top-0 active:top-1")}
        ref={ref}
        {...props}
      />
    )
  }
)
AnimatedButton.displayName = "AnimatedButton"

export { Button, AnimatedButton, buttonVariants }
