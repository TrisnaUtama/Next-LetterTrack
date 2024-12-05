import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import Page from "@/app/(pages)/(dashboard)/letter/page";
import DashboardWraper from "@/app/(pages)/(dashboard)/layout-client";
import Dashboard from "@/app/(pages)/(dashboard)/layout";
import { clear } from "console";

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
  it("should render letter page and display letters in table", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/letter-01/i)).toBeInTheDocument();
      expect(screen.getByText(/letter-02/i)).toBeInTheDocument();
    });
  });

  it("should render letter page and display table data correctly", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => screen.getByText("letter-01"));

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    expect(rows.length).toBe(3);

    expect(within(rows[1]).getByText("letter-01")).toBeInTheDocument();
    expect(within(rows[1]).getByText(/IN PROGRESS/i)).toBeInTheDocument();

    expect(within(rows[2]).getByText("letter-02")).toBeInTheDocument();
    expect(within(rows[1]).getByText(/IN PROGRESS/i)).toBeInTheDocument();
  });

  it("should filter letters by status", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => screen.getByText("letter-01"));

    const statusSelect = document.querySelector("#status");
    fireEvent.click(statusSelect!, { target: { value: "ARRIVE" } });

    await waitFor(() => {
      expect(screen.getByText(/letter-01/i)).toBeInTheDocument();
      expect(screen.getByText(/letter-02/i)).toBeInTheDocument();
    });
  });

  it("should search for letters by letter ID", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });
    await waitFor(() => screen.getByText("letter-01"));

    const searchInput = screen.getByPlaceholderText("Search letters...");
    fireEvent.change(searchInput, { target: { value: "letter-01" } });

    expect(screen.getByText("letter-01")).toBeInTheDocument();
  });

  it("should paginate through pages", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });
    await waitFor(() => screen.getByText("letter-01"));
    expect(screen.getByText("letter-01")).toBeInTheDocument();

    const nextPageButton = screen.getByText("Next");
    fireEvent.click(nextPageButton);
  });

  it("should open dropdown menu and copy letter ID", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => screen.getByText("letter-01"));

    const menuButton = document.querySelector("#action");
    fireEvent.click(menuButton!, { target: { value: "Copy Letter ID" } });
  });

  it("should open dropdown menu and show detail letter", async () => {
    await act(async () => {
      render(
        <DashboardWraper employeeId="1" employeeTypeId={2}>
          <Dashboard>
            <Page />
          </Dashboard>
        </DashboardWraper>
      );
    });

    await waitFor(() => screen.getByText("letter-01"));

    const menuButton = document.querySelector("#action");
    fireEvent.click(menuButton!, { target: { value: "Detail Letter" } });

    await waitFor(() => expect(screen.getByText(/Letter Details/i)));
  });
});
