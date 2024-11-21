"use server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.letter.findMany({
      select: {
        letter_type_id: true,
        letter_date: true,
        status: true,
        Signature: {
          select: {
            signed_date: true,
            status: true,
          },
        },
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "Unsuccessfully retrieved letter data",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully retrieved all letters data",
        data: data,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error while fetching letters data:", error);

    return NextResponse.json(
      {
        message: error.message || "An error occurred while fetching data",
      },
      {
        status: 500,
      }
    );
  }
}
