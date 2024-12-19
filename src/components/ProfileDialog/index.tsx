import React, { useState } from "react";
import Modal from "../Modal";
import { Employee } from "@/hooks/employee/findAction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateAction } from "@/hooks/employee/employeesAction";
import { Loader2 } from "lucide-react";

export default function ProfileDialog({
  data,
  onClose,
}: {
  data: Employee;
  onClose: () => void;
}) {
  const [employeeName, setEmployeeName] = useState(data.employee_name);
  const [addressEmployee, setAddressEmployee] = useState(data.address);
  const [phoneNumberEmployee, setPhoneNumberEmployee] = useState(
    data.phone_number
  );
  const [emailEmployee, setEmailEmployee] = useState(data.email);
  const [dateOfBirth, setDateOfBirth] = useState(data.birth);
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();

  const submitDialogAndReload = async () => {
    if (!employeeName || !emailEmployee || !phoneNumberEmployee) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoader(true);
    const dataUpdated = {
      employee_id: data.employee_id,
      employee_name: employeeName,
      birth: dateOfBirth,
      address: addressEmployee,
      phone_number: phoneNumberEmployee,
      email: emailEmployee,
      department_id: data.department_id,
      employee_type_id: Number(data.employee_type_id),
      gender: data.gender,
    };

    const updateResult = await updateAction(data.employee_id, dataUpdated);
    if (updateResult.success) {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully updated your profile.",
      });
      onClose();
      window.location.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Cannot update the data",
        description: `Error while updating your profile: ${updateResult.message}`,
      });
      console.log(updateResult.message);
    }
    setLoader(false);
  };

  return (
    <Modal>
      <div className="sm:max-w-[425px] bg-white ">
        <h1 className="text-lg font-semibold text-gray-800">Edit Profile</h1>
        <p className="text-slate-500 text-sm mb-2">
          Make changes to your profile here. Click save when you&apos;re done.
        </p>

        <div className="mb-4">
          <Label htmlFor="employee_name">
            Employee Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            type="text"
            id="employee_name"
            className="mt-1 p-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="birth">Date of Birth</Label>
          <Input
            type="date"
            id="birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="mt-1 p-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="address">Address</Label>
          <Input
            value={addressEmployee}
            onChange={(e) => setAddressEmployee(e.target.value)}
            type="text"
            id="address"
            className="mt-1 p-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            value={emailEmployee}
            onChange={(e) => setEmailEmployee(e.target.value)}
            type="email"
            id="email"
            className="mt-1 p-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="phonenumber">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            value={phoneNumberEmployee}
            onChange={(e) => setPhoneNumberEmployee(e.target.value)}
            type="tel"
            id="phonenumber"
            className="mt-1 p-3 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
            required
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={submitDialogAndReload}
            disabled={loader}
            className="bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc]">
            {loader ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
