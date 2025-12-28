import { getUserById } from "@/api/user";
import { DietSection } from "@/components/diet-section";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { WorkoutSection } from "@/components/workout-section";
import { type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft, Information, Sms } from "iconsax-reactjs";
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
                            <div className="flex flex-col mt-10 items-start justify-between gap-x-20">
                                <Button
                                    onClick={() => navigate("/")}
                                    variant="secondary"
                                >
                                    <ArrowLeft
                                        variant="TwoTone"
                                        size={20}
                                        color="#000"
                                    />
                                    Back
                                </Button>

                                <div className="flex mt-5 items-center gap-x-3">
                                    {client && (
                                        <Avatar
                                            firstName={client?.firstName!}
                                            lastName={client?.lastName!}
                                            size={60}
                                            className="text-2xl"
                                        />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-x-2">
                                            <h1 className="text-2xl leading-7 font-medium">
                                                {client?.firstName}{" "}
                                                {client?.lastName}
                                            </h1>

                                            <Information
                                                className="cursor-pointer"
                                                variant="Bold"
                                                size={20}
                                                color="#000"
                                            />
                                        </div>
                                        <h3 className="text-muted-foreground flex items-center gap-x-1">
                                            <Sms
                                                variant="Bold"
                                                size={16}
                                                color="#000"
                                            />
                                            {client?.email}
                                        </h3>
                                    </div>
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
