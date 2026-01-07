import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex cursor-pointer items-center justify-center text-center gap-2 whitespace-nowrap cursor-pointer text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default: "w-full bg-foreground text-background hover:bg-primary/90",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "rounded-xl h-9 px-4 py-2",
                sm: "h-8 rounded-md gap-1.5 px-3",
                lg: "h-10 rounded-md px-6",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface ButtonProps
    extends React.ComponentProps<"button">,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    animate?: boolean; // optional, only set false to disable
}

function Button({
    className,
    variant,
    size,
    asChild = false,
    animate = true, // default to true
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    // Only wrap in motion if animation is enabled
    const content = (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );

    return animate ? (
        <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", duration: 0.4 }}
        >
            {content}
        </motion.span>
    ) : (
        content
    );
}

export { Button, buttonVariants };
