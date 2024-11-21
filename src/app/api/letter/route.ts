"use server";

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
        signature_id: true,
        letter_id: true,
        status: true,
        descriptions: true,
        signed_date: true,
        letter: {
          select: {
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
            department_id: true,
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
    subject,
    recipient,
    letter_type,
    department_id,
    login_user_department_id,
  } = await request.json();

  const existLetter = await prisma.letter.findUnique({
    where: {
      letter_id: letter_id,
    },
  });

  if (letter_id == existLetter?.letter_id) {
    return NextResponse.json(
      {
        message: "Letter id already exists !",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const letter = await prisma.letter.create({
      data: {
        letter_id: letter_id,
        sender: sender,
        subject: subject,
        recipient: recipient,
        letter_type_id: letter_type,
        letter_date: new Date(),
        Signature: {
          create: department_id.map((id: Number) => ({
            department: {
              connect: { department_id: id },
            },
            status: id == login_user_department_id ? "ARRIVE" : "NOT_ARRIVE",
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

export async function PATCH(request: NextRequest) {
  const { letter_id, sender, subject, recipient, letter_type, department_id } =
    await request.json();

  if (!letter_id)
    NextResponse.json({
      message: "letter not found",
      status: 400,
    });

  try {
    const existingSignatures = await prisma.signature.findMany({
      where: { letter_id: letter_id },
    });

    const existingDepartmentIds = existingSignatures.map(
      (signature) => signature.department_id
    );

    const newDepartmentIds = department_id.filter(
      (id: number) => !existingDepartmentIds.includes(id)
    );

    const response = await prisma.letter.update({
      where: {
        letter_id: letter_id,
      },
      data: {
        sender: sender,
        subject: subject,
        recipient: recipient,
        letter_type_id: letter_type,
        letter_date: new Date(),
        Signature: {
          create: newDepartmentIds.map((id: number) => ({
            department: {
              connect: { department_id: id },
            },
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Letter updated successfully",
      data: response,
    });
  } catch (error: any) {
    console.log(error.message);
    NextResponse.json({
      mmessage: error.message || "An occured error while processing request",
    });
  }
}
