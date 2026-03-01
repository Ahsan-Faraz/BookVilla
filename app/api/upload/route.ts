import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { MAX_FILE_SIZE } from "@/lib/constants";

// Allow large uploads in the API route
export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const filename = formData.get("filename") as string | null;
        const contentType = formData.get("contentType") as string | null;

        if (!file || !filename) {
            return NextResponse.json(
                { error: "File and filename are required" },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (contentType && !allowedTypes.includes(contentType)) {
            return NextResponse.json(
                { error: "File type not allowed" },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large" },
                { status: 400 }
            );
        }

        const blob = await put(filename, file, {
            access: "public",
            addRandomSuffix: true,
            contentType: contentType || undefined,
            token:
                process.env.BLOB2_READ_WRITE_TOKEN ||
                process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log("File uploaded to blob:", blob.url);

        return NextResponse.json({
            url: blob.url,
            pathname: blob.pathname,
        });
    } catch (e) {
        const message =
            e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Upload error:", e);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
