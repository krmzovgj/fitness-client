import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
import { Exercises } from "./pages/client/exercises";
import { Meals } from "./pages/client/meals";
import { Home } from "./pages/home";
import { useAuthStore } from "./store/auth";
import { useTenantStore } from "./store/tenant";
import { useUserStore } from "./store/user";

function App() {
    const { setTenant, tenant } = useTenantStore();
    const { token, clearToken } = useAuthStore();
    const { setUser, clearUser } = useUserStore();
    const [isBootstrapping, setIsBootstrapping] = useState(true);
    const [tenantError, setTenantError] = useState(false);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                setIsBootstrapping(true);
                setTenantError(false);

                const subdomain =
                    import.meta.env.VITE_TENANT_SUBDOMAIN ||
                    window.location.hostname.split(".")[0];

                const tenantResponse = await getTenantBySubdomain(subdomain);
                setTenant(tenantResponse.data);

                if (token && tenant) {
                    try {
                        const userRes = await getMe(token, tenant?.id);
                        setUser(userRes.data);
                    } catch {
                        console.warn("Invalid or expired token");
                        clearToken();
                        clearUser();
                    }
                }
            } catch (err) {
                setTenantError(true);
            } finally {
                setIsBootstrapping(false);
            }
        };

        bootstrap();
    }, []);

    if (isBootstrapping) {
        return (
            <div className="flex items-center gap-x-3 border w-full justify-center min-h-screen">
                <Spinner className="size-6" /> Loading...
            </div>
        );
    }

    if (tenantError || !tenant) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6 p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold">App Not Available</h2>
                    <p className="text-foreground/70 mt-2">
                        Could not load configuration for subdomain:{" "}
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
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id"
                    element={
                        <ProtectedRoute>
                            <Client />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id/exercises"
                    element={
                        <ProtectedRoute>
                            <Exercises />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/:id/meals"
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
