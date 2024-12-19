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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function SignLetterDialog({
  letter_id,
  signature_id,
  department_id_current,
  onClose,
}: {
  letter_id: string;
  signature_id: number;
  department_id_current: number;
  onClose: () => void;
}) {
  const [data, setData] = useState<{
    description: string;
    department_id: number;
  }>({
    description: "",
    department_id: 0,
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

  const handleSelectChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      department_id: Number(value),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.description) newErrors.description = "Description is required.";
    // if (data.department_id <= 0)
    //   newErrors.department = "Please select a department to send.";

    setErrors(newErrors);
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
      data.department_id,
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
      <div className="sm:max-w-[425px] bg-white ">
        <h1 className="text-lg font-semibold text-gray-800">Sign Letter</h1>
        <p className="text-slate-500 text-sm mb-2">
          Confirmation the letter sign, fill the description and send the letter{" "}
          into another department. Click save when you&apos;re done.
        </p>
        <div className="mb-4">
          <Label htmlFor="department">Send To</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger
              className={`mt-[6px] h-10 border ${
                errors.department ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {signature.map((value) => (
                <SelectItem
                  key={value.department.department_id}
                  value={value.department.department_id.toString()}
                  disabled={
                    value.department.department_id === department_id_current ||
                    value.status === "SIGNED" ||
                    value.status === "ARRIVE"
                  }>
                  {value.department.department_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-red-500 text-sm">{errors.department}</p>
          )}
          <div className="mt-5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter the letter description"
              value={data.description}
              onChange={handleInputChange}
              className={`mb-1 h-10 p-3 font-medium border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
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
