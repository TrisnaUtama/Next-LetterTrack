import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
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
    const data = await prisma.employee.findMany({
      where: {
        status: "ACTIVE",
        employee_type_id: {
          not: 1,
        },
      },
    });
    return NextResponse.json(
      {
        message: "successfully retreived data employees",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
  const {
    employee_id,
    employee_name,
    email,
    address,
    phone_number,
    birth,
    gender,
    department_id,
    employee_type_id,
  } = await request.json();

  if (!employee_id) {
    return NextResponse.json(
      { message: "Employee ID is required." },
      { status: 400 }
    );
  }
  const birthDate = new Date(birth);
  if (isNaN(birthDate.getTime())) {
    return NextResponse.json(
      { message: "Invalid date format for birth." },
      { status: 400 }
    );
  }

  try {
    const updateEmployee = await prisma.employee.update({
      where: {
        employee_id: employee_id,
      },
      data: {
        address: address,
        birth: birthDate,
        email: email,
        employee_name: employee_name,
        phone_number: phone_number,
        department_id: department_id,
        gender: gender,
        employee_type_id: employee_type_id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "success update new employee",
        data: updateEmployee,
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
  const { employee_id } = await request.json();
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
  if (!employee_id) {
    return NextResponse.json(
      { message: "Employee ID is required." },
      { status: 400 }
    );
  }

  try {
    const deletedEmployee = await prisma.employee.delete({
      where: {
        employee_id: employee_id,
      },
    });
    return NextResponse.json(
      { message: "success delete employee", data: deletedEmployee },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
