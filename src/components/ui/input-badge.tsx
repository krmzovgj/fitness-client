
export const InputBadge = ({ title }: { title: string }) => {
    return (
        <div className="px-2 z-20 py-1 absolute right-3 bg-secondary text-xs rounded-lg">
            {title}
        </div>
    );
};
