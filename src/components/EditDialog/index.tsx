import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import {
  Department,
  updateDepartment,
  findDepartment,
} from "@/hooks/organizations/department_action";

import {
  Deputy,
  update_deputy,
  find_deputy,
} from "@/hooks/organizations/deputy_action";

import {
  Division,
  update_division,
  find_division,
} from "@/hooks/organizations/division_action";

import { useRouter } from "next/navigation";

export default function EditDepartmentDialog({
  onClose,
  id,
  type,
}: {
  onClose: () => void;
  id: number;
  type: String;
}) {
  const [department, setDepartment] = useState<Department>({
    department_id: 0,
    department_name: "",
    department_head: "",
  });

  const [deputy, setDeputy] = useState<Deputy>({
    deputy_id: 0,
    deputy_name: "",
    head_deputy: "",
  });

  const [division, setDivision] = useState<Division>({
    division_id: 0,
    division_name: "",
    head_division: "",
    deputy_id: 0,
  });

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (type === "Department") {
          res = await findDepartment(id);
          setDepartment(res?.data);
        }

        if (type === "Deputy") {
          res = await find_deputy(id);
          setDeputy(res?.data[0]);
        }

        if (type === "Division") {
          res = await find_division(id);
          setDivision(res?.data[0]);
        }
      } catch (error: any) {
        return error.message;
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (type === "Department") {
      setDepartment((prevDepartment) => ({
        ...prevDepartment,
        [id]: value,
      }));
    }

    if (type === "Deputy") {
      setDeputy((prevDeputy) => ({
        ...prevDeputy,
        [id]: value,
      }));
    }

    if (type === "Division") {
      setDivision((prevDivision) => ({
        ...prevDivision,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (type === "Department") {
      if (!department.department_head)
        newErrors.department_head = "Department head is required";
      if (!department.department_name)
        newErrors.department_name = "Department name is required";
    }

    if (type === "Deputy") {
      if (!deputy.head_deputy)
        newErrors.head_deputy = "Deputy head is required";
      if (!deputy.deputy_name)
        newErrors.deputy_name = "Deputy name is required";
    }

    if (type === "Division") {
      if (!division.head_division)
        newErrors.head_division = "division head is required";
      if (!division.division_name)
        newErrors.division_name = "division name is required";
    }

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
    let response;
    if (type === "Department") {
      response = await updateDepartment(department);
    }

    if (type === "Deputy") {
      response = await update_deputy(deputy);
    }

    if (type === "Division") {
      response = await update_division(division);
    }
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
        title: `${type} Edited`,
        description: `The ${type} was successfully edited.`,
      });
      setDepartment({
        department_id: 0,
        department_head: "",
        department_name: "",
      });
      setDeputy({
        deputy_id: 0,
        deputy_name: "",
        head_deputy: "",
      });

      setDivision({
        division_id: 0,
        division_name: "",
        head_division: "",
        deputy_id: 0,
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
        <div className="max-w-5xl max-h-[90vh] flex flex-col mb-4">
          {/* Header Modal */}
          <h2 className="font-bold text-xl">Edit {type}</h2>
          <p className="text-slate-500 text-[12px] mb-2">
            Easyly editing your data {type} in your Website
          </p>
        </div>

        {/* Content Modal */}
        <div className="mb-4">
          <Label
            htmlFor={
              type === "Department"
                ? "department_name"
                : type === "Deputy"
                ? "deputy_name"
                : "division_name"
            }
          >
            {type} Name
          </Label>
          <Input
            type="text"
            id={
              type === "Department"
                ? "department_name"
                : type === "Deputy"
                ? "deputy_name"
                : "division_name"
            }
            value={
              type === "Department"
                ? department.department_name
                : type === "Deputy"
                ? deputy.deputy_name
                : division.division_name
            }
            placeholder={`enter the ${type} name....`}
            onChange={handleInputChange}
            className="mb-1 h-10 p-3 font-medium border focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor={
              type === "Department"
                ? "department_head"
                : type === "Deputy"
                ? "head_deputy"
                : "head_division"
            }
          >
            {type} Head
          </Label>
          <Input
            type="text"
            id={
              type === "Department"
                ? "department_head"
                : type === "Deputy"
                ? "head_deputy"
                : "head_division"
            }
            value={
              type === "Department"
                ? department.department_head
                : type === "Deputy"
                ? deputy.head_deputy
                : division.head_division
            }
            placeholder={`enter the ${type} head....`}
            onChange={handleInputChange}
            className="mb-1 h-10 p-3 font-medium border focus:border-blue-500 focus:outline-none"
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
              `Edit ${type}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
