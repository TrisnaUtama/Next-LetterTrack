import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies.get("USER");

  if (!cookies) return NextResponse.redirect(new URL("/", request.url));

  try {
    const dataUser = JSON.parse(cookies.value);
    const userId = dataUser.data.employee_type_id;
    const path = request.nextUrl.pathname;

    console.log(userId);

    switch (userId) {
      case 1:
        if (
          request.nextUrl.pathname.startsWith("/secretary") ||
          request.nextUrl.pathname.startsWith("/receptionist") ||
          request.nextUrl.pathname.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/superadmin/", request.url));
        }
        break;
      case 2:
        if (
          request.nextUrl.pathname.startsWith("/superadmin") ||
          request.nextUrl.pathname.startsWith("/receptionist") ||
          request.nextUrl.pathname.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/secretary/", request.url));
        }
        break;
      case 3:
        if (
          request.nextUrl.pathname.startsWith("/superadmin") ||
          request.nextUrl.pathname.startsWith("/secretary") ||
          request.nextUrl.pathname.startsWith("/division")
        ) {
          return NextResponse.redirect(new URL("/receptionist/", request.url));
        }
        break;
      case 4:
        if (
          request.nextUrl.pathname.startsWith("/superadmin") ||
          request.nextUrl.pathname.startsWith("/receptionist") ||
          request.nextUrl.pathname.startsWith("/secretary")
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
  matcher: ["/superadmin/:path*", "/secretary/:path*", "/receptionist/:path*"],
};
