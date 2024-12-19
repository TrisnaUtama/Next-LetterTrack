"use server";

import { cookies } from "next/headers";

export interface Division {
  division_id: number;
  division_name: string;
  head_division?: string;
  deputy_id?: number;
}

interface Division_Response {
  status: boolean;
  data?: Division[];
  message?: string;
}

const userCookies = cookies().get("USER");
const tokenParsed = userCookies ? JSON.parse(userCookies.value) : null;

export async function get_division(): Promise<Division_Response> {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/divisions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Http error! Status : ${res.status}`);

    const response_data = await res.json();

    return {
      status: true,
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function find_division(id: number) {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/divisions?division_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error(`Http error! Status : ${res.status}`);

    const response_data = await res.json();

    return {
      status: true,
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function add_division(
  division: Division
): Promise<Division_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/divisions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(division),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const response_data = await res.json();
    return {
      status: true,
      message: "Successfully added new division",
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching divisions:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function update_division(
  division: Division
): Promise<Division_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/divisions`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(division),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const response_data = await res.json();

    return {
      status: true,
      message: "Successfully added new division",
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching divisions:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function delete_division(id: Number): Promise<Division_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/divisions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ division_id: Number(id) }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      message: "Successsfully Delete Data division",
      data: responseData,
    };
  } catch (error: any) {
    console.error("Error fetching divisions:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}
