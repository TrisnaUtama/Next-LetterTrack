import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/validationToken";

export async function GET(request: NextRequest) {
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
    const divisions = await prisma.division.findMany();

    if (!divisions || divisions.length === 0)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(
      { message: "succesfully retrieved data divisions.", data: divisions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error During Fetching data : ", error);
    return NextResponse.json(
      {
        message: "an error occured while processing request",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const tokenResponse = await verifyToken(request);
  const { division_name, head_division, deputy_id } = await request.json();

  if (!division_name)
    return NextResponse.json(
      {
        message: "division name must be filled",
      },
      {
        status: 400,
      }
    );

  if (!head_division)
    return NextResponse.json(
      {
        message: "head division must be filled",
      },
      {
        status: 400,
      }
    );

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
    const divisions = await prisma.division.findMany();
    const exist_division = divisions.some(
      (division) => division.division_name === division_name
    );

    if (exist_division)
      return NextResponse.json(
        {
          message: "deputy name already exits",
        },
        {
          status: 409,
        }
      );

    const new_division = await prisma.division.create({
      data: {
        division_name: division_name,
        head_division: head_division,
        deputy_id,
      },
    });

    return NextResponse.json(
      { message: "succesfully create data division.", data: new_division },
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

export async function PATCH(request: NextRequest) {
  const tokenResponse = await verifyToken(request);
  const { division_id, division_name, head_division, deputy_id } =
    await request.json();
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
    if (!division_name)
      return NextResponse.json(
        {
          message: "division name must be filled",
        },
        {
          status: 400,
        }
      );

    if (!head_division)
      return NextResponse.json(
        {
          message: "division head must be filled",
        },
        {
          status: 400,
        }
      );

    const updated_deputy = await prisma.division.update({
      where: { division_id },
      data: {
        division_name,
        head_division,
        division_id,
      },
    });
    return NextResponse.json(
      {
        message: "success update new division",
        data: updated_deputy,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const tokenResponse = await verifyToken(request);
  const { division_id } = await request.json();

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
    await prisma.division.delete({
      where: {
        division_id: division_id,
      },
    });

    return NextResponse.json(
      {
        message: `Success Delete Division with id ${division_id}`,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("error message: ", error.message);
    return NextResponse.json(
      {
        message: error.message || "error occured while trying to get request.",
      },
      { status: 500 }
    );
  }
}
