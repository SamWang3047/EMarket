import { NextResponse, type NextRequest } from "next/server";
import {
  isBasicAuthAuthorized,
  resolveBasicAuthCredentials
} from "@/lib/basic-auth";

export function middleware(request: NextRequest) {
  let credentials;

  try {
    credentials = resolveBasicAuthCredentials({
      nodeEnv: process.env.NODE_ENV,
      username: process.env.APP_BASIC_AUTH_USER,
      password: process.env.APP_BASIC_AUTH_PASSWORD
    });
  } catch (error) {
    console.error("Basic authentication is not configured correctly.", error);

    return NextResponse.json(
      { error: "Application authentication is not configured." },
      {
        status: 503,
        headers: { "cache-control": "no-store" }
      }
    );
  }

  if (
    !credentials ||
    isBasicAuthAuthorized(request.headers.get("authorization"), credentials)
  ) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "cache-control": "no-store",
      "www-authenticate": 'Basic realm="EMarket", charset="UTF-8"'
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
