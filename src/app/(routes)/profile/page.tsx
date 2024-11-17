import { BadgeCheck, ChevronLeft, Settings } from "lucide-react";

export default function ProfilePage() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <button>
                    <ChevronLeft />
                </button>
                <div className="font-bold flex items-center gap-2">
                    user name
                    <div className="size-5 rounded-full inline-flex justify-center items-center text-black">
                        <BadgeCheck />
                    </div>
                </div>
                <button>
                    <Settings />
                </button>
            </div>
        </div>
    )
}