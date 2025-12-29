import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Note1 } from "iconsax-reactjs";

export const WorkoutNote = ({
    note: initialNote,
    onSave,
}: {
    note: string | null;
    onSave: (newNote: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(initialNote || "");

    useEffect(() => {
        setNote(initialNote || "");
    }, [initialNote]);

    const handleSave = () => {
        onSave(note);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNote(initialNote || "");
        setIsEditing(false);
    };

    return (
        <div className="mt-10">
            <div className="flex items-center gap-x-3 w-full md:w-fit justify-between md:justify-start">
                <h1 className="text-xl md:text-2xl flex items-center gap-x-1 md:gap-x-2">
                    <Note1 variant="Bold" size={20} color="#000" />
                    Additional Note
                </h1>

                <Button variant="default" onClick={() => setIsEditing(true)}>
                    {!initialNote ? "Add Note" : "Edit Note"}
                </Button>
            </div>

            {isEditing ? (
                <div className="mt-5 md:w-1/3 flex flex-col gap-2">
                    <Textarea
                        rows={5}
                        autoFocus
                        className="resize-none"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write additional workout note..."
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            ) : (
                <p className="mt-5 md:w-1/3 w-full text-muted-foreground cursor-pointer">
                    {!note ? "N/A" : note}
                </p>
            )}
        </div>
    );
};
