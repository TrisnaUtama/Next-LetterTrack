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
    const deputys = await prisma.deputy.findMany();

    if (!deputys || deputys.length === 0)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(
      { message: "succesfully retrieved data deputys.", data: deputys },
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
  const { deputy_name, head_deputy } = await request.json();

  if (!deputy_name)
    return NextResponse.json(
      {
        message: "deputy name must be filled",
      },
      {
        status: 400,
      }
    );

  if (!head_deputy)
    return NextResponse.json(
      {
        message: "head deputy must be filled",
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
    const deputys = await prisma.deputy.findMany();
    const exist_deputy = deputys.some(
      (deputy) => deputy.deputy_name === deputy_name
    );

    if (exist_deputy)
      return NextResponse.json(
        {
          message: "deputy name already exits",
        },
        {
          status: 409,
        }
      );

    const new_deputy = await prisma.deputy.create({
      data: {
        deputy_name: deputy_name,
        head_deputy: head_deputy,
      },
    });

    return NextResponse.json(
      { message: "succesfully create data deputy.", data: new_deputy },
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
  const { deputy_name, head_deputy, deputy_id } = await request.json();
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
    if (!deputy_name)
      return NextResponse.json(
        {
          message: "department name must be filled",
        },
        {
          status: 400,
        }
      );

    if (!head_deputy)
      return NextResponse.json(
        {
          message: "department head must be filled",
        },
        {
          status: 400,
        }
      );

    const updated_deputy = await prisma.deputy.update({
      where: { deputy_id },
      data: {
        deputy_name,
        head_deputy,
      },
    });
    return NextResponse.json(
      {
        message: "success update new employee",
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
  const { deputy_id } = await request.json();

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
    await prisma.deputy.delete({
      where: {
        deputy_id: deputy_id,
      },
    });

    return NextResponse.json(
      {
        message: `Success Delete Deputy with id ${deputy_id}`,
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
