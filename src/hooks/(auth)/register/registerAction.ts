"use server";

import { cookies } from "next/headers";

export type Employee = {
  employee_name: string;
  address: string;
  gender: string;
  birth: string;
  email: string;
  phone_number: string;
  department_id: number;
  employee_type_id: number;
  password: string;
};

export type FetchEmployeesResult =
  | { success: true; data: Employee[] }
  | { success: false; message: string };

const userCookies = cookies().get("USER");

let tokenParsed: any;
if (userCookies) {
  try {
    tokenParsed = JSON.parse(userCookies.value);
  } catch (error) {
    console.error("Error parsing user cookies:", error);
    throw new Error("Invalid user session.");
  }
} else {
  throw new Error("User cookie not found.");
}

export default async function RegisterEmployee(
  data: Employee
): Promise<FetchEmployeesResult> {
  const token = tokenParsed.token;
  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response:", errorData);
      return {
        success: false,
        message: errorData.message || `HTTP error! status: ${res.status}`,
      };
    }

    const responseData = await res.json();

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while registering the employee.",
    };
  }
}
