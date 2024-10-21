import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const employee_id = request.nextUrl.searchParams.get("employee_id");
  if (!employee_id) {
    return NextResponse.json(
      { message: "Employee ID is required." },
      { status: 400 }
    );
  }


  try {
    const findEmployee = await prisma.employee.findUnique({
      where: {
        employee_id: employee_id,
      },
    });

    if (findEmployee === null)
      return NextResponse.json(
        {
          message: "employee not found",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        message: "success find employee",
        data: findEmployee,
      },
      { status: 200 }
    );
  } catch (error: any) {
    NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
