import { getUserById } from "@/api/user";
import { Header } from "@/components/header";
import { Spinner } from "@/components/ui/spinner";
import { UserStats } from "@/components/user-stats";
import { WorkoutSection } from "@/components/workout-section";
import { type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { ArrowLeft } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Client = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
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
        <div className="h-full overflow-x-hidden md:h-screen overflow-y-scroll flex flex-col w-screen md:p-10 p-8">
            <Header user={user!} />

            {!loadingClient && !client && (
                <div>
                    <div className="flex items-center justify-center h-screen">
                        Internal Error. Try again later
                    </div>
                </div>
            )}

            {loadingClient ? (
                <div className="h-full flex justify-center items-center">
                    <Spinner className="size-6" />
                </div>
            ) : (
                <div>
                    <div className="flex md:flex-row flex-col items-start md:items-end gap-x-20">
                        <div className="mt-20 mb-10 md:mb-0">
                            <ArrowLeft
                                className="cursor-pointer"
                                onClick={() => navigate("/")}
                                variant="Bold"
                                size={30}
                                color="#000"
                            />
                            <h3 className="mt-4 text-md font-bold flex items-center gap-x-2 ml-0.5 text-foreground/80">
                                <div className="w-2 h-2 rounded-full bg-[#66A786]" />
                                {client?.role}
                            </h3>
                            <h1 className="text-3xl font-bold">
                                {client?.firstName} {client?.lastName}
                            </h1>
                        </div>

                        <UserStats client={client!} />
                    </div>

                    <WorkoutSection client={client!} />
                </div>
            )}
        </div>
    );
};
