"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { useUser } from "@/context/UserContext";
import DropdownMenu from "./DropdownMenu";

const Navbar = () => {
    const router = useRouter();
    const { user } = useUser();

    return (
        <nav className="relative w-full max-w-[60rem] mx-auto px-4 py-3 lg:bg-transparent bg-transparent">
            <div className="flex flex-col lg:flex-row justify-between items-center h-full">
                {/* Left & Right */}
                <div className="flex justify-between items-center w-full">
                    {/* Left*/}
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-medium">
                            React and Actix Template
                        </h1>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu />
                        ) : (
                            <Button
                                label="Sign in"
                                onClick={() => router.push("/auth/login")}
                            />
                        )}
                    </div>
                </div>

                {/* Center absolutely for large screens */}
                <div className="mt-2 lg:mt-0 text-center relative lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"></div>
            </div>
        </nav>
    );
};

export default Navbar;
