"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

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
import { MultiSelect } from "@/components/ui/multi-selector";

import {
  Department,
  getDepartments,
} from "@/hooks/department/departmentAction";

import { LetterData, addLetter } from "@/hooks/letter/letterAction";

export default function AddLetter({ params }: { params: { id: number } }) {
  const [data, setData] = useState<LetterData>({
    letter_id: "",
    sender: "",
    subject: "",
    recipient: "",
    letter_type_id: 0,
    department_id: [params.id],
    login_user_department_id: 0,
  });

  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      if (res.status) {
        const transformedDepartments =
          res.data?.map((dept: Department) => ({
            label: dept.department_name,
            value: dept.department_id.toString(),
          })) || [];
        setDepartments(transformedDepartments);
      } else {
        console.error("Failed to fetch departments:", res.message);
      }
    };
    fetchDepartments();
  }, []);

  const Letter_Type: Record<number, string> = {
    1: "Internal",
    2: "External",
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

  const handleSelectChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      letter_type: parseInt(value, 10),
    }));
  };

  const handleSelectChangeDepartmentSender = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      sender: value,
    }));
  };

  const handleDepartmentChange = (selected: string[]) => {
    setData((prevData) => ({
      ...prevData,
      department_id: selected.map((id) => parseInt(id, 10)),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.letter_id) newErrors.letter_id = "Letter ID is required.";
    if (!data.recipient) newErrors.recipient = "Recipient is required.";
    if (!data.sender) newErrors.sender = "Sender name is required.";
    if (data.letter_type_id === 0)
      newErrors.letter_type = "Letter type is required.";
    if (!data.subject) newErrors.subject = "Subject is required.";
    if (data.department_id.length === 0)
      newErrors.department_id = "At least one department must be selected.";

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

    setLoading(true);
    const response = await addLetter(data);
    setLoading(false);

    if (response.success) {
      toast({
        variant: "success",
        title: "Letter Added",
        description: "The letter was successfully added.",
      });
      setData({
        letter_id: "",
        sender: "",
        subject: "",
        recipient: "",
        letter_type_id: 0,
        department_id: [],
        login_user_department_id: 0,
      });
      router.push("/letter/");
    } else {
      toast({
        variant: "destructive",
        title: "There is Something Wrong!",
        description: response.message,
      });
    }
  };

  return (
    <div className="mb-10">
      <div className="bg-white border-b-2 p-8">
        <Link
          href="/letter"
          className="inline-block cursor-pointer hover:text-black/70"
        >
          <div className="flex items-center space-x-1">
            <ArrowDown className="rotate-90 w-4" />
            <p className="text-sm">Back</p>
          </div>
        </Link>
        <h1 className="mt-2 font-semibold text-2xl">Add New Letter</h1>
        <p className="text-slate-500 text-sm mt-1">
          This feature allows users to easily create and manage letters within
          the tracking system. You can specify details such as the recipient,
          subject, and content of the letter, <br /> ensuring accurate
          record-keeping and efficient communication. Add new letters to keep
          your documentation organized and accessible.
        </p>
      </div>
      <div className="ms-10 mt-5 bg-white rounded-md border me-3">
        <div id="Letter" className="p-5">
          <hr className="border-spacing-1 mb-2" />
          <h1 className="font-semibold text-xl">Letter Information</h1>
          <p className="text-sm">Please provide all of the form needs.</p>
          <div className="grid grid-cols-3 mt-4 space-x-10">
            <div>
              <Label htmlFor="letter_id">
                Letter Id <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="letter_id"
                placeholder="enter the letter id"
                value={data.letter_id}
                onChange={handleInputChange}
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.letter_id ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.letter_id && (
                <p className="text-red-500 text-sm">{errors.letter_id}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sender">
                Sender <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleSelectChangeDepartmentSender}>
                <SelectTrigger
                  className={`mt-[1px] h-10 border ${
                    errors.sender ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                >
                  <SelectValue placeholder="Select Sender of the Letter" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((value) => (
                    <SelectItem
                      disabled={value.value === params.id.toString()}
                      key={value.value}
                      value={value.label}
                    >
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sender && (
                <p className="text-red-500 text-sm">{errors.sender}</p>
              )}
            </div>
            <div>
              <Label htmlFor="recipient">
                Recipient <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="recipient"
                placeholder="enter the letter recipient"
                value={data.recipient}
                onChange={handleInputChange}
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.recipient ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.recipient && (
                <p className="text-red-500 text-sm">{errors.recipient}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 mt-4 space-x-10">
            <div>
              <Label htmlFor="letter_type">
                Letter Type <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger
                  className={`mt-[6px] h-10 border ${
                    errors.letter_type ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                >
                  <SelectValue placeholder="Select Letter Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(Letter_Type).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.letter_type && (
                <p className="text-red-500 text-sm">{errors.letter_type}</p>
              )}
            </div>
            <div className="mt-0.5">
              <Label htmlFor="department_id">
                Department <span className="text-red-500">*</span>
              </Label>
              <MultiSelect
                className={`mt-1 h-10 border ${
                  errors.department_id ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
                options={departments}
                onValueChange={handleDepartmentChange}
                defaultValue={data.department_id.map(String)}
                placeholder="Select Department"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id}</p>
              )}
            </div>
          </div>
          <div className="grid mt-4 space-x-10">
            <div>
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="subject"
                placeholder="enter the letter Subject"
                value={data.subject}
                onChange={handleInputChange}
                className={`mb-1 h-10 p-3 font-medium border ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center p-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={validateForm}
                className="mt-5 bg-gradient-to-r from-[#01557B] to-[#019BE1] p-2 rounded-lg text-white font-semibold text-sm hover:from-[#01547be2] hover:to-[#019ae1dc]"
              >
                Submit
              </Button>
            </AlertDialogTrigger>
            {Object.keys(errors).length <= 0 && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This action will create and
                    add a new letter to the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? <span>Loading...</span> : "Continue"}
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
