"use server";

import { cookies } from "next/headers";

const userCookies = cookies().get("USER");
const cookiesParsed = userCookies ? JSON.parse(userCookies.value) : null;

export interface Letter {
  letter_id: string;
  isSigned: boolean;
  signed_date: string | null;
  descriptions: string | null;
  letter: {
    content: string;
    descriptions: string;
    letter_date: string;
    recipient: string;
    sender: string;
    subject: string;
    letter_type: {
      letter_type: string;
    };
  };
  department: {
    department_name: string;
  };
}

export async function getLetter() {
  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = cookiesParsed.token;
  const department_id = cookiesParsed.data.department_id;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/letter?departmentId=${Number(
        department_id
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // if (!res.ok) {
    //   throw new Error(`HTTP error! status: ${res.status}`);
    // }

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
