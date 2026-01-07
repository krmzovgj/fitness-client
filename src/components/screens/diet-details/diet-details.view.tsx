import { getDietById } from "@/api/diet";
import { createMeal, getMeals, updateMeal } from "@/api/meal";
import { MealColumns } from "@/components/columns/meal-columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
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
import { InputBadge } from "@/components/ui/input-badge";
import { MandatoryWrapper } from "@/components/ui/mandatory-input-wrapper";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { mealOrder, mealTypes } from "@/lib/utils";
import type { Diet } from "@/model/diet";
import type { Meal } from "@/model/meal";
import { MealType } from "@/model/meal-type";
import { UserRole } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { motion } from "framer-motion";
import {
    AddCircle,
    ArchiveBox,
    ArrowLeft,
    Book1,
    RecordCircle,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DietDetailsView = ({
    clientName,
    dietId,
}: {
    clientName: string;
    dietId: string;
}) => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const [diet, setDiet] = useState<Diet | null>(null);
    const [meals, setmeals] = useState<Meal[]>([]);

    const [name, setname] = useState("");
    const [description, setdescription] = useState("");
    const [cal, setcal] = useState<number>(0);
    const [protein, setprotein] = useState<number>(0);
    const [carbs, setcarbs] = useState<number>(0);
    const [fats, setfats] = useState<number>(0);
    const [type, settype] = useState<MealType>(MealType.BREKFAST);

    const [dialogOpen, setdialogOpen] = useState(false);
    const [error, seterror] = useState("");
    const [creatingMeal, setCreatingMeal] = useState(false);
    const [selectedMeal, setselectedMeal] = useState<Meal | null>(null);
    const [loadingDiet, setloadingDiet] = useState(false);
    const [loadingMeals, setloadingMeals] = useState(false);

    const sortedMeals = meals.sort((a, b) => {
        return mealOrder.indexOf(a.type) - mealOrder.indexOf(b.type);
    });

    const getDietData = async (showPageLoader = false) => {
        if (!token) return;

        if (showPageLoader) setloadingDiet(true);
        else setloadingMeals(true);

        try {
            const workoutResponse = await getDietById(token, dietId);
            setDiet(workoutResponse.data);

            const exercisesResponse = await getMeals(token, dietId);
            setmeals(exercisesResponse.data);
        } catch (err) {
            console.error("Error fetching workout:", err);
        } finally {
            if (showPageLoader) setloadingDiet(false);
            else setloadingMeals(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        getDietData(true);
    }, [token, dietId]);

    const handleCreateMeal = async () => {
        if (!token) return;
        try {
            setCreatingMeal(true);

            const response = await createMeal(
                {
                    name,
                    description,
                    cal,
                    protein,
                    carbs,
                    fats,
                    type,
                    dietId,
                },
                token!
            );

            if (response.status === 201) {
                setdialogOpen(false);
                const createdMeal = response.data as Meal;
                setmeals((prev) => [...prev, createdMeal]);
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setCreatingMeal(false);
        }
    };

    const handleUpdateMeal = async () => {
        if (!token) return;

        const payload = {
            name,
            description,
            cal,
            protein,
            carbs: carbs ?? 0,
            fats: fats ?? 0,
            type,
            dietId,
        };

        try {
            setCreatingMeal(true);

            const response = await updateMeal(
                selectedMeal?.id!,
                payload,
                token
            );

            if (response.status === 200) {
                setdialogOpen(false);
                const updatedMeal = response.data as Meal;
                setmeals((prev) =>
                    prev.map((meal) =>
                        meal.id === updatedMeal.id ? updatedMeal : meal
                    )
                );
            }
        } catch (error: any) {
            const msg = error.response.data.message;

            if (Array.isArray(msg)) {
                seterror(msg[0]);
            } else {
                seterror(msg);
            }
        } finally {
            setCreatingMeal(false);
        }
    };

    useEffect(() => {
        if (!selectedMeal) return;

        setname(selectedMeal?.name!);
        setdescription(selectedMeal?.description!);
        setprotein(selectedMeal?.protein!);
        setcal(selectedMeal?.cal!);
        setcarbs(selectedMeal?.carbs!);
        setfats(selectedMeal?.fats!);
        settype(selectedMeal?.type);
    }, [selectedMeal]);

    if (loadingDiet) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setdialogOpen(open);

                setselectedMeal(null);
                setname("");
                setdescription("");
                setcal(0);
                setprotein(0);
                setcarbs(0);
                setfats(0);
                seterror("");
            }}
        >
            <motion.div
                initial={{
                    y: 30,
                    opacity: 0,
                    filter: "blur(20px)",
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 0.5,
                    type: "spring",
                }}
                className="flex items-end  justify-between"
            >
                <div className="mt-10">
                    <div className="flex items-center gap-x-3">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="ghost"
                            className="bg-secondary"
                        >
                            <ArrowLeft
                                className="cursor-pointer"
                                variant="Linear"
                                size={20}
                                color="#000"
                            />
                            Back
                        </Button>
                    </div>

                    <div className="flex mt-5  items-center gap-x-3">
                        <div className="flex w-14 h-14  bg-foreground items-center justify-center squircle-round">
                            <Book1 variant="Bold" size={28} color="#66A786" />
                        </div>
                        <div>
                            <h3 className="ml-0.5 flex items-center capitalize gap-x-2 font-medium">
                                <p className="text-foreground">
                                    {diet?.day.toLowerCase()}
                                </p>
                                <RecordCircle
                                    variant="Bold"
                                    size={8}
                                    color="#000"
                                />
                                <p className="text-foreground">{clientName}</p>
                            </h3>
                            <h1 className="text-3xl leading-7 font-medium">
                                {diet?.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="flex mt-10 items-center justify-between">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <RecordCircle variant="Bold" size={20} color="#000" />
                    Meals
                    {loadingMeals && <Spinner className="size-5" />}
                </h1>

                {user?.role === UserRole.TRAINER && (
                    <DialogTrigger asChild>
                        <Button>
                            <AddCircle variant="Bold" size={20} color="#fff" />{" "}
                            Meal
                        </Button>
                    </DialogTrigger>
                )}
            </div>

            <motion.div className="mt-5 flex flex-col  ">
                <div className="flex flex-col ">
                    {meals?.length === 0 && !loadingDiet ? (
                        <Empty className="">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ArchiveBox
                                        variant="Bulk"
                                        size={20}
                                        color="#fff"
                                    />
                                </EmptyMedia>
                                <EmptyTitle>No Meals Yet</EmptyTitle>
                                <EmptyDescription>
                                    {user?.role === UserRole.TRAINER
                                        ? "No meals created yet. Once you create a meal it will appear here"
                                        : "No meals yet. Once your trainer creates a meal it will appear here"}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <DataTable
                            data={sortedMeals ?? []}
                            columns={MealColumns(
                                setselectedMeal,
                                setdialogOpen,
                                setmeals
                            )}
                        />
                    )}
                </div>

                <DialogContent>
                    <DialogTitle>
                        {selectedMeal ? "Update" : "Add New"} Meal
                    </DialogTitle>
                    <DialogDescription>
                        Fill the required fields to{" "}
                        {selectedMeal ? "update" : "add"} a meal
                    </DialogDescription>

                    <div className="flex flex-col gap-y-2 mt-2">
                        <MandatoryWrapper>
                            <Input
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                placeholder="Name e.g. Oat Meal"
                            />
                        </MandatoryWrapper>

                        <MandatoryWrapper>
                            <Textarea
                                rows={5}
                                className="resize-none"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                placeholder="Description"
                            />
                        </MandatoryWrapper>

                        <div className="flex items-center relative">
                            <Input
                                value={cal === 0 ? "" : cal}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setcal(value === "" ? 0 : Number(value));
                                }}
                                placeholder="Calories (kcal)"
                                type="number"
                            />
                            <InputBadge title="kcal" />
                        </div>

                        <div className="flex items-center relative">
                            <Input
                                value={protein === 0 ? "" : protein}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setprotein(
                                        value === "" ? 0 : Number(value)
                                    );
                                }}
                                placeholder="Protein (g)"
                                type="number"
                            />
                            <InputBadge title="protein" />
                        </div>

                        <div className="flex items-center relative">
                            <Input
                                value={carbs === 0 ? "" : carbs}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setcarbs(value === "" ? 0 : Number(value));
                                }}
                                placeholder="Carbs (g)"
                                type="number"
                            />
                            <InputBadge title="carbs" />
                        </div>

                        <div className="flex items-center relative">
                            <Input
                                value={fats === 0 ? "" : fats}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setfats(value === "" ? 0 : Number(value));
                                }}
                                placeholder="Fats (g)"
                                type="number"
                            />
                            <InputBadge title="fats" />
                        </div>

                        <MandatoryWrapper>
                            <Select
                                value={type}
                                onValueChange={(value: MealType) =>
                                    settype(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mealTypes.map((mealTypeItem) => (
                                        <SelectItem
                                            key={mealTypeItem.type}
                                            value={mealTypeItem.type}
                                        >
                                            <div className="flex items-center gap-x-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            mealTypeItem.color,
                                                    }}
                                                ></div>
                                                <h2>{mealTypeItem.type}</h2>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </MandatoryWrapper>

                        {error !== "" && (
                            <div className="text-red-500 mt-2 text-sm">
                                {error.charAt(0).toUpperCase() + error.slice(1)}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={
                                selectedMeal
                                    ? handleUpdateMeal
                                    : handleCreateMeal
                            }
                            className="self-end"
                        >
                            {creatingMeal ? (
                                <Spinner color="#fff" className="size-6" />
                            ) : (
                                <>{selectedMeal ? "Update" : "Add"} Meal</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </motion.div>
        </Dialog>
    );
};
