import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getTenantBySubdomain } from "./api/tenant";
import { getMe } from "./api/user";
import { AppLayout } from "./components/layout/app-layout";
import { AuthLayout } from "./components/layout/auth-layout";
import ProtectedRoute from "./components/protected-route";
import PublicRoute from "./components/public-route";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { SignIn } from "./pages/auth/sign-in";
import { Client } from "./pages/client/[id]";
import { Meals } from "./pages/client/diet-details";
import { WorkoutDetails } from "./pages/client/workout-details";
import { Home } from "./pages/home";
import { useAuthStore } from "./store/auth";
import { useTenantStore } from "./store/tenant";
import { useUserStore } from "./store/user";
import { ProfilePage } from "./pages/profile";

function App() {
    const { setTenant, tenant } = useTenantStore();
    const { token, clearToken } = useAuthStore();
    const { setUser, clearUser } = useUserStore();
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [tenantError, setTenantError] = useState(false);
    const navigate = useNavigate();

    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    const isLocalhost = hostname === "localhost";

    let subdomain: string | null = null;

    if (!isLocalhost && parts.length > 2) {
        subdomain = parts[0];
    }

    // const envSubdomain = import.meta.env.VITE_TENANT_SUBDOMAIN;

    useEffect(() => {
        getTenantBySubdomain(subdomain!)
            .then((res) => setTenant(res.data))
            .catch(() => setTenantError(true))
            .finally(() => setIsBootstrapping(false));
    }, []);

    useEffect(() => {
        if (!tenant || !token) return;

        getMe(token, tenant.id)
            .then((res) => setUser(res.data))
            .catch(() => {
                clearToken();
                clearUser();
                navigate("/auth/sign-in");
            });
    }, [tenant, token]);

    if (isBootstrapping) {
        return (
            <div className="flex items-center gap-x-3 w-full justify-center min-h-screen">
                <Spinner className="size-6" /> Loading...
            </div>
        );
    }

    if (tenantError) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6 p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold">App Not Available</h2>
                    <p className="text-muted-foreground mt-2">
                        Could not load configuration for <br />
                        trainer:{" "}
                        <strong>
                            {import.meta.env.VITE_TENANT_SUBDOMAIN ||
                                window.location.hostname.split(".")[0]}
                        </strong>
                    </p>
                </div>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route
                    path="/auth/sign-in"
                    element={
                        <PublicRoute>
                            <SignIn />
                        </PublicRoute>
                    }
                />
            </Route>

            <Route element={<AppLayout />}>
                <Route
                    path="/dashboard"
                    handle={{ breadcrumb: "Home" }}
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    handle={{ breadcrumb: "Profile" }}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id"
                    handle={{ breadcrumb: "Client" }}
                    element={
                        <ProtectedRoute>
                            <Client />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id/workout-details"
                    handle={{ breadcrumb: "Exercises" }}
                    element={
                        <ProtectedRoute>
                            <WorkoutDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id/diet-details"
                    handle={{ breadcrumb: "Meals" }}
                    element={
                        <ProtectedRoute>
                            <Meals />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
