import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/validationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const letter_id = searchParams.get("letter_id");

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

  if (!letter_id) {
    return NextResponse.json(
      { message: "Missing or invalid letter_id parameter" },
      { status: 400 }
    );
  }

  try {
    const signatures = await prisma.signature.findMany({
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
        Deputy: {
          select: {
            deputy_id: true,
            deputy_name: true,
          },
        },
        Division: {
          select: {
            division_id: true,
            division_name: true,
          },
        },
        department: {
          select: {
            department_id: true,
            department_name: true,
          },
        },
      },
      where: {
        letter_id: letter_id,
      },
    });

    if (!signatures || signatures.length === 0) {
      return NextResponse.json(
        {
          message: "No signatures found for the given letter ID",
          data: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully retrieved signatures",
        data: signatures,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error During Fetching Data: ", error.message);
    return NextResponse.json(
      {
        message:
          error.message || "An error occurred while processing the request",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const {
    descriptions,
    signature_id,
    letter_id,
    department_id,
    deputy_id,
    division_id,
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

  if (!signature_id || !letter_id) {
    return NextResponse.json(
      { message: "Invalid signature ID or letter ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.signature.updateMany({
      where: {
        letter_id: letter_id,
        department_id: department_id,
        deputy_id: deputy_id,
        division_id: division_id,
      },
      data: {
        status: "ARRIVE",
      },
    });

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
