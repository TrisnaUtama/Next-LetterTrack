import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import {
  AddDepartment,
  addDepartment,
} from "@/hooks/department/departmentAction";
import { useRouter } from "next/navigation";

export default function AddDepartmentDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [department, setDepartment] = useState<AddDepartment>({
    department_name: "",
    department_head: "",
  });

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDepartment((prevDepartment) => ({
      ...prevDepartment,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!department.department_head)
      newErrors.letter_id = "Department head is required";
    if (!department.department_name)
      newErrors.recipient = "Department name is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0)
      toast({
        variant: "destructive",
        title: "There's Something Wrong",
        description: "Please fill all of the form fields!",
      });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoader(true);
    const response = await addDepartment(department);
    setLoader(false);

    if (!response?.status) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response?.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Letter Added",
        description: "The letter was successfully added.",
      });
      setDepartment({
        department_head: "",
        department_name: "",
      });
      onClose();
      router.push("/superadmin");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Modal>
      <div>
        <div className="max-w-5xl max-h-[90vh] flex flex-col bg-gray-50 mb-4">
          {/* Header Modal */}
          <h2 className="font-bold">Add Department</h2>
          <p className="text-slate-500 text-[12px] mb-2">
            Easyly adding a new Department in your Website
          </p>
        </div>

        {/* Content Modal */}
        <div className="mb-4">
          <Label htmlFor="departmet_name">Department Name</Label>
          <Input
            type="text"
            id="department_name"
            placeholder="enter the department name...."
            onChange={handleInputChange}
            className={`mb-1 h-10 p-3 font-medium border ${
              errors.department_name ? "border-red-500" : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="departmet_head">Department Head</Label>
          <Input
            type="text"
            id="department_head"
            placeholder="enter the department head...."
            onChange={handleInputChange}
            className={`mb-1 h-10 p-3 font-medium border ${
              errors.department_head ? "border-red-500" : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loader}
            className="bg-gradient-to-r from-[#01557B] to-[#019BE1] hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc]"
          >
            {loader ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Add Department"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
