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
}

export async function updateStatus(
  descriptions: string,
  letter_id: string,
  department_id: number,
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
  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }
  const token = cookiesParsed.token;

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
