import { getUserById } from "@/api/user";
import { Header } from "@/components/header";
import type { User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, Weight } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createWorkout, getWorkout } from "@/api/workout";

export const Client = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const { id } = useParams();

    const [client, setclient] = useState<User | null>(null);
    const [workout, setworkout] = useState<any>();

    const [loadingClient, setloadingClient] = useState(false);
    const [creatingWorkout, setcreatingWorkout] = useState(false);

    const handleCreateWorkout = async () => {
        if (!token && !client) return;

        try {
            setcreatingWorkout(true);
            const response = await createWorkout(token!, client?.id!);
            if (response.status === 201) {
                setworkout(response.data);
            }
        } catch (error) {
        } finally {
            setcreatingWorkout(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        try {
            setloadingClient(true);
            const getClient = async () => {
                const response = await getUserById(id, token!);

                setclient(response.data);
            };

            getClient();
        } catch (error) {
        } finally {
            setloadingClient(false);
        }
    }, [id]);

    useEffect(() => {
        const handleGetWorkout = async () => {
            try {
                const response = await getWorkout(token!, client?.id!);
                setworkout(response.data);
            } catch (error) {}
        };

        handleGetWorkout();
    }, [client]);

    return (
        <div className="h-full md:h-screen flex flex-col w-screen md:p-10 p-8">
            <Header user={user!} />

            {loadingClient ? (
                <div className="h-full flex justify-center items-center">
                    <Spinner className="size-6" />
                </div>
            ) : (
                <>
                    <div className="mt-20">
                        <ArrowLeft
                            className="cursor-pointer"
                            onClick={() => navigate("/")}
                            variant="Bold"
                            size={30}
                            color="#000"
                        />
                        <h3 className="mt-4 text-md font-bold flex items-center gap-x-2 ml-0.5 text-foreground/80">
                            <div className="w-2 h-2 rounded-full bg-[#66A786]"></div>
                            {client?.role}
                        </h3>
                        <h1 className="text-3xl font-bold">
                            {client?.firstName} {client?.lastName}
                        </h1>
                    </div>

                    <div className="mt-14">
                        {workout ? (
                            <div>
                                <h1>{workout?.name}</h1>
                            </div>
                        ) : (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Weight
                                            variant="Bold"
                                            size={20}
                                            color="#000"
                                        />
                                    </EmptyMedia>
                                    <EmptyTitle>No Workout Yet</EmptyTitle>
                                    <EmptyDescription>
                                        You haven&apos;t created any workout
                                        plan for {client?.firstName} yet. Get
                                        started by creating their first workout.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleCreateWorkout}
                                            variant="default"
                                        >
                                            {creatingWorkout ? (
                                                <Spinner />
                                            ) : (
                                                <div>Create Workout</div>
                                            )}
                                        </Button>
                                    </div>
                                </EmptyContent>
                            </Empty>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
