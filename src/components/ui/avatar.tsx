import React from "react";

interface AvatarProps {
    firstName: string;
    lastName: string;
    size?: number; // diameter in px, default 40
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    firstName,
    lastName,
    size = 44,
    className = "",
}) => {
    // Get initials
    const initials =
        `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "User";

    return (
        <div
            className={`flex items-center justify-center leading-0 bg-foreground text-background rounded-full font-bold ${className}`}
            style={{ width: size, height: size }}
        >
            {initials}
        </div>
    );
};
