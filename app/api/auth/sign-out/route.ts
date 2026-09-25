import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await signOut();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
