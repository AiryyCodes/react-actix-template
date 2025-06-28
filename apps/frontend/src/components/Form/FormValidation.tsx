import React from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { useFormDataContext } from "./FormContext";

type FormValidationProps<T> = {
    for: keyof T | "all";
};

export function FormValidation<T extends FieldValues>({
    for: field,
}: FormValidationProps<T>) {
    useFormDataContext<T>();

    const {
        formState: { errors },
    } = useFormContext<T>();

    if (field === "all") {
        const allErrors = Object.values(errors)
            .map((error) => (error as any)?.message)
            .filter(Boolean);

        if (allErrors.length === 0) return null;

        return (
            <ul className="text-white text-center font-normal bg-red-400 border-2 border-red-500/50 rounded-xl px-4 py-3">
                {allErrors.map((message, i) => (
                    <li key={i}>{message}</li>
                ))}
            </ul>
        );
    }

    const fieldError = errors[field as keyof T];
    if (!fieldError) return null;

    return (
        <p style={{ color: "red", margin: "0.25em 0" }}>
            {(fieldError as any).message}
        </p>
    );
}
