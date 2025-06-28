import { apiFetch } from "@/utils/fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const data = await apiFetch("/v1/auth/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Data:", data);

        if (data.error) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = NextResponse.json(data.data);

        response.cookies.set("refresh_token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
