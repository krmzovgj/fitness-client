import type { User } from "@/model/user";
import { Hashtag } from "iconsax-reactjs";
import { Avatar } from "./ui/avatar";

export const Header = ({ user }: { user: User }) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-2">
                <Hashtag variant="Bold" size={26} color="#66A786" />
                <h3 className="text-xl font-black text-foreground">
                    kalapocev
                </h3>
            </div>

            <div className="flex items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <div>
                        <h3 className="text-right font-medium">
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <h3 className="text-right text-sm text-foreground/80 font-medium -mt-0.5">
                            {user?.email}
                        </h3>
                    </div>

                    {user && (
                        <Avatar
                            firstName={user?.firstName}
                            lastName={user?.lastName}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
