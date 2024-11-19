import React from "react";
import Chart from "@/components/chart/chartEmployee";
import { TableDepartment } from "@/components/tableDepartment";

export default function DashboardAdmin() {
  return (
    <div>
      <div className="m-5 grid grid-cols-3 justify-center items-center gap-4">
        <Chart />
      </div>
      <div className="mx-5">
        <TableDepartment />
      </div>
    </div>
  );
}
