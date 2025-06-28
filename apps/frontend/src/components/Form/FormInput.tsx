"use client";

import { useFormContext } from "react-hook-form";

type FormInputProps = {
    name: string;
    label?: string;
    type?: React.HTMLInputTypeAttribute;
};

export function FormInput({ name, label, type = "text" }: FormInputProps) {
    const { register } = useFormContext();

    return (
        <div className="bg-gray-200 focus-within:bg-gray-300/40 rounded-xl font-medium flex flex-row items-center py-2 pl-3 gap-2 transition-colors">
            <input
                placeholder={label}
                id={name}
                type={type}
                {...register(name)}
                suppressHydrationWarning
                className="bg-transparent outline-none border-none text-md text-black/75 w-full"
            />
        </div>
    );
}
