import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const department_id = request.nextUrl.searchParams.get("department_id");

  if (!department_id)
    return NextResponse.json(
      {
        message: "department_id is required",
      },
      { status: 400 }
    );

  try {
    const res = await prisma.department.findUnique({
      where: {
        department_id: Number(department_id),
      },
    });

    if (!res)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(
      { message: "succesfully retrieved data departments.", data: res },
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
