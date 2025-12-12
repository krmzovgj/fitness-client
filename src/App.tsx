import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getTenantBySubdomain } from "./api/tenant";
import { getMe } from "./api/user";
import ProtectedRoute from "./components/protected-route";
import PublicRoute from "./components/public-route";
import { SignIn } from "./pages/auth/sign-in";
import { Client } from "./pages/client/[id]";
import { Exercises } from "./pages/client/exercises";
import { Meals } from "./pages/client/meals";
import { Home } from "./pages/home";
import { useAuthStore } from "./store/auth";
import { useTenantStore } from "./store/tenant";
import { useUserStore } from "./store/user";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";

function App() {
    const { token, clearToken } = useAuthStore();
    const { setUser, clearUser } = useUserStore();
    const { setTenant, tenant } = useTenantStore();
    const [tenantLoading, setTenantLoading] = useState(true);
    const [tenantError, setTenantError] = useState(false);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                setTenantLoading(true);
                setTenantError(false);

                const subdomain =
                    import.meta.env.VITE_TENANT_SUBDOMAIN || "kalapocev";
                const response = await getTenantBySubdomain(subdomain);

                setTenant(response.data);
            } catch (err) {
                console.error("Tenant not found or invalid subdomain");
                setTenantError(true);
            } finally {
                setTenantLoading(false);
            }
        };

        fetchTenant();
    }, []); 

    useEffect(() => {
        if (!token) {
            clearUser();
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await getMe(token);
                setUser(res.data);
            } catch (err) {
                clearToken();
                clearUser();
            }
        };

        fetchUser();
    }, [token]);

    if (tenantLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="size-10" />
            </div>
        );
    }

    if (tenantError || !tenant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
                <div>
                    <h2 className="text-2xl font-bold">Internal Error</h2>
                    <p className="text-foreground/70 mt-2">
                        Failed to load the subdomain{" "}
                        <strong>
                            {import.meta.env.VITE_TENANT_SUBDOMAIN ||
                                window.location.hostname.split(".")[0]}
                        </strong>
                        .
                    </p>
                </div>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    // 5. All good → render routes
    return (
        <Routes>
            <Route
                path="/auth/sign-in"
                element={
                    <PublicRoute>
                        <SignIn />
                    </PublicRoute>
                }
            />

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
        </Routes>
    );
}

export default App;
