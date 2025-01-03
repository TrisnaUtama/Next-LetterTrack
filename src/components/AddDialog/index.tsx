import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Department,
  addDepartment,
} from "@/hooks/organizations/department_action";

import {
  add_deputy,
  Deputy,
  get_deputy,
} from "@/hooks/organizations/deputy_action";

import {
  add_division,
  Division,
  get_division,
} from "@/hooks/organizations/division_action";

export default function AddOrganizationsDialog({
  onClose,
  type,
}: {
  onClose: () => void;
  type: String;
}) {
  const [department, setDepartment] = useState<Department>({
    department_id: 0,
    department_name: "",
    department_head: "",
    division_id: undefined,
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
    deputy_id: undefined,
  });

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "Division") {
          const deputyData = await get_deputy();
          if (deputyData.status) {
            console.log(deputyData);
            setDeputies(deputyData?.data ?? []);
          }
        }

        if (type === "Department") {
          const divisionData = await get_division();
          if (divisionData.status) {
            setDivisions(divisionData?.data ?? []);
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch the necessary data!",
        });
      }
    };

    fetchData();
  }, [type, toast]);

  const handleSelectChange = (value: string) => {
    const selectValue = Number(value);

    if (value === "0") {
      setDepartment((prevDepartment) => ({
        ...prevDepartment,
        division_id: undefined,
      }));

      setDivision((prevDivision) => ({
        ...prevDivision,
        deputy_id: undefined,
      }));
    }

    if (type === "Department") {
      setDepartment((prevDepartment) => ({
        ...prevDepartment,
        division_id: selectValue,
      }));
    } else if (type === "Division") {
      setDivision((prevDivision) => ({
        ...prevDivision,
        deputy_id: selectValue,
      }));
    }
  };

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
      if (department.department_head === "")
        newErrors.department_head = "Department head is required";
      if (department.department_name === "")
        newErrors.department_name = "Department name is required";
    }

    if (type === "Deputy") {
      if (deputy.head_deputy === "")
        newErrors.head_deputy = "Deputy head is required";
      if (deputy.deputy_name === "")
        newErrors.deputy_name = "Deputy name is required";
    }

    if (type === "Division") {
      if (division.head_division === "")
        newErrors.head_division = "Division head is required";
      if (division.division_name === "")
        newErrors.division_name = "Division name is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "There's Something Wrong",
        description: "Please fill all of the form fields!",
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    let response;
    setLoader(true);
    if (type === "Department") {
      response = await addDepartment(department);
    }

    if (type === "Deputy") {
      response = await add_deputy(deputy);
    }

    if (type === "Division") {
      response = await add_division(division);
    }
    setLoader(false);

    console.log("API Response:", response);

    if (!response?.status) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response?.message,
      });
    } else {
      toast({
        variant: "success",
        title: `${type} Added`,
        description: `The ${type} was successfully added.`,
      });
      setDepartment({
        department_id: 0,
        department_head: "",
        department_name: "",
        division_id: 0,
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
          <h2 className="font-bold text-xl">Add {type}</h2>
          <p className="text-slate-500 text-[12px] mb-2">
            Easily add a new {type} in your Website
          </p>
        </div>

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
            placeholder={`Enter the ${type} name...`}
            onChange={handleInputChange}
            className={`mb-1 h-10 p-3 font-medium border focus:border-blue-500 focus:outline-none`}
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
            placeholder={`Enter the ${type} head...`}
            onChange={handleInputChange}
            className={`mb-1 h-10 p-3 font-medium border  focus:border-blue-500 focus:outline-none`}
          />
        </div>

        {(type === "Department" || type === "Division") && (
          <div className="mb-4">
            <Label
              htmlFor={
                type === "Department"
                  ? "department_division_id"
                  : "division_deputy_id"
              }
            >
              {type === "Department" ? "Division" : "Deputy"}
            </Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger
                id={
                  type === "Department"
                    ? "department_division_id"
                    : "division_deputy_id"
                }
                className="h-10 border focus:border-blue-500 focus:outline-none"
              >
                <SelectValue
                  placeholder={`Select ${
                    type === "Department" ? "Division" : "Deputy"
                  }`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Default Value</SelectItem>
                {type === "Department"
                  ? divisions.map((item) => (
                      <SelectItem
                        key={item.division_id}
                        value={item.division_id.toString()}
                      >
                        {item.division_name}
                      </SelectItem>
                    ))
                  : type === "Division"
                  ? deputies.map((item) => (
                      <SelectItem
                        key={item.deputy_id}
                        value={item.deputy_id.toString()}
                      >
                        {item.deputy_name}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </div>
        )}

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
              `Add ${type}`
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
