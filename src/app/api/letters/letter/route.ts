"use server";

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const letter_id = request.nextUrl.searchParams.get("letter_id") ?? undefined;

  if (!letter_id)
    NextResponse.json({
      message: "letter id is required",
      status: 400,
    });

  try {
    const response = await prisma.letter.findUnique({
      where: {
        letter_id: letter_id,
      },
      select: {
        letter_id: true,
        letter_type_id: true,
        sender: true,
        subject: true,
        recipient: true,
        Signature: {
          select: {
            department_id: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        message: "Successfully retrieved letter",
        data: response,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      message: error.message || "An occured error while processing request",
      status: 500,
    });
  }
}
