import { apiFetch } from "@/utils/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("authorization") ?? "";

        const data = await apiFetch("/v1/user/me", {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: cookie ?? "",
            },
        });

        if (data.error) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(data.data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
