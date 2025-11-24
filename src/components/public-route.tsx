import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

interface PublicRouteProps {
    children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const token = useAuthStore((s) => s.token);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    if (!hasHydrated) return null;

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}
