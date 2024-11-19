import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies.get("USER");

  if (!cookies) return NextResponse.redirect(new URL("/", request.url));

  try {
    const dataUser = JSON.parse(cookies.value);
    const userId = dataUser.data.employee_type_id;
    const path = request.nextUrl.pathname;

    switch (userId) {
      case 1:
        if (
          path.startsWith("/secretary") ||
          path.startsWith("/receptionist") ||
          path.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/superadmin/", request.url));
        }
        break;
      case 2:
        if (
          path.startsWith("/superadmin") ||
          path.startsWith("/receptionist") ||
          path.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/secretary/", request.url));
        }
        break;
      case 3:
        if (
          path.startsWith("/superadmin") ||
          path.startsWith("/secretary") ||
          path.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/receptionist/", request.url));
        }
        break;
      case 4:
        if (
          path.startsWith("/superadmin") ||
          path.startsWith("/receptionist") ||
          path.startsWith("/secretary")
        ) {
          return NextResponse.redirect(new URL("/division/", request.url));
        }
        break;
      default:
        return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error parsing USER cookie:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/secretary/:path*",
    "/receptionist/:path*",
    "/division/:path*",
  ],
};
