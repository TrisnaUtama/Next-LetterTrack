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

import { Deputy, get_deputy } from "@/hooks/organizations/deputy_action";

import { Division, get_division } from "@/hooks/organizations/division_action";

import { LetterData, addLetter } from "@/hooks/letter/letterAction";
import { cn } from "@/lib/utils";

export default function AddLetter({ params }: { params: { id: number } }) {
  const [data, setData] = useState<LetterData>({
    letter_id: "",
    sender: "",
    subject: "",
    recipient: "",
    letter_type_id: 0,
    department_id: [0],
    deputy_id: [0],
    division_id: [0],
    primary_organization_type: "",
    primary_organization_id: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

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
  const [openOrganizatioin, setOpenOrganization] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectOrganization, setOrganization] = useState<string>("");
  const [selectOrganizationId, setOrganizationId] = useState<number>();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchOrganization = async () => {
      const res_department = await getDepartments();
      const res_division = await get_division();
      const res_deputy = await get_deputy();
      let mergedData: { label: string; value: string }[] = [];

      if (res_department.status) {
        const transformedDepartments =
          res_department.data?.map((dept: Department) => ({
            label: dept.department_name,
            value: dept.department_id.toString(),
          })) || [];
        mergedData = [...mergedData, ...transformedDepartments];
        setDepartments(transformedDepartments);
      } else {
        console.error("Failed to fetch departments:", res_department.message);
      }
      if (res_deputy.status) {
        const transformed_deputy =
          res_deputy.data?.map((dep: Deputy) => ({
            label: dep.deputy_name,
            value: dep.deputy_id.toString(),
          })) || [];
        mergedData = [...mergedData, ...transformed_deputy];
        setDeputies(transformed_deputy);
      } else {
        console.error("Failed to fetch departments:", res_deputy.message);
      }
      if (res_division.status) {
        const transformed_division =
          res_division.data?.map((div: Division) => ({
            label: div.division_name,
            value: div.division_id.toString(),
          })) || [];
        mergedData = [...mergedData, ...transformed_division];
        setDivisions(transformed_division);
      } else {
        console.error("Failed to fetch departments:", res_division.message);
      }
      setMergedData(mergedData);
    };
    fetchOrganization();
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

  const handleSelectLetterArrive = (value: string) => {
    setOrganization(value);
    setData((prevData) => ({
      ...prevData,
      primary_organization_type: value.toLowerCase(),
    }));
  };

  const handleOrganizationId = (value: number) => {
    setOrganizationId(value);
    setData((prevData) => ({
      ...prevData,
      primary_organization_id: value,
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
  const handleSelectChangeDepartmentRecepient = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      recipient: value,
    }));
  };

  const handleDepartmentChange = (selected: string[]) => {
    setData((prevData) => ({
      ...prevData,
      department_id: selected.map((id) => parseInt(id, 10)),
    }));
  };
  const handleDeputyChange = (selected: string[]) => {
    setData((prevData) => ({
      ...prevData,
      deputy_id: selected.map((id) => parseInt(id, 10)),
    }));
  };
  const handleDivisionChange = (selected: string[]) => {
    setData((prevData) => ({
      ...prevData,
      division_id: selected.map((id) => parseInt(id, 10)),
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
    if (
      data.department_id.length === 0 &&
      data.deputy_id.length === 0 &&
      data.division_id.length === 0
    )
      newErrors.department_id = "organization must be selected.";

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
        division_id: [],
        deputy_id: [],
        primary_organization_id: 0,
        primary_organization_type: "",
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
                    {data.recipient
                      ? mergedData.find(
                          (organization) => organization.label === data.sender
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
                        {mergedData.map((organization) => (
                          <CommandItem
                            key={organization.label}
                            value={organization.label}
                            onSelect={() => {
                              setData((prevData) => ({
                                ...prevData,
                                sender: organization.label,
                              }));
                              setOpenSender(false);
                            }}
                          >
                            {organization.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                data.sender === organization.label
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
              <Label htmlFor="recipient" className="block mb-2.5">
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
                      ? mergedData.find(
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
                        {mergedData.map((organization) => (
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

              {errors.recipient && (
                <p className="text-red-500 text-sm">{errors.recipient}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 mt-4 space-x-10">
            <div className="mt-0.5">
              <Label htmlFor="department_id">Department</Label>
              <MultiSelect
                className={`mt-1 h-10 border ${
                  errors.department_id ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
                options={departments}
                onValueChange={handleDepartmentChange}
                placeholder="Select Department"
                variant="inverted"
                animation={2}
                maxCount={1}
              />
              {errors.department_id && (
                <p className="text-red-500 text-sm">{errors.department_id}</p>
              )}
            </div>
            <div className="mt-0.5">
              <Label htmlFor="division_id">Division</Label>
              <MultiSelect
                className={`mt-1 h-10 border ${
                  errors.division_id ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
                options={divisions}
                onValueChange={handleDivisionChange}
                placeholder="Select Division"
                variant="inverted"
                animation={2}
                maxCount={1}
              />
              {errors.division_id && (
                <p className="text-red-500 text-sm">{errors.division_id}</p>
              )}
            </div>
            <div className="mt-0.5">
              <Label htmlFor="deputy_id">Deputy</Label>
              <MultiSelect
                className={`mt-1 h-10 border ${
                  errors.deputy_id ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:outline-none`}
                options={deputies}
                onValueChange={handleDeputyChange}
                placeholder="Select Deputy"
                variant="inverted"
                animation={2}
                maxCount={1}
              />
              {errors.deputy_id && (
                <p className="text-red-500 text-sm">{errors.deputy_id}</p>
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
            {selectOrganization.length === 0 && (
              <div>
                <Label htmlFor="organization">
                  Select Letter to Arrive{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 space-x-5 mt-2.5">
                  {["Deputy", "Division", "Department"].map((value) => (
                    <Button
                      key={value.toLowerCase()}
                      onClick={() => handleSelectLetterArrive(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {selectOrganization && (
              <div>
                <Label htmlFor={selectOrganization} className="block mt-2">
                  {selectOrganization} <span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={openOrganizatioin}
                  onOpenChange={setOpenOrganization}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOrganizatioin}
                      className={` h-10 border w-full mt-2 flex justify-between ${
                        errors.department ? "border-red-500" : "border-gray-300"
                      } focus:border-blue-500 focus:outline-none`}
                    >
                      {selectOrganizationId
                        ? departments.find(
                            (org) =>
                              org.value.toString() ===
                              selectOrganizationId.toString()
                          )?.label || "Select organization..."
                        : `Select ${selectOrganization}`}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder={`Search ${selectOrganization}`}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Command>
                      <CommandList>
                        <CommandEmpty>No organization found.</CommandEmpty>
                        <CommandGroup>
                          {(selectOrganization === "Department"
                            ? departments
                            : selectOrganization === "Division"
                            ? divisions
                            : deputies
                          )
                            .filter((value) =>
                              value.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((value) => (
                              <CommandItem
                                key={value.value}
                                value={value.value.toString()}
                                onSelect={() => {
                                  handleOrganizationId(Number(value.value));
                                  setOpenOrganization(false);
                                }}
                              >
                                {value.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectOrganizationId?.toString() ===
                                      value.value.toString()
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
          </div>
          <div className="grid  mt-4 space-x-10">
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
