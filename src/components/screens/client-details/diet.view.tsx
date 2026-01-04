import { createDiet, getDietByClient, updateDiet } from "@/api/diet";
import { Button } from "@/components/ui/button";
import { DayPlanCard } from "@/components/ui/day-plan-card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { dayColors, dayOrder } from "@/lib/utils";
import { Day } from "@/model/day";
import type { Diet } from "@/model/diet";
import { UserRole, type User } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useDietStore } from "@/store/diet";
import { useUserStore } from "@/store/user";
import { Book1, RecordCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion'

export const DietView = ({ client }: { client: User }) => {
    const { token } = useAuthStore();
    const { user } = useUserStore();
    const { mealDaysByClient, setMealDays } = useDietStore();
    const [loadingMealDays, setloadingMealDays] = useState(false);

    const clientId = client?.id;

    const [name, setname] = useState("");
    const [day, setday] = useState<Day | null>(null);
    const [error, seterror] = useState("");
    const [creatingDiet, setcreatingDiet] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [selectedDiet, setselectedDiet] = useState<Diet | null>(null);

    const mealDays = clientId ? mealDaysByClient[clientId] : undefined;

    const sortedMealDays = mealDays
        ? [...mealDays].sort(
              (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          )
        : [];

    const handleGetDietsByClient = async () => {
        if (!token || !clientId) return;

        try {
            setloadingMealDays(true);
            const response = await getDietByClient(clientId, token);
            setMealDays(clientId, response.data);
        } finally {
            setloadingMealDays(false);
        }
    };

    useEffect(() => {
        if (!token || !clientId) return;
        if (mealDays) return;

        handleGetDietsByClient();
    }, [clientId]);

    useEffect(() => {
        if (!selectedDiet) return;

        setname(selectedDiet.name);
        setday(selectedDiet.day);
    }, [selectedDiet]);

    const handleCreateDiet = async () => {
        if (!token || !clientId) return;
        try {
            setcreatingDiet(true);
            const response = await createDiet(token, {
                name,
                day,
                clientId: clientId,
            });
            if (response.status === 201) {
                setdialogOpen(false);
                handleGetDietsByClient();
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setcreatingDiet(false);
        }
    };

    const handleUpdateDiet = async () => {
        if (!token || !selectedDiet) return;

        try {
            setcreatingDiet(true);
            const response = await updateDiet(token, selectedDiet?.id, {
                name,
                day,
                clientId: clientId,
            });

            if (response.status === 200) {
                setdialogOpen(false);
                handleGetDietsByClient();
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setcreatingDiet(false);
        }
    };

    const usedDays = new Set(mealDays?.map((w) => w.day));
    const availableDays = dayColors.filter((day) => {
        if (selectedDiet && day.day === selectedDiet.day) return true;
        return !usedDays.has(day.day);
    });

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setdialogOpen(open);
                setselectedDiet(null);
                setname("");
                if (availableDays.length > 0) {
                    setday(availableDays[0].day);
                } else {
                    setday(null);
                }
                seterror("");
            }}
        >
            <div className="mt-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                            <RecordCircle
                                variant="Bold"
                                size={20}
                                color="#000"
                            />
                            Diet Plan
                            {loadingMealDays && <Spinner className="size-5" />}
                        </h1>
                    </div>

                    {user?.role === UserRole.TRAINER && (
                        <DialogTrigger asChild>
                            <Button variant="default">Add Diet Day</Button>
                        </DialogTrigger>
                    )}
                </div>

                {!loadingMealDays && (
                    <div className="mt-5">
                        {mealDays?.length === 0 && !loadingMealDays ? (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Book1
                                            variant="Bold"
                                            size={20}
                                            color="#fff"
                                        />
                                    </EmptyMedia>
                                    <EmptyTitle>No Diet Yet</EmptyTitle>
                                    <EmptyDescription>
                                        {user?.role === UserRole.TRAINER
                                            ? "No diet days created yet. Once you create a diet it will appear here"
                                            : "No diet days yet. Once your trainer creates a diet it will appear here"}
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                {sortedMealDays?.map((diet) => (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            filter: "blur(20px)",
                                        }}
                                        animate={{
                                            opacity: 1,
                                            filter: "blur(0px)",
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            type: "spring",
                                        }}
                                    >
                                        <DayPlanCard
                                            id={diet.id}
                                            firstName={client.firstName}
                                            lastName={client.lastName}
                                            clientId={client.id}
                                            key={diet.id}
                                            day={diet.day}
                                            name={diet.name}
                                            meals={diet.meals}
                                            variant="diet"
                                            openEdit={() => {
                                                setselectedDiet(diet);
                                                setdialogOpen(true);
                                            }}
                                            user={user!}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <DialogContent>
                <DialogTitle>
                    {selectedDiet ? "Update" : "Add New"} Diet
                </DialogTitle>
                <DialogDescription>
                    Fill the required fields to{" "}
                    {selectedDiet ? "update" : "add"} a diet
                </DialogDescription>
                <div className="flex flex-col gap-y-2 mt-2">
                    <Input
                        value={name}
                        className="capitalize"
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Name e.g. Muscle Gain"
                    />
                    <Select
                        disabled={availableDays.length === 0}
                        value={day ?? undefined}
                        onValueChange={(value: Day) => setday(value)}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    day === null ? "All days are filled" : "Day"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {availableDays.map((dayItem) => (
                                <SelectItem value={dayItem.day}>
                                    <div className="flex items-center gap-x-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: dayItem.color,
                                            }}
                                        ></div>
                                        <h2>{dayItem.day}</h2>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {error !== "" && (
                        <div className="text-red-500 mt-2 text-sm">
                            {error.charAt(0).toUpperCase() + error.slice(1)}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={
                            selectedDiet ? handleUpdateDiet : handleCreateDiet
                        }
                        className="self-end"
                    >
                        {creatingDiet ? (
                            <Spinner color="#fff" className="size-6" />
                        ) : (
                            <>{selectedDiet ? "Update" : "Add"} Diet</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
