"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LogoutAction from "@/hooks/(auth)/logout/logoutAction";
import findAction, { Employee } from "@/hooks/employee/findAction";
import { updateAction } from "@/hooks/employee/employeesAction";
import { useToast } from "@/hooks/use-toast";

export default function Navbar({
  toogler,
  isOpen,
  employeeId,
}: {
  toogler: () => void;
  isOpen: boolean;
  employeeId: string ;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [addressEmployee, setAddressEmployee] = useState("");
  const [phoneNumberEmployee, setPhoneNumberEmployee] = useState("");
  const [emailEmployee, setEmailEmployee] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const { toast } = useToast();

  const handleLogout = () => {
    LogoutAction();
  };

  const closeDialogAndReload = () => {
    toast({
      variant: "default",
      title: "Canceling update yout profile",
      description: "Take your time and update your profile",
    });
    setIsDialogOpen(false);
    window.location.reload();
  };

  const submitDialogAndReload = async () => {
    setLoader(true);
    const dataUpdated = {
      employee_id: employeeId,
      employee_name: employeeName || user!.employee_name,
      birth: dateOfBirth || user!.birth,
      address: addressEmployee || user!.address,
      phone_number: phoneNumberEmployee || user!.phone_number,
      email: emailEmployee || user!.email,
      department_id: user!.department_id,
      employee_type_id: Number(user!.employee_type_id),
      gender: user!.gender,
    };

    const updateResult = await updateAction(employeeId, dataUpdated);
    if (updateResult.success) {
      toast({
        variant: "success",
        title: "Success",
        description: `successfuly update yout profile`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot update the data",
        description: `error while update your profile ${updateResult.message}`,
      });
      console.log(updateResult.message);
    }
    setIsDialogOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await findAction(employeeId);
      if (res.success) {
        setUser(res.data);
        setEmployeeName(res.data.employee_name);
        setAddressEmployee(res.data.address);
        setPhoneNumberEmployee(res.data.phone_number);
        setEmailEmployee(res.data.email);
        setDateOfBirth(res.data.birth);
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

      <Dialog open={isDialogOpen} onOpenChange={closeDialogAndReload}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="employee_name">Employee Name</Label>
            <Input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              type="text"
              id="employee_name"
              className="mb-4 mt-1.5 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="birth">Date of Birth</Label>
            <Input
              type="date"
              id="birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mb-4 mt-1.5 p-3 border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              value={addressEmployee}
              onChange={(e) => setAddressEmployee(e.target.value)}
              type="text"
              id="address"
              className="mb-4 mt-1.5 h-10 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              value={emailEmployee}
              onChange={(e) => setEmailEmployee(e.target.value)}
              type="email"
              id="email"
              className="mb-4 mt-1.5 h-10 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <Label htmlFor="phonenumber">Phone Number</Label>
            <Input
              value={phoneNumberEmployee}
              onChange={(e) => setPhoneNumberEmployee(e.target.value)}
              type="tel"
              id="phonenumber"
              className="mb-4 mt-1.5 h-10 p-3 font-medium border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={submitDialogAndReload}>
              {loader === false ? (
                "Save Changes"
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
