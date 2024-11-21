import { faHome, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export type Route = {
  pathname: string;
  icon: any;
  menu: string;
};

export const getRoutes = (employeeTypeId: number | null): Route[] => {
  switch (employeeTypeId) {
    case 1:
      return [
        { pathname: "/superadmin", icon: faHome, menu: "Home" },
        { pathname: "/superadmin/employees", icon: faUser, menu: "Employees" },
        {
          pathname: "/letter",
          icon: faEnvelope,
          menu: "Letter",
        },
      ];
    case 2:
      return [
        {
          pathname: "/letter",
          icon: faEnvelope,
          menu: "Letter",
        },
      ];
    case 3:
      return [
        {
          pathname: "/letter",
          icon: faEnvelope,
          menu: "Letter",
        },
      ];
    case 4:
      return [
        {
          pathname: "/letter",
          icon: faEnvelope,
          menu: "Letter",
        },
      ];
    default:
      return [];
  }
};
