"use client";

import React, { useEffect, useState } from "react";
import { Type } from "../employees/page";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import RegisterEmployee from "@/hooks/(auth)/register/registerAction";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Department,
  getDepartments,
} from "@/hooks/department/departmentAction";

export default function Page() {
  const [employeeName, setEmployeeName] = useState("");
  const [addressEmployee, setAddressEmployee] = useState("");
  const [phoneNumberEmployee, setPhoneNumberEmployee] = useState("");
  const [emailEmployee, setEmailEmployee] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState<string>("");
  const [department, setDepartment] = useState<Department[]>([]);
  const [employeeType, setEmployeeType] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  const employee_Type: Record<Type, string> = {
    1: "Superadmin",
    2: "Secretary",
    3: "Receptionist",
    4: "Division",
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      if (res.status) {
        setDepartment(res.data || []);
      } else {
        console.error("Failed to fetch departments:", res.message);
      }
    };
    fetchDepartments();
  }, []);

  const handleCheckedFormField = () => {
    const newErrors: Record<string, string> = {};

    if (!employeeName) newErrors.employeeName = "Employee Name is required.";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!addressEmployee) newErrors.address = "Address is required.";
    if (!emailEmployee) newErrors.email = "Email is required.";
    if (!phoneNumberEmployee)
      newErrors.phoneNumber = "Phone Number is required.";
    if (!selectedDepartment) newErrors.department = "Department is required.";
    if (!employeeType) newErrors.employeeType = "Employee Type is required.";
    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0)
      toast({
        variant: "destructive",
        title: "There's Something Wrong",
        description: "Please fill all of the form field !",
      });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleCheckedFormField()) return;

    const employeeData = {
      employee_name: employeeName,
      birth: dateOfBirth,
      address: addressEmployee,
      phone_number: phoneNumberEmployee,
      email: emailEmployee,
      department_id: Number(selectedDepartment),
      employee_type_id: Number(employeeType),
      password: password,
      gender,
    };

    setIsSubmitting(true);
    const result = await RegisterEmployee(employeeData);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/superadmin/employees");
      toast({
        variant: "success",
        title: "Successfully ",
        description: "New Employee successfully added ",
      });
    } else {
      console.error("Registration failed:", result.message);
    }
  };

  return (
    <div className="mb-10">
      <div className="bg-white border-b-2 p-8">
        <Link
          href="/superadmin/employees"
          className="inline-block cursor-pointer hover:text-black/70">
          <div className="flex items-center space-x-1">
            <ArrowDown className="rotate-90 w-4" />
            <p className="text-sm">Back</p>
          </div>
        </Link>
        <h1 className="mt-2 font-semibold text-2xl">Add New Employee</h1>
        <p className="text-slate-500 text-sm mt-1">
          This feature lets admins easily add new employees to the
          letter-tracking system, setting up their access and permissions so
          they can manage and track letters efficiently.
        </p>
      </div>
      <div className="ms-10 mt-5 bg-white rounded-md border me-3">
        <div id="GeneralInformation" className="p-5">
          <hr className="border-spacing-1 mb-2" />
          <h1 className="font-semibold text-xl">General Information</h1>
          <p className="text-sm">
            Please provide employee Name, Date of Birth (DD/MM/YYYY), Gender and
            Password.
          </p>
          <div className="grid grid-cols-3 mt-4 space-x-10">
            <div>
              <Label htmlFor="employee_name">Employee Name <span className="text-red-500">*</span></Label>
              <Input
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                type="text"
                id="employee_name"
                placeholder="Enter Employee Name"
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.employeeName ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.employeeName && (
                <p className="text-red-500 text-sm">{errors.employeeName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="birth">Date of Birth <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                id="birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={`mb-1 h-10 p-3 border ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
              )}
            </div>
            <div>
              <Label htmlFor="employee_gender">Gender <span className="text-red-500">*</span></Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger
                  className={`h-10 border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="relative">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <div className="flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`mb-1 h-10 p-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                />
                <span
                  className="absolute right-3 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-5">
          <hr className="border-spacing-1 mb-2" />
          <h1 className="font-semibold text-xl">Contact</h1>
          <p className="text-sm">
            Please provide your Address, Email, Phone Number, Department, and
            Employee Type.
          </p>
          <div className="grid grid-cols-3 mt-4 space-x-10">
            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Input
                value={addressEmployee}
                onChange={(e) => setAddressEmployee(e.target.value)}
                type="text"
                id="address"
                placeholder="Enter Employee Address"
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                value={emailEmployee}
                onChange={(e) => setEmailEmployee(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter Employee Email"
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phonenumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                value={phoneNumberEmployee}
                onChange={(e) => setPhoneNumberEmployee(e.target.value)}
                type="tel"
                id="phonenumber"
                placeholder="Enter Employee Phone Number"
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-5 mt-3">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select
                value={selectedDepartment?.toString() || ""}
                onValueChange={(value) => setSelectedDepartment(Number(value))}>
                <SelectTrigger
                  className={`mt-[6px] h-10 border ${
                    errors.department ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {department.map((value) => (
                    <SelectItem
                      key={value.department_id}
                      value={value.department_id.toString()}>
                      {value.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>
            <div>
              <Label htmlFor="employee_type">Employee Type <span className="text-red-500">*</span></Label>
              <Select value={employeeType} onValueChange={setEmployeeType}>
                <SelectTrigger
                  className={`mt-[6px] h-10 border ${
                    errors.employeeType ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}>
                  <SelectValue placeholder="Select Employee Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(employee_Type).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeType && (
                <p className="text-red-500 text-sm">{errors.employeeType}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleCheckedFormField}
                disabled={isSubmitting}
                className="mt-5 bg-gradient-to-r from-[#01557B] to-[#019BE1] p-2 rounded-lg text-white font-semibold text-sm hover:from-[#01547be2] hover:to-[#019ae1dc]">
                Submit
              </Button>
            </AlertDialogTrigger>
            {Object.entries(errors).length <= 0 && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This action will create and
                    add a new employee to the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Continue"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
