"use server";

import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function verifyToken(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json(
      {
        message: "Unauthorized: Missing authorization token",
      },
      { status: 405 }
    );
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized: Missing token",
      },
      { status: 401 }
    );
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      {
        message: "Server Error: JWT secret is missing",
      },
      { status: 500 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const decoded = await jose.jwtVerify(token, secret);
    return {
      success: true,
      data: decoded.payload,
    };
  } catch (error: any) {
    console.log("Error during token verification:", error.message);
    return NextResponse.json(
      {
        message: "Unauthorized: Invalid or expired token",
      },
      { status: 401 }
    );
  }
}
