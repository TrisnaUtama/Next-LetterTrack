import "@testing-library/jest-dom";
import Login from "@/app/page";
import LayoutPage from "@/app/layout";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import * as loginActionModule from "../../hooks/(auth)/login/loginAction";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../hooks/(auth)/login/loginAction", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Login Page", () => {
  let push: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("should render the Login page", async () => {
    await act(async () => {
      render(
        <LayoutPage>
          <Login />
        </LayoutPage>
      );
    });

    expect(
      screen.getByRole("heading", { name: /Sign In/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  it("should submit the form successfully and redirect to the dashboard", async () => {
    (loginActionModule.default as jest.Mock).mockResolvedValueOnce({
      success: true,
      redirect: "/superadmin",
    });

    render(
      <LayoutPage>
        <Login />
      </LayoutPage>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "superadmin" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(loginActionModule.default).toHaveBeenCalledWith(
        "superadmin",
        "password"
      );
      expect(push).toHaveBeenCalledWith("/superadmin");
    });
  });

  it("should display an error message when login fails", async () => {
    (loginActionModule.default as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: "Invalid credentials",
    });

    render(
      <LayoutPage>
        <Login />
      </LayoutPage>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
  });
});
