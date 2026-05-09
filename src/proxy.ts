import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE_NAME, verifyToken } from "@/lib/auth/jwt";
import { hasAnyRole } from "@/lib/auth/roles";

const routeRoleMap: Record<string, string[]> = {
  "/admin": ["ROLE_ADMIN"],
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080/api";

function extractCookieValueFromSetCookie(
  setCookieHeader: string,
  cookieName: string
) {
  const escaped = cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = setCookieHeader.match(new RegExp(`(?:^|,\\s*)${escaped}=([^;]*)`));
  if (!match?.[1]) {
    return null;
  }

  const rawValue = match[1].trim().replace(/^"|"$/g, "");
  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}

function splitSetCookieHeader(setCookieHeader: string) {
  return setCookieHeader
    .split(/,(?=\s*[^;,=\s]+=[^;,]*)/g)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

async function tryRefreshAccessToken(request: NextRequest) {
  const refreshUrl = `${API_BASE_URL}/auth/refresh`;

  try {
    const refreshResponse = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!refreshResponse.ok) {
      return { ok: false as const };
    }

    const responseHeaders = refreshResponse.headers as Headers & {
      getSetCookie?: () => string[];
    };
    const rawSetCookie = refreshResponse.headers.get("set-cookie") ?? "";

    const setCookies =
      typeof responseHeaders.getSetCookie === "function"
        ? responseHeaders.getSetCookie()
        : splitSetCookieHeader(rawSetCookie);

    const accessToken =
      extractCookieValueFromSetCookie(rawSetCookie, JWT_COOKIE_NAME) ??
      setCookies
        .map((cookie) => extractCookieValueFromSetCookie(cookie, JWT_COOKIE_NAME))
        .find(Boolean) ??
      null;

    if (!accessToken) {
      return { ok: false as const };
    }

    return {
      ok: true as const,
      setCookies,
      accessToken,
    };
  } catch {
    return { ok: false as const };
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const matched = Object.entries(routeRoleMap).find(([prefix]) =>
    pathname.startsWith(prefix)
  );

  if (!matched) {
    return NextResponse.next();
  }

  const [prefix, allowedRoles] = matched;

  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

  let payload = token ? await verifyToken(token) : null;
  let refreshedCookies: string[] = [];

  if (!payload) {
    const refreshResult = await tryRefreshAccessToken(request);
    if (!refreshResult.ok) {
      const signinUrl = new URL("/error", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }

    refreshedCookies = refreshResult.setCookies;
    payload = await verifyToken(refreshResult.accessToken);
    if (!payload) {
      const signinUrl = new URL("/error", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  if (!hasAnyRole(payload.roles, allowedRoles)) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  const response = NextResponse.next();
  refreshedCookies.forEach((cookie) => {
    response.headers.append("set-cookie", cookie);
  });
  response.headers.set("x-auth-protected-prefix", prefix);

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
