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
        signature_id: true,
        letter_id: true,
        status: true,
        signed_date: true,
        descriptions: true,
        department: {
          select: {
            department_id: true,
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

export async function PATCH(request: NextRequest) {
  const { descriptions, signature_id, letter_id, department_id } =
    await request.json();

  if (!signature_id || !letter_id) {
    return NextResponse.json(
      { message: "Invalid signature ID or letter ID" },
      { status: 400 }
    );
  }

  try {
    const dataUpdated = await prisma.signature.update({
      where: {
        signature_id: signature_id,
      },
      data: {
        descriptions: descriptions,
        signed_date: new Date(),
        status: "SIGNED",
      },
    });

    await prisma.signature.updateMany({
      where: {
        letter_id: letter_id,
        department_id: department_id,
      },
      data: {
        status: "ARRIVE",
      },
    });

    const allSignatures = await prisma.signature.findMany({
      where: { letter_id: letter_id },
      select: { status: true },
    });

    const allAreSigned = allSignatures.every(
      (signature) => signature.status === "SIGNED"
    );

    if (allAreSigned) {
      await prisma.letter.update({
        where: {
          letter_id: letter_id,
        },
        data: {
          status: "FINISH",
        },
      });
    }

    return NextResponse.json(
      { message: "Update successful", dataUpdated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during update: ", error.message);
    return NextResponse.json(
      {
        message:
          error.message || "An error occurred while processing the request",
      },
      {
        status: 500,
      }
    );
  }
}
