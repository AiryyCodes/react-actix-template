import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/utils/fetch";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, username, password, confirmPassword } = body;

    const result = await apiFetch("/v1/auth/register", {
        method: "POST",
        credentials: "include",
        body: {
            email: email,
            username: username,
            password: password,
            confirm_password: confirmPassword,
        },
    });

    if (result.error) {
        return new NextResponse(
            JSON.stringify({ error: result.error.message }),
            {
                status: result.error.status || 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const { data, headers } = result;

    const res = new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

    const setCookies = headers?.get("set-cookie");
    if (setCookies) {
        for (const cookie of setCookies) {
            res.headers.append("set-cookie", cookie);
        }
    }

    return res;
}
