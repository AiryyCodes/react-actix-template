"use client";

import { Form } from "@/components/Form/Form";
import { FormButton } from "@/components/Form/FormButton";
import { FormInput } from "@/components/Form/FormInput";
import { FormValidation } from "@/components/Form/FormValidation";
import { useUser } from "@/context/UserContext";
import { redirect } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(3, { message: "Username must be at least 3 characters" })
        .max(36, {
            message: "Username must be at most 36 characters",
        }),

    email: z.string({ required_error: "Email is required" }).email(),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(255, { message: "Password must be at most 255 characters" }),

    confirmPassword: z
        .string({ required_error: "Confirmation password is required" })
        .min(8, {
            message: "Confirmation password must be at least 8 characters",
        })
        .max(255, {
            message: "Confirmation password must be at most 255 characters",
        }),
});

type LoginForm = z.infer<typeof schema>;

const RegisterPage = () => {
    const { user, setUser } = useUser();

    if (user) {
        redirect("/");
    }

    const onSubmit = async (
        data: LoginForm,
        methods: UseFormReturn<LoginForm>
    ) => {
        if (data.password != data.confirmPassword) {
            methods.setError("root", {
                type: "manual",
                message: "Passwords do not match. Please try again.",
            });
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            }),
        });

        if (!res.ok) {
            const errorResponse = await res.json();
            methods.setError("root", {
                type: "manual",
                message: errorResponse.error || "Invalid email or password",
            });
            return;
        }

        const responseData = await res.json();

        setUser(responseData.user);
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center gap-6 p-6 rounded-xl">
            <h1 className="text-xl font-medium">Sign up</h1>
            <Form schema={schema} onSubmit={onSubmit} className="">
                <FormValidation for="all" />
                <FormInput name="username" label="Username" />
                <FormInput name="email" label="Email" />
                <FormInput name="password" label="Password" type="password" />
                <FormInput
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                />
                <FormButton>Sign up</FormButton>
                <p className="flex gap-2 text-gray-600">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-600">
                        Sign in
                    </a>
                </p>
            </Form>
        </div>
    );
};

export default RegisterPage;
