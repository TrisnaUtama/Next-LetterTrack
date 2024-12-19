"use server";

import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/validationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const departmentId = searchParams.get("departmentId");
  const tokenResponse = await verifyToken(request);

  if (tokenResponse instanceof NextResponse) {
    return tokenResponse;
  }

  if (!tokenResponse.success) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }
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
    letter_type_id,
    department_id,
    division_id,
    deputy_id,
    login_user_department_id,
  } = await request.json();
  const tokenResponse = await verifyToken(request);
  if (tokenResponse instanceof NextResponse) {
    return tokenResponse;
  }

  if (!tokenResponse.success) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  const existLetter = await prisma.letter.findUnique({
    where: {
      letter_id: letter_id,
    },
  });

  if (letter_id == existLetter?.letter_id) {
    return NextResponse.json(
      {
        message: "Letter id already exists ! ",
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
        letter_type_id: letter_type_id,
        letter_date: new Date(),
        Signature: {
          create: department_id.map((id: Number) => ({
            department: {
              connect: { department_id: id },
            },
            Division : {
              
            },
            status: id == login_user_department_id ? "ARRIVE" : "NOT_ARRIVE",
          })),
        }
        ,
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

  const tokenResponse = await verifyToken(request);

  if (tokenResponse instanceof NextResponse) {
    return tokenResponse;
  }

  if (!tokenResponse.success) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  if (!letter_id)
    return NextResponse.json({
      message: "letter not found",
      status: 400,
    });

  try {
    const existingSignatures = await prisma.signature.findMany({
      where: { letter_id: letter_id },
    });

    const deletedDepartment = existingSignatures.filter(
      (signature) => !department_id.includes(signature.department_id)
    );

    if (deletedDepartment.length > 0) {
      const deletedSignatureIds = deletedDepartment.map(
        (signature) => signature.signature_id
      );

      await prisma.signature.deleteMany({
        where: {
          signature_id: {
            in: deletedSignatureIds,
          },
        },
      });
    }

    const newDepartmentIds = department_id.filter(
      (newId: number) =>
        !existingSignatures.some(
          (currentDeartment) => currentDeartment.department_id == newId
        )
    );

    if (newDepartmentIds.length > 0) {
      await prisma.signature.createMany({
        data: newDepartmentIds.map((newId: number) => ({
          letter_id: letter_id,
          department_id: newId,
        })),
      });
    }

    const response = await prisma.letter.update({
      where: {
        letter_id: letter_id,
      },
      data: {
        sender: sender,
        subject: subject,
        recipient: recipient,
        letter_type_id: letter_type,
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
