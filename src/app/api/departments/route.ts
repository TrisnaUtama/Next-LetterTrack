import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.department.findMany();
    if (!data || data.length === 0)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(
      { message: "succesfully retrieved data departments.", data: data },
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
  const { department_name, department_head } = await request.json();
  try {
    if (!department_name)
      return NextResponse.json(
        {
          message: "department name must be filled",
        },
        {
          status: 400,
        }
      );

    if (!department_head)
      return NextResponse.json(
        {
          message: "department head must be filled",
        },
        {
          status: 400,
        }
      );
    const departments = await prisma.department.findMany();
    const departmentExists = departments.some(
      (department) => department.department_name === department_name
    );

    if (departmentExists)
      return NextResponse.json(
        {
          message: "department name already exits",
        },
        {
          status: 409,
        }
      );
    const data = await prisma.department.create({
      data: {
        department_name: department_name,
        department_head: department_head,
      },
    });

    return NextResponse.json(
      { message: "succesfully create data department.", data: data },
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
  const { department_id, department_name, department_head } =
    await request.json();
  if (!department_id) {
    return NextResponse.json(
      { message: "departments not found." },
      { status: 400 }
    );
  }
  try {
    const existingDepartment = await prisma.department.findUnique({
      where: { department_id },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { message: "Department not found." },
        { status: 404 }
      );
    }
    if (!department_name)
      return NextResponse.json(
        {
          message: "department name must be filled",
        },
        {
          status: 400,
        }
      );

    if (!department_head)
      return NextResponse.json(
        {
          message: "department head must be filled",
        },
        {
          status: 400,
        }
      );
    const departments = await prisma.department.findMany();
    const departmentExists = departments.some(
      (department) => department.department_name === department_name
    );
    if (departmentExists)
      return NextResponse.json(
        {
          message: "department name already exits",
        },
        {
          status: 409,
        }
      );

    const updatedDepartments = await prisma.department.update({
      where: { department_id },
      data: {
        department_name,
        department_head,
      },
    });
    return NextResponse.json(
      {
        message: "success update new employee",
        data: updatedDepartments,
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
  const { department_id } = await request.json();
  try {
    const deletedDepartment = await prisma.department.delete({
      where: {
        department_id: department_id,
      },
    });

    return NextResponse.json(
      {
        message: "Success Delete Department",
        data: deletedDepartment,
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
