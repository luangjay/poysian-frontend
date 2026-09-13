"use server";

import { cookies } from "next/headers";
import { bannerExpandedCookieName } from "./_preferences";

export async function setBannerExpandedCookie(expanded: boolean) {
  const cookieStore = await cookies();

  cookieStore.set(bannerExpandedCookieName, String(expanded), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/design",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
