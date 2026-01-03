import React from "react";

interface BadgeProps {
    title: string;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ title, className = "" }) => {
    const baseStyles =
        "bg-[#EFEFEF] border w-fit text-sm text-[#181818] py-0.5 px-2 rounded-xl";

    return <div className={`${baseStyles} ${className}`}>{title}</div>;
};
