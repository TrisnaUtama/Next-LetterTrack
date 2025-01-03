"use server";

import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/validationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const deputy_id = searchParams.get("deputy_id");
  const employee_type = searchParams.get("employee_type_id");
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
    let whereCondition = {};

    if (Number(employee_type) != 1) {
      whereCondition = {
        OR: [
          {
            department: {
              Division: {
                deputy_id: Number(deputy_id),
              },
            },
          },
          {
            deputy_id: Number(deputy_id),
          },
          {
            Division: {
              deputy_id: Number(deputy_id),
            },
          },
        ],
      };
    }

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
      where: whereCondition,
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          message: "No letter data found",
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
          error.message || "An error occurred while processing the request",
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
    primary_organization_type,
    primary_organization_id,
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

  if (existLetter) {
    return NextResponse.json(
      {
        message: "Letter id already exists!",
      },
      {
        status: 400,
      }
    );
  }

  const createSignatures = () => {
    const allSignatures = [];

    if (deputy_id) {
      allSignatures.push(
        ...deputy_id.map((id: number) => ({
          Deputy: {
            connect: { deputy_id: id },
          },
          status:
            id === primary_organization_id &&
            primary_organization_type === "deputy"
              ? "ARRIVE"
              : "NOT_ARRIVE",
        }))
      );
    }

    if (division_id) {
      allSignatures.push(
        ...division_id.map((id: number) => ({
          Division: {
            connect: { division_id: id },
          },
          status:
            id === primary_organization_id &&
            primary_organization_type === "division"
              ? "ARRIVE"
              : "NOT_ARRIVE",
        }))
      );
    }

    if (department_id) {
      allSignatures.push(
        ...department_id.map((id: number) => ({
          department: {
            connect: { department_id: id },
          },
          status:
            id === primary_organization_id &&
            primary_organization_type === "department"
              ? "ARRIVE"
              : "NOT_ARRIVE",
        }))
      );
    }

    return allSignatures;
  };

  const signatures = createSignatures();
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
          create: signatures,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Successfully created new letter",
        data: letter,
      },
      { status: 200 }
    );
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
  const {
    letter_id,
    sender,
    subject,
    recipient,
    letter_type,
    department_id,
    division_id,
    deputy_id,
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
      (signature) =>
        signature.department_id != null &&
        !department_id.includes(signature.department_id)
    );

    const deletedDivision = existingSignatures.filter(
      (signature) =>
        signature.division_id != null &&
        !division_id.includes(signature.division_id)
    );

    const deletedDeputy = existingSignatures.filter(
      (signature) =>
        signature.deputy_id != null && !deputy_id.includes(signature.deputy_id)
    );

    if (
      deletedDepartment.length > 0 ||
      deletedDivision.length > 0 ||
      deletedDeputy.length > 0
    ) {
      const deletedDepartmentIds = deletedDepartment.map(
        (signature) => signature.signature_id
      );

      const deletedDivisionIds = deletedDivision.map(
        (signature) => signature.signature_id
      );

      const deletedDeputyIds = deletedDeputy.map(
        (signature) => signature.signature_id
      );

      const mergedIds = [
        ...deletedDepartmentIds,
        ...deletedDivisionIds,
        ...deletedDeputyIds,
      ];

      await prisma.signature.deleteMany({
        where: {
          signature_id: {
            in: mergedIds,
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
    const newDivisionIds = division_id.filter(
      (newId: number) =>
        !existingSignatures.some(
          (currentDeartment) => currentDeartment.division_id == newId
        )
    );
    const newDeputyIds = deputy_id.filter(
      (newId: number) =>
        !existingSignatures.some(
          (currentDeartment) => currentDeartment.deputy_id == newId
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

    if (newDivisionIds.length > 0) {
      await prisma.signature.createMany({
        data: newDivisionIds.map((newId: number) => ({
          letter_id: letter_id,
          division_id: newId,
        })),
      });
    }

    if (newDeputyIds.length > 0) {
      await prisma.signature.createMany({
        data: newDeputyIds.map((newId: number) => ({
          letter_id: letter_id,
          deputy_id: newId,
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
