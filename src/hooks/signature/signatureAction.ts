"use server";

import { cookies } from "next/headers";

const userCookies = cookies().get("USER");
const cookiesParsed = userCookies ? JSON.parse(userCookies.value) : null;

export interface Signature {
  signature_id: number;
  letter_id: string;
  status: string;
  signed_date: string | null;
  descriptions: string | null;
  department: {
    department_id: number;
    department_name: string;
    department_head: string;
  };
  Deputy: {
    deputy_id: number;
    deputy_name: string;
    deputy_head: string;
  };
  Division: {
    division_id: number;
    division_name: string;
    division_head: string;
  };
}

export async function updateStatus(
  descriptions: string,
  letter_id: string,
  department_id: number | null,
  deputy_id: number | null,
  division_id: number | null,
  signature_id: number
) {
  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }
  const token = cookiesParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/letter/signature`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        descriptions,
        letter_id,
        signature_id,
        department_id,
        deputy_id,
        division_id,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const responseData = await res.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching letters:", error.message);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function getSignature(letter_id: string) {
  const userCookies = cookies().get("USER");
  const cookiesParsed = userCookies ? JSON.parse(userCookies.value) : null;

  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }
  const token = cookiesParsed.token;
  const user = cookiesParsed.data.deputy_id;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/letter/signature?letter_id=${letter_id}`,
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

    const responseData = await res.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching letters:", error.message);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function getSignatures(letter_id: string) {
  const userCookies = cookies().get("USER");
  const cookiesParsed = userCookies ? JSON.parse(userCookies.value) : null;

  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }
  const token = cookiesParsed.token;
  const user = cookiesParsed.data.deputy_id;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/signature?letter_id=${letter_id}`,
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

    const responseData = await res.json();
    return {
      success: true,
      data: responseData.data,
    };
  } catch (error: any) {
    console.error("Error fetching letters:", error.message);
    return {
      status: false,
      message: error.message,
    };
  }
}
