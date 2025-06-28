import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/utils/fetch";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { email, password } = body;

    const result = await apiFetch("/v1/auth/login", {
        method: "POST",
        body: {
            email: email,
            username: email,
            password: password,
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

    const cookies = headers.get("set-cookie");
    if (cookies) {
        const cookieArray = cookies.split(/,(?=[^;]+=)/);
        for (const cookie of cookieArray) {
            res.headers.append("set-cookie", cookie.trim());
        }
    }

    return res;
}
