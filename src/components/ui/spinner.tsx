
import { cn } from "@/lib/utils";
import { Refresh } from "iconsax-reactjs";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <Refresh
            variant="Linear"
            color="#000"
            role="status"
            aria-label="Loading"
            className={cn("size-3 animate-spin", className)}
            {...props}
        />
    );
}

export { Spinner };
