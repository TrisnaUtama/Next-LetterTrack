"use server";

import { cookies } from "next/headers";

export type LoginResult =
  | { success: true; redirect: string }
  | { success: false; error: string }
  | null;

export interface Employee {
  employee_id: string;
  employee_name: string;
  gender: string;
  birth: string;
  email: string;
  phone_number: string;
  status?: string;
  address: string;
  department_id: number;
  employee_type_id: number;
}

export default async function loginAction(
  username: string,
  password: string
): Promise<LoginResult> {
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
        path = "/letter";
      } else if (user_role == 3) {
        path = "/letter";
      } else {
        path = "/letter";
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

export async function userLogin() {
  const userCookies = cookies().get("USER");
  const tokenParsed = JSON.parse(userCookies!.value);

  const token = tokenParsed.token;
  const employee_id = tokenParsed.data.employee_id;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/login?employee_id=${employee_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const responseData: { data: Employee } = await res.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching employees:", error.message);
    return {
      success: false,
      message: error.message || "An error occurred while fetching employees",
    };
  }
}
