import React, { ButtonHTMLAttributes } from "react";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    type?: "submit" | "button";
};

export function FormButton({
    type = "submit",
    children,
    ...rest
}: FormButtonProps) {
    return (
        <button
            type={type}
            {...rest}
            className="bg-blue-500 rounded-xl font-medium text-white px-6 py-2 text-md"
        >
            {children}
        </button>
    );
}
