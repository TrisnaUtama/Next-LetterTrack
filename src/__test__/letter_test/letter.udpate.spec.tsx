import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import Page from "@/app/(pages)/(dashboard)/letter/[id]/edit/page";
import DashboardWraper from "@/app/(pages)/(dashboard)/layout-client";
import Dashboard from "@/app/(pages)/(dashboard)/layout";
import { useRouter } from "next/navigation";
import { clear } from "console";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/letter/letterAction", () => ({
  getLetter: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        letter_id: "letter-01",
        letter: {
          letter_date: "2024-12-04T15:21:38.575Z",
          status: "ON_PROGRESS",
          sender: "Marketing",
          subject: "testing",
          letter_type: { letter_type: "External" },
        },
        status: "ARRIVE",
      },
      {
        letter_id: "letter-02",
        letter: {
          letter_date: "2024-12-04T15:30:00.000Z",
          status: "ON_PROGRESS",
          sender: "John Doe",
          subject: "New External Letter",
          letter_type: { letter_type: "External" },
        },
        status: "NOT ARRIVE",
      },
    ],
  }),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({
      value: JSON.stringify({
        token: "mocked-token",
        data: {
          employee_type_id: 2,
          employee_id: "1",
        },
      }),
    }),
  }),
}));

jest.mock("@/hooks/employee/findAction", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    success: true,
    data: {
      employee_id: "1",
      employee_name: "John Doe",
      gender: "MALE",
      birth: "1990-01-01",
      email: "john.doe@example.com",
      phone_number: "123-456-7890",
      status: "ACTIVE",
      department_id: 1,
      address: "123 Main St",
      employee_type_id: 2,
    },
  }),
}));

describe("Letter Testing", () => {
  it("should render edit letter page and display letters the form", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page
              params={{
                id: "letter-01",
              }}
            />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Edit Letter")).toBeInTheDocument();
    });
  });
});
