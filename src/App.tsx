import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import { SignIn } from "./pages/auth/sign-in";
import { Home } from "./pages/home";
import PublicRoute from "./components/public-route";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import { getMe } from "./api/user";
import { useUserStore } from "./store/user";
import { Client } from "./pages/client/[id]";
import { Exercises } from "./pages/client/exercises";
import { Meals } from "./pages/client/meals";

function App() {
    const { token } = useAuthStore();
    const { setUser } = useUserStore();

    useEffect(() => {
        const handleGetMe = async () => {
            try {
                const response = await getMe(token!);
                setUser(response);
            } catch (error) {}
        };

        handleGetMe();
    }, [token]);

    return (
        <Routes>
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
                path="/auth/sign-in"
                element={
                    <PublicRoute>
                        <SignIn />
                    </PublicRoute>
                }
            />
        </Routes>
    );
}

export default App;
