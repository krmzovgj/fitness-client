import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { Input } from "@/components/ui/input";

export const SignIn = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const response = await signIn({ email, password });
            useAuthStore.getState().setToken(response.token);

            navigate("/");
        } catch (error) {}
    };

    return (
        <div className="w-screen p-10 flex-col h-screen flex justify-center items-center">
            <div className="md:w-1/4 w-full">
                <div className="mb-6">
                    <h1 className="text-2xl text-center">Sign In</h1>
                    <p className="text-lg text-white/80 mt-2 text-center leading-6">
                        Sign in with your email and <br />
                        track your progress
                    </p>
                    <div className="mt-6 flex flex-col gap-y-3">
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e: any) => setemail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChange={(e: any) => setpassword(e.target.value)}
                            security=""
                        />
                    </div>
                </div>

                <Button variant="default" onClick={handleSignIn}>
                    Sign In
                </Button>
            </div>
        </div>
    );
};
