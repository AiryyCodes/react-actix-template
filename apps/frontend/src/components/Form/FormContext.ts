import { createContext, useContext } from "react";

type FormDataContextType = unknown;

const FormDataContext = createContext<FormDataContextType | undefined>(
    undefined
);

export function useFormDataContext<T>() {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error("useFormDataContext must be used within a Form");
    }
    return context as T;
}

export const FormDataProvider = FormDataContext.Provider;
