import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const letter_id = searchParams.get("letter_id");
  if (!letter_id || letter_id.length <= 0)
    return NextResponse.json(
      { message: "Invalid department ID" },
      { status: 400 }
    );
  try {
    const data = await prisma.signature.findMany({
      select: {
        letter_id: true,
        isSigned: true,
        signed_date: true,
        descriptions: true,
        department: {
          select: {
            department_name: true,
            department_head: true,
          },
        },
      },
      where: {
        letter_id: letter_id,
      },
    });
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "unsuccessfully retrieved signature data",
          data: data,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully retrieved signature data",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error During Fetching data: ", error.message);
    return NextResponse.json(
      {
        message:
          error.message || "an error occurred while processing the request",
      },
      {
        status: 500,
      }
    );
  }
}
