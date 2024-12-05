import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Page from "@/app/(pages)/(dashboard)/superadmin/employees/[id]/update/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock("@/hooks/employee/employeesAction", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock("@/hooks/department/departmentAction", () => ({
  getDepartments: () =>
    Promise.resolve({
      status: true,
      data: [{ department_id: 1, department_name: "Information System" }],
    }),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({
      value: JSON.stringify({ token: "mocked-token" }),
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

describe("Update Employee Page", () => {
  it("should render the Update Employee page", async () => {
    await act(async () => {
      render(
        <Page
          params={{
            id: "1",
          }}
        />
      );
    });

    expect(screen.getByText(/General Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });
  it("should success update employee", async () => {
    await act(async () => {
      render(
        <Page
          params={{
            id: "1",
          }}
        />
      );
    });

    fireEvent.change(screen.getByLabelText("Employee Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Gender"), {
      target: { value: "MALE" },
    });
    fireEvent.change(screen.getByLabelText("Department"), {
      target: { value: "Information System" },
    });
    fireEvent.change(screen.getByLabelText("Employee Type"), {
      target: { value: "Secretary" },
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });
});
