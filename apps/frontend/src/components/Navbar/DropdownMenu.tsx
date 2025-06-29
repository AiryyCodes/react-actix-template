"use client";

import { useState } from "react";
import DropdownArrow from "../Icons/DropdownArrow";
import Button from "../Button";
import { useUser } from "@/context/UserContext";

export default function DropdownMenu() {
    const { user, setUser } = useUser();

    const [open, setOpen] = useState(false);

    if (!user) {
        return <></>;
    }

    const logout = async () => {
        const res = await fetch("/api/auth/logout", {
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            return;
        }

        setOpen(false);
        setUser(null);
    };

    return (
        <div className="relative inline-block text-left">
            <Button
                label={user.username}
                type="plain"
                onClick={() => setOpen(!open)}
                endElement={
                    <DropdownArrow
                        fill="black"
                        className={`w-3 h-auto transition-transform duration-200 ${open && "rotate-180"}`}
                    />
                }
            />

            <div
                className={`
          absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5
          transition-all duration-200 ease-out
          ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
            >
                <div className="p-2">
                    <Button
                        onClick={() => logout()}
                        label="Logout"
                        type="plain"
                        className="text-red-500 hover:bg-red-400 hover:text-gray-800"
                    />
                </div>
            </div>
        </div>
    );
}
