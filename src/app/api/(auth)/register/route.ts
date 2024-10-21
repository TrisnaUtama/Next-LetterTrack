import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import generateEmployeeId from "@/utils/generateId";
import hashPassword from "@/utils/hashedPassword";

export async function POST(request: NextRequest) {
  const {
    employee_name,
    email,
    address,
    phone_number,
    birth,
    gender,
    department_id,
    employee_type_id,
    password,
  } = await request.json();

  try {
    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format for birth." },
        { status: 400 }
      );
    }
    console.log(password)
    const employeeId = generateEmployeeId();
    const newEmployee = await prisma.employee.create({
      data: {
        employee_name: employee_name,
        email: email,
        status: "ACTIVE",
        address: address,
        gender: gender,
        employee_type_id: employee_type_id,
        birth: birthDate,
        department_id: department_id,
        createdAt: new Date(),
        updatedAt: null,
        phone_number: phone_number,
        employee_id: employeeId,
        password: await hashPassword(password),
      },
    });

    if (!newEmployee)
      return NextResponse.json(
        {
          message: "there's something wrong with the system",
        },
        { status: 500 }
      );

    return NextResponse.json(
      {
        message: "success create new employee",
        data: newEmployee,
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
