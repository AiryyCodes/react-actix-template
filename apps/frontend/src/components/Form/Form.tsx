"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    FormProvider,
    UseFormProps,
    SubmitHandler,
    UseFormReturn,
} from "react-hook-form";
import { ZodType, z } from "zod";
import { FormDataProvider } from "./FormContext";

type FormProps<T extends ZodType<any, any>> = {
    schema: T;
    onSubmit: (data: z.infer<T>, methods: UseFormReturn<z.infer<T>>) => void;
    children: React.ReactNode;
    options?: UseFormProps<z.infer<T>>;
    className?: string;
};

export function Form<T extends ZodType<any, any>>({
    schema,
    onSubmit,
    children,
    options,
    className,
}: FormProps<T>) {
    const methods = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        ...options,
    });

    return (
        <FormDataProvider value={{} as any as z.infer<T>}>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) =>
                        onSubmit(data, methods)
                    )}
                    suppressHydrationWarning
                    className={`flex flex-col gap-2 ${className}`}
                >
                    {children}
                </form>
            </FormProvider>
        </FormDataProvider>
    );
}
