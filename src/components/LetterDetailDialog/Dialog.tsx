import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, User, CheckCircle2 } from "lucide-react";
import { Letter } from "@/hooks/letter/letterAction";
import { Signature, getSignatures } from "@/hooks/signature/signatureAction";
import Modal from "@/components/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface LetterDetailDialogProps {
  letter: Letter;
  onClose: () => void;
}

const LetterDetailDialog: React.FC<LetterDetailDialogProps> = ({
  letter,
  onClose,
}) => {
  const [signature, setSignature] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSignatures(letter!.letter_id);
        if (response.success) {
          setSignature(response.data);
        } else {
          console.error("Failed to fetch letter:", response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (letter) {
      fetchData();
    }
  }, [letter]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ON_PROGRESS":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "FINISH":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLetterTypeColor = (type: string): string => {
    switch (type) {
      case "Internal":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "External":
        return "bg-purple-100 text-purple-800 hover:bg-purple-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not available";
    const formattedDate = new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h24",
    });
    return formattedDate.replace(/pukul\s*/, "").replace(",", ", ");
  };

  if (!letter) {
    return null;
  }

  return (
    <Modal>
      <div className="max-w-4xl max-h-[90vh] flex flex-col bg-gray-50">
        {/* Modal Header */}
        <div className="border-b-2 pb-4 p-4 bg-white rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Letter Details</h2>

            <Button onClick={onClose} className="text-sm">
              Back
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex space-x-2">
            <Badge
              className={`transition-all duration-300 ${getLetterTypeColor(
                letter.letter.letter_type.letter_type
              )}`}
            >
              {letter.letter.letter_type.letter_type}
            </Badge>
            <Badge
              className={`transition-all duration-300 ${getStatusColor(
                letter.letter.status
              )}`}
            >
              {letter.letter.status === "ON_PROGRESS"
                ? "ON PROGRESS"
                : "COMPLETED"}
            </Badge>
          </div>

          {/* Letter Information & Sender/Recipient */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Letter Information Card */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Letter Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <p className="text-sm font-medium w-24">Recepient:</p>
                    <p className="text-sm flex-1 text-gray-700">
                      {letter.letter.recipient}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <p className="text-sm font-medium w-24">Subject:</p>
                    <p className="text-sm flex-1 text-gray-700">
                      {letter.letter.subject}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <p className="text-sm font-medium w-24">Letter Date:</p>
                    <p className="text-sm flex-1 text-gray-700">
                      {formatDate(letter.letter.letter_date)}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <p className="text-sm font-medium w-24">Last Updated:</p>
                    <p className="text-sm flex-1 text-gray-700">
                      {letter.signed_date
                        ? formatDate(letter.signed_date)
                        : "Not signed yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sender & Recipient Card */}
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Sender & Recipient
                </h3>
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">From:</p>
                      <p className="text-sm text-gray-700">
                        {letter.letter.sender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">To:</p>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {/* Grouped Department, Division, Deputy */}
                        <div>
                          {signature?.some((sig) => sig.department) && (
                            <div>
                              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                                Department
                              </Badge>
                              {signature
                                .filter((sig) => sig.department)
                                .map((sig, index) => (
                                  <p
                                    key={index}
                                    className="text-sm text-gray-700 ml-4 mt-2"
                                  >
                                    {sig.department?.department_name}
                                  </p>
                                ))}
                            </div>
                          )}
                        </div>

                        <div>
                          {signature?.some((sig) => sig.Division) && (
                            <div>
                              <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800">
                                Division
                              </Badge>
                              {signature
                                .filter((sig) => sig.Division)
                                .map((sig, index) => (
                                  <p
                                    key={index}
                                    className="text-sm text-gray-700 ml-4 mt-2"
                                  >
                                    {sig.Division?.division_name}
                                  </p>
                                ))}
                            </div>
                          )}
                        </div>

                        <div>
                          {signature?.some((sig) => sig.Deputy) && (
                            <div>
                              <Badge className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
                                Deputy
                              </Badge>
                              {signature
                                .filter((sig) => sig.Deputy)
                                .map((sig, index) => (
                                  <p
                                    key={index}
                                    className="text-sm text-gray-700 ml-4 mt-2"
                                  >
                                    {sig.Deputy?.deputy_name}
                                  </p>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Tracking Status */}
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center sticky top-0 bg-white">
                  <Clock className="mr-2" size={20} />
                  Tracking Status
                </h3>
                <div className="overflow-y-auto max-h-[calc(100vh-400px)] pr-4 space-y-6">
                  {isLoading
                    ? [1, 2, 3].map((_, index) => (
                        <div
                          key={index}
                          className="relative pl-8 border-l-2 border-gray-200"
                        >
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))
                    : signature
                        .sort((a, b) => {
                          const order: { [key: string]: number } = {
                            SIGNED: 1,
                            ARRIVE: 2,
                            NOT_ARRIVE: 3,
                          };
                          return order[a.status] - order[b.status];
                        })
                        .map((sig, index) => (
                          <div
                            key={index}
                            className="relative pl-8 border-l-2 border-gray-200"
                          >
                            <div className="absolute -left-2 top-0">
                              <CheckCircle2
                                className={
                                  sig.status === "SIGNED"
                                    ? "text-green-500"
                                    : sig.status === "NOT_ARRIVE"
                                    ? "text-gray-300"
                                    : "text-blue-300"
                                }
                                size={20}
                              />
                            </div>
                            <p
                              className={`text-sm font-medium text-gray-700 p-1 rounded-md ${
                                sig.department != null
                                  ? "bg-green-100"
                                  : sig.Division != null
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {sig.department != null
                                ? sig.department?.department_name
                                : sig.Division != null
                                ? sig.Division?.division_name
                                : sig.Deputy?.deputy_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sig.descriptions}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(sig.signed_date)}
                            </p>
                          </div>
                        ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LetterDetailDialog;
