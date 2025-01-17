"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
} from "@/hooks/organizations/department_action";

import {
  LetterData,
  getSpecificLetter,
  updateLetter,
} from "@/hooks/letter/letterAction";

import { Deputy, get_deputy } from "@/hooks/organizations/deputy_action";

import { Division, get_division } from "@/hooks/organizations/division_action";
import { cn } from "@/lib/utils";

export default function EditLetter({ params }: { params: { id: string } }) {
  const [data, setData] = useState<LetterData>({
    letter_id: params.id,
    sender: "",
    subject: "",
    recipient: "",
    letter_type_id: 0,
    department_id: [],
    deputy_id: [],
    division_id: [],
  });

  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);
  const [divisions, setDivisions] = useState<
    { label: string; value: string }[]
  >([]);
  const [deputies, setDeputies] = useState<{ label: string; value: string }[]>(
    []
  );
  const [mergedData, setMergedData] = useState<
    { label: string; value: string }[]
  >([]);

  const [openSender, setOpenSender] = useState(false);
  const [openRecepient, setOpenRecepient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      let mergedData: { label: string; value: string }[] = [];
      if (res.status) {
        const transformedDepartments =
          res.data?.map((dept: Department) => ({
            label: dept.department_name,
            value: dept.department_id.toString(),
          })) || [];
        setDepartments(transformedDepartments);
        mergedData = [...mergedData, ...transformedDepartments];
      } else {
        console.error("Failed to fetch departments:", res.message);
      }
      setMergedData(mergedData);
    };
    fetchDepartments();
  }, []);

  console.log(data);

  useEffect(() => {
    const fetchDeputies = async () => {
      const res = await get_deputy();
      let mergedData: { label: string; value: string }[] = [];
      if (res.status) {
        const transformedDeputies =
          res.data?.map((deputy: Deputy) => ({
            label: deputy.deputy_name,
            value: deputy.deputy_id.toString(),
          })) || [];
        setDeputies(transformedDeputies);
        mergedData = [...mergedData, ...transformedDeputies];
      } else {
        console.error("Failed to fetch deputies:", res.message);
      }
      setMergedData(mergedData);
    };

    fetchDeputies();
  }, []);

  useEffect(() => {
    const fetchDivisions = async () => {
      const res = await get_division();
      let mergedData: { label: string; value: string }[] = [];
      if (res.status) {
        const transformedDivisions =
          res.data?.map((division: Division) => ({
            label: division.division_name,
            value: division.division_id.toString(),
          })) || [];
        setDivisions(transformedDivisions);
        mergedData = [...mergedData, ...transformedDivisions];
      } else {
        console.error("Failed to fetch divisions:", res.message);
      }
      setMergedData(mergedData);
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchLetter = async () => {
      const res = await getSpecificLetter(data.letter_id);
      if (res.status) {
        const letterData = res.data;

        const departmentIds = letterData.Signature.filter(
          (sig: any) => sig.department_id !== null
        ).map((sig: any) => sig.department_id.toString());

        const deputyIds = letterData.Signature.filter(
          (sig: any) => sig.deputy_id !== null
        ).map((sig: any) => sig.deputy_id.toString());

        const divisionIds = letterData.Signature.filter(
          (sig: any) => sig.division_id !== null
        ).map((sig: any) => sig.division_id.toString());

        setData({
          letter_id: letterData.letter_id,
          sender: letterData.sender || "",
          subject: letterData.subject || "",
          recipient: letterData.recipient || "",
          letter_type_id: letterData.letter_type_id || 0,
          department_id: departmentIds.length > 0 ? departmentIds : [""],
          deputy_id: deputyIds.length > 0 ? deputyIds : [""],
          division_id: divisionIds.length > 0 ? divisionIds : [""],
        });
      } else {
        console.error("Failed to fetch letter:", res.message);
      }
    };

    fetchLetter();
  }, [data.letter_id, departments]);

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
      letter_type_id: parseInt(value, 10),
    }));
  };

  const handleSelectChangeDepartmentSender = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      sender: value,
    }));
  };

  const handleDepartmentChange = (selected: string[]) => {
    setData((prevData) => {
      return {
        ...prevData,
        department_id: selected.map((id) => parseInt(id, 10)),
      };
    });
  };
  const handleDivisionChange = (selected: string[]) => {
    setData((prevData) => {
      return {
        ...prevData,
        division_id: selected.map((id) => parseInt(id, 10)),
      };
    });
  };
  const handleDeputyChange = (selected: string[]) => {
    setData((prevData) => {
      return {
        ...prevData,
        deputy_id: selected.map((id) => parseInt(id, 10)),
      };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.letter_id) newErrors.letter_id = "Letter ID is required.";
    if (!data.recipient) newErrors.recipient = "Recipient is required.";
    if (!data.sender) newErrors.sender = "Sender name is required.";
    if (data.letter_type_id === 0)
      newErrors.letter_type = "Letter type is required.";
    if (!data.subject) newErrors.subject = "Subject is required.";
    if (
      data.department_id.length === 0 &&
      data.deputy_id.length === 0 &&
      data.division_id.length === 0
    )
      newErrors.department_id = "At least one organization is required.";

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
    try {
      const response = await updateLetter(data);

      if (response.status) {
        toast({
          variant: "success",
          title: "Letter Updated",
          description: "The letter was successfully updated.",
        });
        router.push("/letter/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const mergedOrganization = [...deputies, ...divisions, ...departments];

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
        <h1 className="mt-2 font-semibold text-2xl">Edit Letter</h1>
        <p className="text-slate-500 text-sm mt-1">
          This feature allows users to easily edit and manage letters within the
          tracking system. You can specify details such as the recipient,
          subject, and content of the letter, <br /> ensuring accurate
          record-keeping and efficient communication. Edit the letters to keep
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
              <Label htmlFor="sender" className="block mb-2.5">
                Sender <span className="text-red-500">*</span>
              </Label>
              <Popover open={openSender} onOpenChange={setOpenSender}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSender}
                    className="w-full h-10 justify-between"
                  >
                    {data.sender
                      ? mergedOrganization.find(
                          (org) => org.label === data.sender
                        )?.label || "Reset"
                      : "Select sender..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search sender..." />
                    <CommandList>
                      <CommandEmpty>No sender found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="reset"
                          value="reset"
                          onSelect={() => {
                            setData((prevData) => ({
                              ...prevData,
                              sender: "",
                            }));
                            setOpenSender(false);
                          }}
                        >
                          Reset Selection
                        </CommandItem>
                        {mergedOrganization.map((organization) => (
                          <CommandItem
                            key={organization.value}
                            value={organization.value}
                            onSelect={() => {
                              setData((prevData) => ({
                                ...prevData,
                                sender: organization.value,
                              }));
                              setOpenSender(false);
                            }}
                          >
                            {organization.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                data.sender === organization.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors.sender && (
                <p className="text-red-500 text-sm">{errors.sender}</p>
              )}
            </div>
            <div>
              <Label htmlFor="recipient">
                Recipient <span className="text-red-500">*</span>
              </Label>
              <Popover open={openRecepient} onOpenChange={setOpenRecepient}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openRecepient}
                    className="w-full h-10 justify-between"
                  >
                    {data.recipient
                      ? mergedOrganization.find(
                          (organization) =>
                            organization.label === data.recipient
                        )?.label || "Reset"
                      : "Select recipient..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search recipient..." />
                    <CommandList>
                      <CommandEmpty>No recipient found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="reset"
                          value="reset"
                          onSelect={() => {
                            setData((prevData) => ({
                              ...prevData,
                              recipient: "",
                            }));
                            setOpenRecepient(false);
                          }}
                        >
                          Reset Selection
                        </CommandItem>
                        {mergedOrganization.map((organization) => (
                          <CommandItem
                            key={organization.label}
                            value={organization.label}
                            onSelect={() => {
                              setData((prevData) => ({
                                ...prevData,
                                recipient: organization.label,
                              }));
                              setOpenRecepient(false);
                            }}
                          >
                            {organization.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                data.recipient === organization.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-4 space-x-10">
            <div className="mt-0.5">
              <Label htmlFor="department_id">
                Department <span className="text-red-500">*</span>
              </Label>
              {data.department_id.length > 0 && (
                <MultiSelect
                  className={`mt-1 h-10 border ${
                    errors.department_id ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                  options={departments}
                  onValueChange={handleDepartmentChange}
                  defaultValue={data.department_id.map(String)}
                  placeholder="Select Department"
                  variant="inverted"
                  maxCount={1}
                />
              )}
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id}</p>
              )}
            </div>
            <div className="mt-0.5">
              <Label htmlFor="department_id">
                Division <span className="text-red-500">*</span>
              </Label>
              {data.division_id.length > 0 && (
                <MultiSelect
                  className={`mt-1 h-10 border ${
                    errors.department_id ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                  options={divisions}
                  onValueChange={handleDivisionChange}
                  defaultValue={data.division_id.map(String)}
                  placeholder="Select Department"
                  variant="inverted"
                  maxCount={1}
                />
              )}
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id}</p>
              )}
            </div>
            <div className="mt-0.5">
              <Label htmlFor="department_id">
                Deputy <span className="text-red-500">*</span>
              </Label>
              {data.deputy_id.length > 0 && (
                <MultiSelect
                  className={`mt-1 h-10 border ${
                    errors.department_id ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                  options={deputies}
                  onValueChange={handleDeputyChange}
                  defaultValue={data.deputy_id.map(String)}
                  placeholder="Select deputy"
                  variant="inverted"
                  maxCount={1}
                />
              )}
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 mt-4 space-x-10">
            <div>
              <Label htmlFor="letter_type">
                Letter Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={data.letter_type_id.toString()}
              >
                <SelectTrigger
                  className={`mt-[6px] h-10 border ${
                    errors.letter_type ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none`}
                >
                  <SelectValue placeholder="Select Letter Type">
                    {Letter_Type[data.letter_type_id]}
                  </SelectValue>
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
