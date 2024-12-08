"use client";
import React, { useEffect, useState } from "react";
import Logo from "../../../public/logo-angkasapura.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { getRoutes, Route } from "@/lib/routes";

export default function Sidebar({
  isOpen,
  employeeTypeId,
}: {
  isOpen: boolean;
  employeeTypeId: number | null;
}) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setRoutes(getRoutes(employeeTypeId));
  }, [employeeTypeId]);

  const handleClick = (data: string) => {
    setActivePath(data);
  };

  return (
    <div
      className={`fixed h-screen top-0 z-50 bg-gradient-to-r from-[#01557B] to-[#019BE1] p-5 transition-all duration-500 ${
        isOpen ? `w-[20%]` : "w-[6%]"
      }`}
    >
      <div className="flex items-center justify-center">
        <Image
          className={`transition-all duration-100 ${isOpen ? "w-20" : "w-20"}`}
          src={Logo}
          alt="logo"
        />
      </div>
      {isOpen && (
        <div className="mt-4 flex items-center justify-center">
          <p className="font-bold ml-4">
            <span className="text-white">Angkasapura |</span>{" "}
            <span className="text-[#66B82F]">Airports</span>
          </p>
        </div>
      )}
      <nav className="flex flex-col mt-16">
        {routes.map((data, index) => (
          <Link
            key={index}
            href={data.pathname}
            onClick={() => handleClick(data.pathname)}
          >
            <div
              className={`flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group mt-3 ${
                !isOpen && "justify-center"
              } ${activePath === data.pathname && "bg-white/10"}`}
            >
              <div className="w-8 flex justify-center">
                <FontAwesomeIcon
                  icon={data.icon}
                  className={`text-xl text-white group-hover:text-[#66B82F] transition-colors duration-200`}
                />
              </div>
              <span
                className={`font-bold text-white text-sm group-hover:text-[#66B82F] transition-all duration-300 ${
                  isOpen ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {data.menu}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
