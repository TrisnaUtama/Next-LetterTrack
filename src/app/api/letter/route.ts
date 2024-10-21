import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department_id = searchParams.get("department_id");

    if (!department_id) {
      return NextResponse.json(
        {
          message: "department_id is required",
        },
        { status: 400 } 
      );
    }

    const data = await prisma.signature.findMany({
      where: {
        department_id: Number(department_id),
      },
    });

    return NextResponse.json(
      {
        message: "Successfully retrieved letter data",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error During Fetching data : ", error.message);
    return NextResponse.json(
      {
        message: error.message || "an error occured while processing request",
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
    if (letter)
      return NextResponse.json(
        {
          message: "successfuly create new letter",
          data: letter,
        },
        { status: 200 }
      );
  } catch (error: any) {
    console.error("Error During Fetching data : ", error.message);
    return NextResponse.json(
      {
        message: error.message || "an error occured while processing request",
      },
      {
        status: 500,
      }
    );
  }
}
