import { getUserById } from "@/api/user";
import { DietSection } from "@/components/diet-section";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserStats } from "@/components/user-stats";
import { WorkoutSection } from "@/components/workout-section";
import { type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Client = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { id } = useParams();

    const [client, setClient] = useState<User | null>(null);
    const [loadingClient, setLoadingClient] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchClient = async () => {
            try {
                setLoadingClient(true);
                const response = await getUserById(id, token!);
                setClient(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingClient(false);
            }
        };
        fetchClient();
    }, [id, token]);

    return (
        <div className="h-full flex flex-col">
            {!loadingClient && !client ? (
                <div className="flex justify-center flex-col items-center h-screen">
                    <h3 className="text-2xl mb-3">Client not found</h3>
                    <Button onClick={() => navigate("/")} variant="secondary">
                        Go Back
                    </Button>
                </div>
            ) : (
                <>
                    {loadingClient ? (
                        <div className="h-screen flex justify-center items-center">
                            <Spinner className="size-6" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex md:flex-row flex-col mt-10 md:mt-20 mb-5 md:mb-0 items-start justify-between md:items-end gap-x-20">
                                <div className="">
                                    <Button
                                        onClick={() => navigate(-1)}
                                        variant="ghost"
                                        className="bg-muted/50"
                                    >
                                        <ArrowLeft
                                            className="cursor-pointer"
                                            variant="Linear"
                                            size={20}
                                            color="#000"
                                        />
                                        Back
                                    </Button>

                                    <div className="flex items-center gap-x-2 md:gap-x-3 mt-4">
                                        {client && (
                                            <Avatar
                                                firstName={client?.firstName!}
                                                lastName={client?.lastName!}
                                                size={48}
                                                className="text-lg"
                                            />
                                        )}
                                        <div>
                                            <h1 className="text-3xl tracking-tight font-medium md:font-bold">
                                                {client?.firstName}{" "}
                                                {client?.lastName}
                                            </h1>
                                            <h3 className="text-sm md:leading-3 tracking-tight leading-3 ml-0.5 font-medium md:font-semibold text-foreground/80">
                                                {client?.email}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-fit w-full relative">
                                    <UserStats client={client!} />

                                    <div
                                        className="absolute md:hidden flex -right-2 top-0 bottom-0 w-16 
                                bg-linear-to-l from-white to-transparent 
                                dark:from-background-dark dark:to-transparent"
                                    />
                                </div>
                            </div>

                            <WorkoutSection client={client!} />

                            <DietSection client={client!} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
