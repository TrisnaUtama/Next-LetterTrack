"use server";

import { cookies } from "next/headers";

export default async function LogoutAction() {
  try {
    await cookies().delete("Authorization");
    await cookies().delete("USER");
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
