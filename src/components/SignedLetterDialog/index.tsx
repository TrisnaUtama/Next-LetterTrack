import React, { useEffect, useState } from "react";
import Modal from "../Modal/index";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  updateStatus,
  getSignature,
  Signature,
} from "@/hooks/signature/signatureAction";

export default function SignLetterDialog({
  letter_id,
  signature_id,
  department_id_current,
  division_id_current,
  deputy_id_current,
  onClose,
}: {
  letter_id: string;
  signature_id: number;
  department_id_current: number;
  division_id_current: number;
  deputy_id_current: number;
  onClose: () => void;
}) {
  const [data, setData] = useState<{
    description: string;
    department_id: number | null;
    deputy_id: number | null;
    division_id: number | null;
  }>({
    description: "",
    department_id: null,
    deputy_id: null,
    division_id: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signature, setSignature] = useState<Signature[]>([]);
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSignature(letter_id);
        if (response.success) {
          setSignature(response.data);
        } else {
          console.error("Failed to fetch letter:", response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [letter_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "department" | "deputy" | "division"
  ) => {
    const { value, checked } = e.target;
    const idValue = Number(value);

    if (checked) {
      setData((prevData) => ({
        ...prevData,
        [`${category}_id`]: idValue,
        department_id: category === "department" ? idValue : null,
        deputy_id: category === "deputy" ? idValue : null,
        division_id: category === "division" ? idValue : null,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [`${category}_id`]: null,
      }));
    }
  };

  const validateForm = () => {
    const isNoNotArrive = !signature.some((sig) => sig.status === "NOT_ARRIVE");
    const newErrors: Record<string, string> = {};
    if (!isNoNotArrive) {
      if (!data.description) newErrors.description = "Description is required.";
      if (!data.department_id && !data.deputy_id && !data.division_id)
        newErrors.selected =
          "Please select at least one recipient (department, deputy, or division).";
      setErrors(newErrors);
    }
    return newErrors;
  };

  const submitDialogAndReload = async () => {
    setLoader(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "There's Something Wrong",
        description: "Please fill all of the form fields!",
      });
      setLoader(false);
      return;
    }

    const updated = await updateStatus(
      data.description,
      letter_id,
      data.department_id ?? null,
      data.deputy_id ?? null,
      data.division_id ?? null,
      signature_id
    );

    if (updated.success) {
      toast({
        variant: "success",
        title: "Success",
        description: "Successfully confirmed and updated the letter position.",
      });
      onClose();
      window.location.reload();
    } else {
      toast({
        variant: "destructive",
        title: "Cannot update the data",
        description: `Error while confirming your letter: ${updated.message}`,
      });
      console.log(updated.message);
    }
    setLoader(false);
  };

  return (
    <Modal>
      <h1 className="text-2xl font-semibold text-gray-800">Sign Letter</h1>
      <p className="text-sm text-gray-600 mt-2 mb-4">
        Confirm the letter sign, fill in the description, and send the letter to
        another department. Click save when you&apos;re done.
      </p>

      <div className="mb-6">
        <Label htmlFor="department" className="block text-lg font-medium mb-2">
          Send To
        </Label>
        <div className="space-y-4">
          {/* Departments */}
          <h3 className="text-md font-semibold">Departments</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {signature.map((value) => {
              if (value.department) {
                const isDisabled =
                  value.department.department_id === department_id_current ||
                  value.status === "SIGNED" ||
                  value.status === "ARRIVE";
                return (
                  <div
                    key={value.department.department_id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      id={`department-${value.department.department_id}`}
                      value={value.department.department_id}
                      onChange={(e) => handleCheckboxChange(e, "department")}
                      checked={
                        data.department_id === value.department.department_id
                      }
                      disabled={isDisabled}
                      className="form-checkbox text-blue-500 h-5 w-5 transition duration-200 ease-in-out"
                    />
                    <label
                      htmlFor={`department-${value.department.department_id}`}
                      className="text-gray-700"
                    >
                      {value.department.department_name}
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Deputies */}
          <h3 className="text-md font-semibold">Deputies</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {signature.map((value) => {
              if (value.Deputy) {
                const isDisabled =
                  value.Deputy.deputy_id === deputy_id_current ||
                  value.status === "SIGNED" ||
                  value.status === "ARRIVE";
                return (
                  <div
                    key={value.Deputy.deputy_id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      id={`deputy-${value.Deputy.deputy_id}`}
                      value={value.Deputy.deputy_id}
                      onChange={(e) => handleCheckboxChange(e, "deputy")}
                      checked={data.deputy_id === value.Deputy.deputy_id}
                      disabled={isDisabled}
                      className="form-checkbox text-blue-500 h-5 w-5 transition duration-200 ease-in-out"
                    />
                    <label
                      htmlFor={`deputy-${value.Deputy.deputy_id}`}
                      className="text-gray-700"
                    >
                      {value.Deputy.deputy_name}
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Divisions */}
          <h3 className="text-md font-semibold">Divisions</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {signature.map((value) => {
              if (value.Division) {
                const isDisabled =
                  value.Division.division_id === division_id_current ||
                  value.status === "SIGNED" ||
                  value.status === "ARRIVE";
                return (
                  <div
                    key={value.Division.division_id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      id={`division-${value.Division.division_id}`}
                      value={value.Division.division_id}
                      onChange={(e) => handleCheckboxChange(e, "division")}
                      checked={data.division_id === value.Division.division_id}
                      disabled={isDisabled}
                      className="form-checkbox text-blue-500 h-5 w-5 transition duration-200 ease-in-out"
                    />
                    <label
                      htmlFor={`division-${value.Division.division_id}`}
                      className="text-gray-700"
                    >
                      {value.Division.division_name}
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        {errors.selected && (
          <p className="text-red-500 text-sm mt-2">{errors.selected}</p>
        )}
      </div>

      <div className="mb-6">
        <Label htmlFor="description" className="block text-lg font-medium mb-2">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter the letter description"
          value={data.description}
          onChange={handleInputChange}
          className={`w-full p-3 rounded-md border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500 transition duration-200`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-2">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </Button>
        <Button
          onClick={submitDialogAndReload}
          disabled={loader}
          className="px-6 py-2 bg-gradient-to-r from-[#01557B] to-[#019BE1] text-white hover:bg-gradient-to-r hover:from-[#01547be2] hover:to-[#019ae1dc] focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          {loader ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Modal>
  );
}
