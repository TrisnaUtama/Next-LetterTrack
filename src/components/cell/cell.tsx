import { useContext, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SignLetterDialog from "../SignedLetterDialog";
import LetterDetailDialog from "../LetterDetailDialog/Dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Employee } from "@/hooks/(auth)/login/loginAction";

const ActionsCell: React.FC<{ row: any; employeeLogin: Employee }> = ({
  row,
  employeeLogin,
}) => {
  const letter = row.original;
  const [selectedSignatureId, setSelectedSignatureId] = useState<number | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [detailLetterOpen, setDetailLetterOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="action"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel className="text-center font-semibold">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem
          id="copy-letter"
          className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={() => {
            navigator.clipboard.writeText(letter.letter_id);
            toast({
              variant: "success",
              title: "Success Copying",
              description: `successfully copied letter id ${letter.letter_id}`,
            });
          }}
        >
          Copy Letter ID
        </DropdownMenuItem>

        {employeeLogin?.employee_type_id != 4 &&
          employeeLogin?.employee_type_id != 2 && (
            <div>
              <DropdownMenuSeparator />
              <Link
                id="edit"
                href={`/letter/${letter.letter_id}/edit`}
                className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-sm p-1.5 rounded-md"
              >
                Edit
              </Link>
            </div>
          )}

        {employeeLogin?.employee_type_id != 4 && (
          <div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="signed"
              onClick={() => {
                setSelectedSignatureId(Number(row.original.signature_id)); // Set the signature_id
                setIsOpen(true);
              }}
              className="flex justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              disabled={
                letter.status === "SIGNED" || letter.status === "NOT_ARRIVE"
              }
            >
              {letter.status === "SIGNED"
                ? "Already Signed"
                : letter.status === "NOT_ARRIVE"
                ? "Wait The Letter"
                : "Sign Letter"}
            </DropdownMenuItem>
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="detail"
          className="flex justify-center"
          onSelect={() => setDetailLetterOpen(true)}
        >
          Detail Letter
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* Dialog Detail Letter */}
      {detailLetterOpen && (
        <LetterDetailDialog
          letter={letter}
          onClose={() => setDetailLetterOpen(false)}
        />
      )}
      {/* Dialog Sign Letter */}
      {isOpen && selectedSignatureId && (
        <SignLetterDialog
          letter_id={row.original.letter_id}
          onClose={() => setIsOpen(false)}
          signature_id={selectedSignatureId} // Pass the selected signature_id
          department_id_current={Number(letter.department?.department_id)}
          division_id_current={Number(letter.Division?.division_id)}
          deputy_id_current={Number(letter.Deputy?.deputy_id)}
        />
      )}
    </DropdownMenu>
  );
};

export default ActionsCell;
