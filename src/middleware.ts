import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("adminToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Allow login route without a token
  if (pathname === "/admin/login") {
    if (token) {
      const isValid = await verifyToken(token, request);
      console.log("Token verification result:", isValid);
      if (isValid) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await verifyToken(token, request);
    console.log("Token verification result2:", isValid);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

// Call internal API to verify token
async function verifyToken(token: string, request: NextRequest): Promise<boolean> {
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    return data.valid === true;
  } catch (err) {
    console.error("Token verification failed:", err);
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
