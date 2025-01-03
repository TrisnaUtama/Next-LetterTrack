"use client";

import React, { useEffect, useState } from "react";
import { Type } from "@/app/(pages)/(dashboard)/superadmin/employees/page";
import { ArrowDown, Loader2 } from "lucide-react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import findAction, { Employee } from "@/hooks/employee/findAction";
import { updateAction } from "@/hooks/employee/employeesAction";

import {
  getDepartments,
  Department,
} from "@/hooks/organizations/department_action";

import { Deputy, get_deputy } from "@/hooks/organizations/deputy_action";

import {
  Division,
  get_division,
  find_division_by_deputy,
} from "@/hooks/organizations/division_action";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [addressEmployee, setAddressEmployee] = useState("");
  const [phoneNumberEmployee, setPhoneNumberEmployee] = useState("");
  const [emailEmployee, setEmailEmployee] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState<Department[]>([]);
  const [deputy, setDeputy] = useState<Deputy[]>([]);
  const [division, setDivision] = useState<Division[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [selectOrganization, setOrganization] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>();
  const [selectedDivision, setSelectedDivision] = useState<number | null>();
  const [selectedDeputy, setSelectedDeputy] = useState<number | null>();
  const [loader, setLoader] = useState(false);
  const [employeeType, setEmployeeType] = useState<string | undefined>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const id = params.id;
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
      let res;
      if (selectOrganization === "Department") {
        res = await getDepartments();
        if (res?.status) {
          setDepartment(res.data || []);
        } else {
          console.error("Failed to fetch departments:", res?.message);
        }
      }
      if (selectOrganization === "Division") {
        let res;
        if (employee?.deputy_id != null) {
          res = await find_division_by_deputy(employee.deputy_id);
        } else {
          res = await get_division();
        }

        if (res?.status) {
          setDivision(res.data || []);
        } else {
          console.error("Failed to fetch division:", res?.message);
        }
      }
      if (selectOrganization === "Deputy") {
        res = await get_deputy();
        if (res?.status) {
          setDeputy(res.data || []);
        } else {
          console.error("Failed to fetch deputy:", res?.message);
        }
      }
    };
    fetchDepartments();
  }, [selectOrganization, employee?.deputy_id]);

  // const matchedDepartment = () => {
  //   if (selectOrganization === "Department") {
  //     const departmentFound = department.find(
  //       (dept) => dept.department_id === selectedDepartment
  //     );
  //     return departmentFound ? departmentFound.department_name : null;
  //   }

  //   if (selectOrganization === "Deputy") {
  //     const deputy_found = deputy.find(
  //       (dep) => dep.deputy_id === selectedDeputy
  //     );
  //     return deputy_found ? deputy_found.deputy_name : null;
  //   }

  //   if (selectOrganization === "Division") {
  //     const division_found = division.find(
  //       (dep) => dep.division_id === selectedDivision
  //     );
  //     return division_found ? division_found.division_name : null;
  //   }
  // };

  const matchedEmployeeType = () => {
    if (!employee) return null;
    for (const [key, typeName] of Object.entries(employee_Type)) {
      if (employee!.employee_type_id === Number(key)) {
        return typeName;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await findAction(id);
        if (res.success) {
          if (res.data.department_id != null) {
            setOrganization("Department");
          }
          if (res.data.deputy_id != null) {
            setOrganization("Deputy");
          }
          if (res.data.division_id != null) {
            setOrganization("Division");
          }
          setEmployee(res.data);
          setSelectedDepartment(res.data.department_id);
          setSelectedDeputy(res.data.deputy_id);
          setSelectedDivision(res.data.division_id);
          setSelectedDepartment(res.data.department_id);
          setEmployeeName(res.data.employee_name);
          setAddressEmployee(res.data.address);
          setPhoneNumberEmployee(res.data.phone_number);
          setEmailEmployee(res.data.email);
          setDateOfBirth(res.data.birth);
          setGender(res.data.gender);
          setPassword(res.data.password);
          setEmployeeType(res.data.employee_type_id.toString());
        } else {
          console.error(res.message);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, employee?.deputy_id]);

  const handleSubmit = async () => {
    setLoader(true);
    const dataUpdated = {
      employee_id: id,
      employee_name: employeeName || employee!.employee_name,
      birth: dateOfBirth || employee!.birth,
      address: addressEmployee || employee!.address,
      phone_number: phoneNumberEmployee || employee!.phone_number,
      email: emailEmployee || employee!.email,
      department_id:
        selectedDepartment == null
          ? selectedDepartment
          : selectedDepartment || employee!.department_id,
      division_id:
        selectedDivision == null
          ? selectedDivision
          : selectedDivision || employee!.division_id,
      deputy_id:
        selectedDeputy == null
          ? selectedDeputy
          : selectedDeputy || employee!.deputy_id,
      employee_type_id:
        Number(employeeType) || Number(employee!.employee_type_id),
      gender: gender || employee!.gender,
      password: password || employee?.password,
    };

    const updateResult = await updateAction(id, dataUpdated);
    if (updateResult.success) {
      toast({
        variant: "success",
        title: "Success",
        description: `successfuly update employee with id ${id}`,
      });
      router.push("/superadmin/employees");
    } else {
      setLoader(false);
      console.error("Failed to update employee:", updateResult.message);
    }
  };

  const handleCancleUpdate = () => {
    toast({
      variant: "destructive",
      title: "Canceling Update Employee",
      description: `Please Take Your Time`,
    });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!employee) {
    return <div>No employee data found.</div>;
  }

  return (
    <div className="mb-10">
      <div className="bg-white border-b-2 p-8">
        <Link
          href="/superadmin/employees"
          className="inline-block cursor-pointer hover:text-black/70"
        >
          <div className="flex items-center space-x-1">
            <ArrowDown className="rotate-90 w-4" />
            <p className="text-sm">Back</p>
          </div>
        </Link>
        <h1 className="mt-2 font-semibold text-2xl">Update Data Employee</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update Employee feature allows admins to easily modify employee
          details and permissions in the letter-tracking system, ensuring <br />
          accurate access and efficient management.
        </p>
      </div>
      <div className="ms-10 mt-5 bg-white rounded-md border me-3">
        <div id="GeneralInformation" className="p-5">
          <hr className="border-spacing-1 mb-2" />
          <h1 className="font-semibold text-xl">General Information</h1>
          <p className="text-sm">
            Please provide employee Name, Date of Birth (DD/MM/YYYY) and Gender.
          </p>
          <div className="grid grid-cols-3 mt-4 space-x-10">
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
              <Label htmlFor="employee_gender">Gender</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger
                  id="employee_gender"
                  className="mt-[6px] border border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <SelectValue placeholder={employee.gender} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="relative">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`mb-1 h-10 p-3 border $ focus:border-blue-500 focus:outline-none`}
                />
                <span
                  className="absolute right-3 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
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
          </div>
          <div className="grid grid-cols-2 space-x-5">
            {selectOrganization.length === 0 && (
              <div>
                <Label htmlFor="organization">
                  Select Organization <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 space-x-5 mt-2.5">
                  {["Deputy", "Division", "Department"].map((value) => (
                    <Button
                      key={value}
                      onClick={() => setOrganization(value.toString())}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {selectOrganization && (
              <div>
                <Label htmlFor={selectOrganization}>
                  {selectOrganization} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={
                    selectOrganization === "Department"
                      ? selectedDepartment?.toString()
                      : selectOrganization === "Division"
                      ? selectedDivision?.toString()
                      : selectedDeputy?.toString()
                  }
                  onValueChange={(value) => {
                    if (selectOrganization === "Department") {
                      setSelectedDepartment(
                        Number(value) === 0 ? null : Number(value)
                      );
                    } else if (selectOrganization === "Division") {
                      setSelectedDivision(
                        Number(value) === 0 ? null : Number(value)
                      );
                    } else if (selectOrganization === "Deputy") {
                      setSelectedDeputy(
                        Number(value) === 0 ? null : Number(value)
                      );
                    }
                  }}
                >
                  <SelectTrigger
                    id={selectOrganization}
                    className={`mt-[6px] h-10 border  focus:border-blue-500 focus:outline-none`}
                  >
                    <SelectValue
                      placeholder={`selected ${selectOrganization}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Default Value</SelectItem>
                    {selectOrganization === "Department"
                      ? department.map((value) => (
                          <SelectItem
                            key={value.department_id}
                            value={value.department_id.toString()}
                          >
                            {value.department_name}
                          </SelectItem>
                        ))
                      : selectOrganization === "Division"
                      ? division.map((value) => (
                          <SelectItem
                            key={value.division_id}
                            value={value.division_id.toString()}
                          >
                            {value.division_name}
                          </SelectItem>
                        ))
                      : deputy.map((value) => (
                          <SelectItem
                            key={value.deputy_id}
                            value={value.deputy_id.toString()}
                          >
                            {value.deputy_name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={() => setOrganization("")}
                    className="text-sm"
                  >
                    Select Organization
                  </Button>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="employee_type">Employee Type</Label>
              <Select value={employeeType} onValueChange={setEmployeeType}>
                <SelectTrigger
                  id="employee_type"
                  className="mt-[6px] h-10 border border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <SelectValue placeholder={matchedEmployeeType()} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(employee_Type).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mt-5 bg-gradient-to-r from-[#01557B] to-[#019BE1] p-2 rounded-lg text-white font-semibold text-sm hover:from-[#01547be2] hover:to-[#019ae1dc]">
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This action will create and add
                  a new employee to the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancleUpdate}>
                  Cancel
                </AlertDialogCancel>
                <Button type="button" onClick={handleSubmit}>
                  {loader === false ? (
                    "Continue"
                  ) : (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
