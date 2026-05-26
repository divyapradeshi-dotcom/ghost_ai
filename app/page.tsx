import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { signInUrl } from "@/lib/auth-routes";

export default async function Home() {
  const { isAuthenticated } = await auth();

  redirect(isAuthenticated ? "/editor" : signInUrl);
}
