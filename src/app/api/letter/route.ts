import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const departmentId = searchParams.get("departmentId");
  if (!departmentId || isNaN(Number(departmentId))) {
    return NextResponse.json(
      { message: "Invalid department ID" },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.signature.findMany({
      select: {
        letter_id: true,
        isSigned: true,
        descriptions: true,
        signed_date: true,
        letter: {
          select: {
            content: true,
            descriptions: true,
            letter_date: true,
            recipient: true,
            sender: true,
            subject: true,
            status: true,
            letter_type: {
              select: {
                letter_type: true,
              },
            },
          },
        },
        department: {
          select: {
            department_name: true,
          },
        },
      },
      where: {
        department_id: Number(departmentId),
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "unsuccessfully retrieved letter data",
          data: data,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully retrieved letter data",
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

export async function POST(request: NextRequest) {
  const {
    letter_id,
    sender,
    descriptions,
    subject,
    content,
    recipient,
    letter_type,
    department_id,
  } = await request.json();

  try {
    const letter = await prisma.letter.create({
      data: {
        letter_id: letter_id,
        sender: sender,
        subject: subject,
        content: content,
        descriptions: descriptions,
        recipient: recipient,
        letter_type_id: letter_type,
        letter_date: new Date(),
        Signature: {
          create: department_id.map((id: Number) => ({
            department: {
              connect: { department_id: id },
            },
            isSigned: false,
            signed_date: null,
          })),
        },
      },
    });

    if (letter) {
      return NextResponse.json(
        {
          message: "Successfully created new letter",
          data: letter,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error During Creating letter: ", error.message);
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
