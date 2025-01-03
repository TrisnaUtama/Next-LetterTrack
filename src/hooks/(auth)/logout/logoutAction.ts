"use server";

import { cookies } from "next/headers";

export default async function LogoutAction() {
  try {
    const cookieStore = cookies();

    cookieStore.delete("Authorization");
    cookieStore.delete("USER");

    return {
      success: true,
      message:
        "Logged out successfully, please refresh the page to reflect the changes.",
    };
  } catch (error: any) {
    console.error("Error during logout:", error);
    return { success: false, error: error.message };
  }
}
