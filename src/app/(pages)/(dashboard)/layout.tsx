import { cookies } from "next/headers";
import DashboardLayoutClient from "./layout-client";

export default function DashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("USER");

  let employeeTypeId = null;
  let employeeId = null;

  if (userCookie && userCookie.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      employeeTypeId = userData?.data?.employee_type_id || null;
      employeeId = userData?.data?.employee_id || null;
    } catch (error) {
      console.error("Error parsing USER cookie:", error);
    }
  }

  return (
    <DashboardLayoutClient
      employeeTypeId={employeeTypeId}
      employeeId={employeeId}
    >
      {children}
    </DashboardLayoutClient>
  );
}
