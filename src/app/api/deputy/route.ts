import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/validationToken";

export async function GET(request: NextRequest) {
  const deputy_id = request.nextUrl.searchParams.get("deputy_id");

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

  if (!deputy_id)
    return NextResponse.json(
      {
        message: "deputy id is required",
      },
      { status: 400 }
    );

  try {
    const res = await prisma.deputy.findUnique({
      where: {
        deputy_id: Number(deputy_id),
      },
    });

    if (!res)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(
      { message: "succesfully retrieved data deputy.", data: res },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    NextResponse.json(
      {
        messsage: error.message,
      },
      {
        status: 500,
      }
    );
  }
}