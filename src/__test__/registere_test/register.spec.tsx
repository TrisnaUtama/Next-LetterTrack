import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Page from "@/app/(pages)/(dashboard)/superadmin/register/page";

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

jest.mock("@/hooks/(auth)/register/registerAction", () => ({
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

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => null,
}));

describe("Register Page", () => {
  it("should render the Register page", async () => {
    await act(async () => {
      render(<Page />);
    });

    expect(screen.getByText(/General Information/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty form", async () => {
    await act(async () => {
      render(<Page />);
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Employee Name is required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Date of Birth is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Gender is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone Number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Department is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Employee Type is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it("should trigger a success toast upon successful form submission", async () => {
    await act(async () => {
      render(<Page />);
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Employee Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Employee Address"), {
      target: { value: "123 Street" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Employee Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Enter Employee Phone Number"),
      {
        target: { value: "1234567890" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth *"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Gender *"), {
      target: { value: "MALE" },
    });
    fireEvent.change(screen.getByLabelText("Department *"), {
      target: { value: "Information System" },
    });
    fireEvent.change(screen.getByLabelText("Employee Type *"), {
      target: { value: "Secretary" },
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });
});
