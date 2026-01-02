import type { ReactNode } from "react";

interface MandatoryWrapperProps {
    children: ReactNode;
}

export const MandatoryWrapper = ({ children }: MandatoryWrapperProps) => {
    return (
        <div className="relative">
            <span className="absolute z-50 text-red-500 left-0 -top-2 text-2xl">
                *
            </span>
            {children}
        </div>
    );
};
