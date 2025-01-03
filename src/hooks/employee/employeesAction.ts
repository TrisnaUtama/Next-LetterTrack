"use server";

import { cookies } from "next/headers";

export interface Employee {
  employee_id: string;
  employee_name: string;
  gender: string;
  birth: string;
  email: string;
  phone_number: string;
  status?: string;
  address: string;
  department_id?: number | null;
  deputy_id?: number | null;
  division_id?: number | null;
  employee_type_id: number;
}

export type FetchEmployeesResult =
  | { success: true; data: Employee[] }
  | { success: false; message: string };

const userCookies = cookies().get("USER");
const tokenParsed = JSON.parse(userCookies!.value);

export async function getAllEmployees(): Promise<FetchEmployeesResult> {
  const token = tokenParsed.token;
  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
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

export async function updateAction(
  employee_id: string | null,
  data: Employee
): Promise<FetchEmployeesResult> {
  const token = tokenParsed.token;
  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/employees?${employee_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`HTTP error! status: ${error.message}`);
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

export async function deleteEmployee(employee_id: string) {
  const token = tokenParsed.token;
  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/employees`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ employee_id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response:", errorData);
      return {
        status: false,
        message: errorData.message || `HTTP error! status: ${res.status}`,
      };
    }
    const responseData = await res.json();
    return {
      status: true,
      data: responseData,
    };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return {
      status: false,
      message:
        error.message || "An error occurred while registering the employee.",
    };
  }
}
