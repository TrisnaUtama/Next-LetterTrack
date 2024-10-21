"use server";

import { cookies } from "next/headers";

export type LoginResult =
  | { success: true; redirect: string }
  | { success: false; error: string }
  | null;

export default async function loginAction(
  prevState: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      cookies().set("Authorization", data.token, {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        path: "/",
        sameSite: "strict",
      });

      cookies().set("USER", JSON.stringify(data), {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        path: "/",
        sameSite: "strict",
      });
      const user_role = data.data.employee_type_id;
      let path;
      if (user_role == 1) {
        path = "/superadmin";
      } else if (user_role == 2) {
        path = "/secretary";
      } else if (user_role == 3) {
        path = "/receptionist";
      } else {
        path = "/basic";
      }
      return { success: true, redirect: path };
    } else {
      return {
        success: false,
        error: data.message || "An error occurred during login",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
