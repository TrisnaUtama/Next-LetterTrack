import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/validationToken";

export async function GET(request: NextRequest) {
  const division_id = request.nextUrl.searchParams.get("division_id");
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

  if (!division_id && !deputy_id)
    return NextResponse.json(
      {
        message: "division or deputy id is required",
      },
      { status: 400 }
    );

  if (division_id) {
    try {
      const res = await prisma.division.findUnique({
        where: {
          division_id: Number(division_id),
        },
      });

      if (!res)
        return NextResponse.json({ message: "Not Found" }, { status: 404 });

      return NextResponse.json(
        { message: "succesfully retrieved data division.", data: res },
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

  if (deputy_id) {
    try {
      const res = await prisma.division.findMany({
        where: {
          deputy_id: Number(deputy_id),
        },
      });

      if (res.length === 0)
        return NextResponse.json({ message: "Not Found" }, { status: 404 });

      if (!res)
        return NextResponse.json({ message: "Not Found" }, { status: 404 });

      return NextResponse.json(
        { message: "succesfully retrieved data division.", data: res },
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
}
