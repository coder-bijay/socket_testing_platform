import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated =
    !!request.cookies.get("token")?.value &&
    !!request.cookies.get("refreshToken")?.value &&
    !!request.cookies.get("baseUrl")?.value &&
    !!request.cookies.get("sessionId")?.value;

  const hasSocketData =
    !!request.cookies.get("socketPath")?.value &&
    !!request.cookies.get("socketUrl")?.value;

  const protectedRoutes = ["/", "/login", "/socket"];

  const pathname: string = request.nextUrl.pathname;

  //CONDITION TO HANDLE UNAUTHENTICATED USER FROM VISITING PROTECTED ROUTE
  if (!isAuthenticated && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }

  //BLOCK USER TO VISIT LOGIN PAGE AFTER USER IS LOGIN TO THE SYSTEM
  if (isAuthenticated && pathname.includes("/login")) {
    return NextResponse.redirect(new URL(request.url));
  }

  //BLOCK USER TO VISIT LOGIN PAGE WITH LANGUAGE ROUTE (I.E "FR/LOGIN", "EN/LOGIN" ETC)
  if (!isAuthenticated && pathname.includes("/login")) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (!hasSocketData && pathname.includes("/socket")) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }
}

//MIDDLEWARE MATCHER FOR PROTECTING ROUTES
export const config = {
  matcher: ["/", "/socket"],
};
