
export const InputBadge = ({ title }: { title: string }) => {
    return (
        <div className="capitalize px-2 z-20 py-1 absolute right-3 bg-foreground/5 text-xs rounded-lg">
            {title}
        </div>
    );
};
