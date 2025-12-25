import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { Input } from "@/components/ui/input";
import { Eye, EyeSlash, Login, Sms } from "iconsax-reactjs";
import { Spinner } from "@/components/ui/spinner";
import { useTenantStore } from "@/store/tenant";

export const SignIn = () => {
    const navigate = useNavigate();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState("");
    const [showPassword, setshowPassword] = useState(false);
    const { tenant } = useTenantStore();

    const handleSignIn = async () => {
        if (!tenant) return;

        try {
            setloading(true);
            const response = await signIn(
                {
                    email,
                    password,
                },
                tenant.id
            );
            useAuthStore.getState().setToken(response.token);

            navigate("/");
        } catch (error: any) {
            const msg = error?.response?.data?.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setloading(false);
        }
    };

    return (
        <div className="w-screen p-10 flex-col h-screen flex justify-between ">
            <div className="md:w-1/4 w-full flex self-center justify-center  flex-col">
                <div className="mb-6 flex flex-col items-center">
                    <div className="mb-6  bg-foreground/5 text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
                        <Sms variant="Linear" size={20} color="#000" />
                    </div>
                    <h1 className="text-2xl text-center">Sign In</h1>
                    <p className="text-lg text-foreground/80 mt-2 text-center leading-6">
                        Sign in with your email and <br />
                        start tracking your program
                    </p>
                </div>

                <div className="mt-6 mb-3 flex flex-col gap-y-3">
                    {error !== "" && (
                        <div className="text-red-500 text-sm">
                            {error.charAt(0).toUpperCase() + error.slice(1)}
                        </div>
                    )}

                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e: any) => setemail(e.target.value)}
                    />
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e: any) => setpassword(e.target.value)}
                            className="pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setshowPassword(!showPassword)}
                            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeSlash
                                    variant="Linear"
                                    size={20}
                                    color="#000"
                                />
                            ) : (
                                <Eye variant="Linear" size={20} color="#000" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    className="self-end"
                    variant="default"
                    onClick={handleSignIn}
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <Login variant="Linear" size={18} color="#fff" />
                            <p>Sign In</p>
                        </div>
                    )}
                </Button>
            </div>
            <div></div>
        </div>
    );
};
