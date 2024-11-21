import React from "react";
import ChartEmployee from "@/components/chart/chartEmployee";
import ChartLetter from "@/components/chart/chartLetter";
import { ChartLetterStatus } from "@/components/chart/chartLetterStatus";
import { TableDepartment } from "@/components/tableDepartment";

export default function DashboardAdmin() {
  return (
    <div>
      <div className="m-5 grid grid-cols-3 justify-center items-center gap-4">
        <ChartLetter />
        <ChartEmployee />
        <ChartLetterStatus />
      </div>
      <div className="mx-5">
        <TableDepartment />
      </div>
    </div>
  );
}
