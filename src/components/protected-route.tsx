import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = useAuthStore((s) => s.token);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    if (!hasHydrated) return null;

    if (!token) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    return children;
}
