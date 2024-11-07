"use server";

import { cookies } from "next/headers";

const userCookies = cookies().get("USER");
const cookiesParsed = userCookies ? JSON.parse(userCookies.value) : null;

export interface Letter {
  signature_id: Number;
  letter_id: string;
  status: string;
  signed_date: string | null;
  descriptions: string | null;
  letter: {
    letter_date: string;
    recipient: string;
    sender: string;
    subject: string;
    status: string;
    letter_type: {
      letter_type: string;
    };
  };
  department: {
    department_name: string;
    department_id: Number;
  };
}

export interface LetterData {
  letter_id: string;
  sender: string;
  subject: string;
  recipient: string;
  letter_type: number;
  department_id: number[];
  login_user_department_id: number;
}

export async function addLetter(data: LetterData) {
  if (!cookiesParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = cookiesParsed.token;
  const user_login_department_id = cookiesParsed.data.department_id;

  const letterDataWithUserDepartment = {
    ...data,
    login_user_department_id: user_login_department_id,
  };

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/letter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(letterDataWithUserDepartment),
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
