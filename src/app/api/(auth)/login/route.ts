import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import validateUsername from "@/utils/usernameValidate";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { verifyToken } from "@/lib/validationToken";

export async function GET(request: NextRequest) {
  const employee_id = request.nextUrl.searchParams.get("employee_id");
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
    const data = await prisma.employee.findUnique({
      where: {
        employee_id: employee_id,
      },
    });
    return NextResponse.json(
      {
        message: "successfully retreived data user login",
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    if (!validateUsername(username).isValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 }
      );
    }

    const user = await prisma.employee.findFirst({
      where: { employee_name: username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ userId: user.employee_id })
      .setProtectedHeader({ alg, typ: "JWT" })
      .setExpirationTime("72h")
      .setSubject(user.employee_id)
      .sign(secret);

    return NextResponse.json({ data: user, token: jwt }, { status: 200 });
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
