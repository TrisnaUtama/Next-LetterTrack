import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import validateUsername from "@/utils/usernameValidate";
import bcrypt from "bcryptjs";
import * as jose from "jose";

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
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.employee_id)
      .sign(secret);

    return NextResponse.json({ data: user, token: jwt }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
