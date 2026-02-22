import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    gradient?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hover = true, gradient = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card rounded-xl p-6 relative overflow-hidden",
                    hover && "glass-card-hover",
                    gradient && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-500/5 before:to-transparent before:pointer-events-none",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
