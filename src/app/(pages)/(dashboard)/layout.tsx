import { cookies } from "next/headers";
import DashboardLayoutClient from "./layout-client";

export default function DashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const user = cookieStore.get("USER");
  const employeeTypeId = user
    ? JSON.parse(user.value).data.employee_type_id
    : null;
  const employeeId = JSON.parse(user!.value).data.employee_id;

  return (
    <DashboardLayoutClient
      employeeTypeId={employeeTypeId}
      employeeId={employeeId}>
      {children}
    </DashboardLayoutClient>
  );
}
