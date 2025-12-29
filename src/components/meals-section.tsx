import { createMeal, getMeals, updateMeal } from "@/api/meal";
import { mealOrder, mealTypes } from "@/lib/utils";
import type { Day } from "@/model/day";
import type { Meal } from "@/model/meal";
import { UserRole } from "@/model/user";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { Dialog } from "@radix-ui/react-dialog";
import { ArrowLeft, Book, RecordCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MealColumns } from "./columns/meal-columns";
import { DataTable } from "./data-table";
import { Button } from "./ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "./ui/empty";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { MealType } from "@/model/meal-type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export const MealsSection = ({
    dietId,
    dayMatch,
    state,
}: {
    dietId: string;
    dayMatch: { day: Day; color: string };
    state: any;
}) => {
    const { user } = useUserStore();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const [meals, setMeals] = useState<Meal[]>([]);

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
    const [loadingMeals, setloadingMeals] = useState(true);

    const sortedMeals = meals.sort((a, b) => {
        return mealOrder.indexOf(a.type) - mealOrder.indexOf(b.type);
    });

    const handleGetMealsByDiet = async () => {
        if (!token || !dietId) return;
        try {
            const response = await getMeals(token, dietId);
            setMeals(response.data);
        } catch (error) {
        } finally {
            setloadingMeals(false);
        }
    };

    useEffect(() => {
        handleGetMealsByDiet();
    }, [dietId, token]);

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
                handleGetMealsByDiet();
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
                handleGetMealsByDiet();
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
    }, [selectedMeal]);

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
                seterror("");
            }}
        >
            <div className="flex items-end  justify-between">
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
                        <div className="flex w-14 h-14  bg-[#66A786]/10 items-center justify-center squircle-round">
                            <Book variant="Bold" size={28} color="#66A786" />
                        </div>
                        <div>
                            <h3 className="flex items-center capitalize gap-x-1 font-semibold">
                                <p className="text-foreground">
                                    {dayMatch?.day.toLowerCase()}
                                </p>{" "}
                                <p className="text-muted-foreground">
                                    Meal Day
                                </p>
                            </h3>
                            <h1 className="text-3xl leading-7 font-medium">
                                {state.name}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex mt-10 items-center justify-between">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <RecordCircle variant="Bold" size={20} color="#000" />
                    Meals
                    {loadingMeals && <Spinner className="size-6" />}
                </h1>

                {user?.role === UserRole.TRAINER && (
                    <DialogTrigger asChild>
                        <Button>Add Meal</Button>
                    </DialogTrigger>
                )}
            </div>

            <div className="mt-5 flex flex-col  ">
                <div className="flex flex-col ">
                    {meals.length === 0 && !loadingMeals ? (
                        <Empty className="">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Book
                                        variant="Bold"
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
                            data={sortedMeals}
                            columns={MealColumns(
                                setselectedMeal,
                                setdialogOpen,
                                handleGetMealsByDiet
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
                        <Input
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            placeholder="Name e.g. Oat Meal"
                        />

                        <Textarea
                            rows={5}
                            className="resize-none"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                            placeholder="Description"
                        />

                        <Input
                            value={cal === 0 ? "" : cal}
                            onChange={(e) => {
                                const value = e.target.value;
                                setcal(value === "" ? 0 : Number(value));
                            }}
                            placeholder="Calories (kcal)"
                            type="number"
                        />

                        <Input
                            value={protein === 0 ? "" : protein}
                            onChange={(e) => {
                                const value = e.target.value;
                                setprotein(value === "" ? 0 : Number(value));
                            }}
                            placeholder="Protein (g)"
                            type="number"
                        />

                        <Input
                            value={carbs === 0 ? "" : carbs}
                            onChange={(e) => {
                                const value = e.target.value;
                                setcarbs(value === "" ? 0 : Number(value));
                            }}
                            placeholder="Carbs (g)"
                            type="number"
                        />

                        <Input
                            value={fats === 0 ? "" : fats}
                            onChange={(e) => {
                                const value = e.target.value;
                                setfats(value === "" ? 0 : Number(value));
                            }}
                            placeholder="Fats (g)"
                            type="number"
                        />

                        <Select
                            value={type}
                            onValueChange={(value: MealType) => settype(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                                {mealTypes.map((mealTypeItem) => (
                                    <SelectItem value={mealTypeItem.type}>
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
                                <Spinner className="size-6" />
                            ) : (
                                <>{selectedMeal ? "Update" : "Add"} Meal</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </div>
        </Dialog>
    );
};
