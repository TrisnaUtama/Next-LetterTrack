import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/validationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const deputy_id = searchParams.get("deputy_id");
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

  try {
    const deputy_signature = await prisma.signature.findMany({
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
      },
      where: {
        Deputy: {
          NOT: {
            deputy_id: undefined,
          },
        },
      },
    });

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
            department_name: true,
            department_id: true,
          },
        },
      },
      where: {
        OR: [
          {
            department: {
              Division: {
                deputy_id: Number(deputy_id),
              },
            },
          },
          {
            Division: {
              deputy_id: Number(deputy_id),
            },
          },
        ],
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

    const mergedData = [...deputy_signature, ...data];

    return NextResponse.json(
      {
        message: "Successfully retrieved letter data",
        data: mergedData,
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
        deputy_id: deputy_id,
        division_id: division_id,
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
