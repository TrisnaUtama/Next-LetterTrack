import {
  faHome,
  faUser,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";

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
          pathname: "/superadmin/departments",
          icon: faPlaneDeparture,
          menu: "Departments",
        },
      ];
    case 2:
      return [{ pathname: "/secretary", icon: faHome, menu: "Home" }];
    case 3:
      return [{ pathname: "/receptionist", icon: faHome, menu: "Home" }];
    default:
      return [];
  }
};
