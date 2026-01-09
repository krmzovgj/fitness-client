import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTenantStore } from "@/store/tenant";
import { Eye, EyeSlash, Login } from "iconsax-reactjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/auth";
import { useAuthStore } from "../../store/auth";
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import { cn } from "@/lib/utils";

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
            const response = await signIn({
                email,
                password,
            });
            useAuthStore.getState().setToken(response.token);

            navigate("/dashboard");
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
        <div className="w-screen p-10 flex-col h-screen flex justify-center items-center">
            <GridPattern
                width={25}
                height={25}
                strokeDasharray="2 6"
                className={cn(
                    "fixed inset-0 z-0 pointer-events-none",
                    "mask-[radial-gradient(1500px_circle_at_center,white,transparent)]"
                )}
            />
            <div className="relative md:w-1/4 w-full flex self-center justify-center  flex-col">
                <div className="mb-6 flex flex-col items-center">
                    <div className="">
                        <img
                            src="/favicon.png"
                            className="w-24 squircle-round h-24 mb-6 "
                            alt=""
                        />
                    </div>
                    <h1 className="text-3xl text-center">
                        Sign In <span className="text-muted-foreground">@</span>{" "}
                        {tenant?.subdomain}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 text-center leading-6">
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
                        className="bg-secondary"
                        placeholder="Email"
                        value={email}
                        onChange={(e: any) => setemail(e.target.value)}
                    />
                    <div className="relative -mt-1">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e: any) => setpassword(e.target.value)}
                            className="pr-10 bg-secondary"
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
                    className="w-full"
                    variant="default"
                    onClick={handleSignIn}
                >
                    {loading ? (
                        <Spinner color="#fff" className="size-6" />
                    ) : (
                        <div className="flex items-center gap-x-2">
                            <Login variant="Linear" size={18} color="#fff" />
                            <p>Sign In</p>
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
};
