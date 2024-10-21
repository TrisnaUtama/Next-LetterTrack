"use server";

import { cookies } from "next/headers";

const userCookies = cookies().get("USER");
const tokenParsed = JSON.parse(userCookies!.value);

export type Employee = {
  employee_id: string;
  employee_name: string;
  gender: string;
  birth: string;
  email: string;
  phone_number: string;
  status: string;
  department_id: number;
  address: string;
  employee_type_id: number;
};

export type FetchEmployeeResult =
  | { success: true; data: Employee }
  | { success: false; message: string };

export default async function findAction(
  employee_id: string
): Promise<FetchEmployeeResult> {
  const token = tokenParsed.token;
  try {
    const res = await fetch(
      `${
        process.env.ROOT_URL
      }/api/employees/find?employee_id=${encodeURIComponent(employee_id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res}`);
    }

    const responseData = await res.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching employees",
    };
  }
}
