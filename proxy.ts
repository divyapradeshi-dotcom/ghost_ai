import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import {
  routePatternFromPath,
  signInPath,
  signInUrl,
  signUpPath,
} from "@/lib/auth-routes";

const isPublicRoute = createRouteMatcher([
  "/",
  routePatternFromPath(signInPath),
  routePatternFromPath(signUpPath),
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return;
  }

  if (isApiRoute(request)) {
    const { isAuthenticated } = await auth();

    if (!isAuthenticated) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return;
  }

  await auth.protect({
    unauthenticatedUrl: new URL(signInUrl, request.url).toString(),
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
