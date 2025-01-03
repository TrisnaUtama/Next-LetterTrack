"use server";

import { cookies } from "next/headers";

export interface Deputy {
  deputy_id: number;
  deputy_name: string;
  head_deputy?: string;
}

interface Deputy_Response {
  status: boolean;
  data?: Deputy[];
  message?: string;
}

const userCookies = cookies().get("USER");
const tokenParsed = userCookies ? JSON.parse(userCookies.value) : null;

export async function get_deputy(): Promise<Deputy_Response> {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/deputys`, {
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

export async function find_deputy(id: number) {
  if (!tokenParsed) {
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  }

  const token = tokenParsed.token;

  try {
    const res = await fetch(
      `${process.env.ROOT_URL}/api/deputy?deputy_id=${id}`,
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

export async function add_deputy(deputy: Deputy): Promise<Deputy_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };
  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/deputys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deputy),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const response_data = await res.json();
    return {
      status: true,
      message: "Successfully added new deputy",
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching deputys:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function update_deputy(deputy: Deputy): Promise<Deputy_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/deputys`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deputy),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const response_data = await res.json();

    return {
      status: true,
      message: "Successfully added new deputy",
      data: response_data.data,
    };
  } catch (error: any) {
    console.error("Error fetching deputys:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}

export async function delete_deputy(id: Number): Promise<Deputy_Response> {
  if (!tokenParsed)
    return {
      status: false,
      message: "No user token found in cookies.",
    };

  const token = tokenParsed.token;

  try {
    const res = await fetch(`${process.env.ROOT_URL}/api/deputys`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deputy_id: Number(id) }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseData = await res.json();

    return {
      status: true,
      message: "Successsfully Delete Data Deputy",
      data: responseData,
    };
  } catch (error: any) {
    console.error("Error fetching Deputys:", error);
    return {
      status: false,
      message: error.message,
    };
  }
}
