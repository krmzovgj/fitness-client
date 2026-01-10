import { getUserById } from "@/api/user";
import { DietView } from "@/components/screens/client-details/diet.view";
import { WorkoutView } from "@/components/screens/client-details/workout.view";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { ArrowLeft, Information, RecordCircle } from "iconsax-reactjs";
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
                    <Button onClick={() => navigate(-1)} variant="secondary">
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
                                    onClick={() => navigate(-1)}
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
                                            <h1 className="text-3xl leading-7 font-bold">
                                                {client?.firstName}{" "}
                                                {client?.lastName}
                                            </h1>

                                            <Button
                                                variant="ghost"
                                                className="p-0 bg-transparent"
                                            >
                                                <Information
                                                    className="mt-0.5 cursor-pointer"
                                                    variant="Bold"
                                                    size={20}
                                                    color="#000"
                                                />
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-x-1">
                                            <h3 className=" text-muted-foreground flex items-center ml-1">
                                                {client?.email}
                                            </h3>
                                            <RecordCircle variant="Bulk" color="#000" size={9}/>
                                            <h3
                                                style={{
                                                    color:
                                                        client?.gender ===
                                                        "FEMALE"
                                                            ? "#9B5DE5"
                                                            : "#66A786",
                                                }}
                                                className="text-muted-foreground capitalize flex items-center"
                                            >
                                                {client?.gender.toLowerCase()}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <WorkoutView client={client!} />
                            <DietView client={client!} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
