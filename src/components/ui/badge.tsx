import React from "react";

interface BadgeProps {
    title: string;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ title, className = "" }) => {
    const baseStyles =
        "bg-secondary border-2 border-[#FF8C00] flex justify-center items-center w-fit text-sm text-foreground py-1 px-3 font-semibold rounded-xl";

    return <div className={`${baseStyles} ${className}`}>{title}</div>;
};
