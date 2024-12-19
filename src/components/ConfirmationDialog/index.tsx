"use client";

import React, { useState } from "react";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { deleteDepartment } from "@/hooks/organizations/department_action";
import { delete_deputy } from "@/hooks/organizations/deputy_action";
import { delete_division } from "@/hooks/organizations/division_action";
import { deleteEmployee } from "@/hooks/employee/employeesAction";

export default function ConfirmationDialog({
  onClose,
  type,
  id,
}: {
  onClose: () => void;
  type: string;
  id: any;
}) {
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoader(true);
    let res;
    if (type === "Department") res = await deleteDepartment(id);

    if (type === "Employee") res = await deleteEmployee(id);

    if (type === "Deputy") res = await delete_deputy(id);

    if (type === "Division") res = await delete_division(id);

    setLoader(false);
    if (!res?.status) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: `Cannot delete this ${type}`,
      });
      onClose();
    } else {
      onClose();
      toast({
        variant: "success",
        title: `${type} Deleted Successfully`,
        description: `The ${type} has been successfully removed from the system.`,
      });

      onClose();
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCancel = () => {
    toast({
      variant: "destructive",
      title: `Canceling ${type} Deletion`,
      description: `The  ${type} deletion process has been successfully canceled.`,
    });
    onClose();
  };

  return (
    <Modal>
      <div className="max-w-2xl max-h-[90vh]">
        <h1 className="font-bold text-2xl">Confirmation Dialog</h1>
        <div className="mt-4">
          <p className="font-semibold text-[15px]">Are you sure ?</p>
          <p className="text-sm">
            This action cannot be undone. This will permanently delete your{" "}
            <br />
            department data from the servers.
          </p>
          <div className="flex justify-end items-center space-x-2 mt-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancle
            </Button>
            <Button onClick={handleDelete}>
              {loader ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
