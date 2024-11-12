import React from "react";
import Chart from "@/components/chart/chartEmployee";

export default function DashboardAdmin() {
  return (
    <div className="m-5 grid grid-cols-3 justify-center items-center">
      <Chart />
    </div>
  );
}
