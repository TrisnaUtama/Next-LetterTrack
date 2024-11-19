"use client";

import React from "react";
import Modal from "../Modal";
import { Button } from "../ui/button";

export default function ConfirmationDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <Modal>
      <div className="max-w-2xl max-h-[90vh]">
        <h1 className="font-bold text-2xl">Confirmation Modal</h1>
        <div className="mt-4">
          <p className="font-semibold text-[15px]">Are you sure ?</p>
          <p className="text-sm">
            This action cannot be undone. This will permanently delete your{" "}
            <br />
            department data from the servers.
          </p>
          <div className="flex justify-end items-center space-x-2 mt-2">
            <Button onClick={onClose}>Cancle</Button>
            <Button>Continue</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
