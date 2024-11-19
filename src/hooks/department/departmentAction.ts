"use server";

import { cookies } from "next/headers";

export interface Department {
  department_id: number;
  department_name: string;
  department_head: string;
}

export interface AddDepartment {
  department_name: string;
  department_head: string;
}

interface GetDepartmentsResponse {
  status: boolean;
  data?: Department[];
  message?: string;
}

const userCookies = cookies().get("USER");
const tokenParsed = userCookies ? JSON.parse(userCookies.value) : null;

export async function getDepartments(): Promise<GetDepartmentsResponse> {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function findDepartment(id: number) {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/department/?department_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function addDepartment(data: AddDepartment) {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      message: "Successfully added new department",
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function updateDepartment(data: AddDepartment) {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/departments`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      message: "Successfully added new department",
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function deleteDepartment(id: number) {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/departments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ department_id: Number(id) }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const responseData = await res.json();

    return {
      status: true,
      message: "Successsfully Delete Data Department",
      data: responseData,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}
