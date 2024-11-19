"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LogoutAction from "@/hooks/(auth)/logout/logoutAction";
import findAction, { Employee } from "@/hooks/employee/findAction";
import ProfileDialog from "@/components/ProfileDialog"; 

export default function Navbar({
  toogler,
  isOpen,
  employeeId,
}: {
  toogler: () => void;
  isOpen: boolean;
  employeeId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  

  const handleLogout = () => {
    LogoutAction();
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await findAction(employeeId);
      if (res.success) {
        setUser(res.data);
      } else {
        console.log(res.message);
      }
    };
    fetch();
  }, [employeeId]);

  return (
    <div className="flex justify-between items-center h-16 w-full bg-white border-b-2 pe-10">
      <div
        className={`ms-2 bg-white transition-all duration-500`}
        onClick={toogler}>
        <FontAwesomeIcon
          icon={faBars}
          className={`text-slate-400 w-3 p-3 cursor-pointer transition-transform duration-500 ${
            isOpen ? `rotate-90` : ""
          }`}
        />
      </div>
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage
            className="rounded-3xl w-10"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-slate-400 w-3"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link className="flex" href="/" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isDialogOpen && user && (
        <ProfileDialog data={user} onClose={() => setIsDialogOpen(false)} />
      )}
    </div>
  );
}
