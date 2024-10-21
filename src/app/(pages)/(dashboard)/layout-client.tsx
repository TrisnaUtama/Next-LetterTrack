"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/Sidebar/sidebar";

export default function DashboardLayoutClient({
  children,
  employeeTypeId,
  employeeId,
}: {
  children: React.ReactNode;
  employeeTypeId: number | null;
  employeeId: string | null;
}) {
  const [handlerSidebar, setHandler] = useState(false);
  const toggleSidebar = () => {
    setHandler((handler) => !handler);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={handlerSidebar} employeeTypeId={employeeTypeId} />
      <div className={`flex-1 ${handlerSidebar ? "ml-[20%]" : "ml-[6%]"}`}>
        <Navbar
          toogler={toggleSidebar}
          isOpen={handlerSidebar}
          employeeId={employeeId}
        />
        <main className="h-screen  mb-10">{children}</main>
      </div>
    </div>
  );
}
