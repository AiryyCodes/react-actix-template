"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@types";

type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

type Props = {
    initialUser: User | null;
    children: React.ReactNode;
};

export function UserProvider({ initialUser, children }: Props) {
    const [user, setUser] = useState<User | null>(initialUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
