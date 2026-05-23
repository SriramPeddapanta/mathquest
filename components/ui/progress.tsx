import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-6 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner",
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            "h-full w-full flex-1 bg-amber-400 transition-all",
            indicatorClassName
          )}
          initial={{ x: "-100%" }}
          animate={{ x: `-${100 - (value || 0)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
