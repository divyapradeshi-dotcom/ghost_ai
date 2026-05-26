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

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL(signInUrl, request.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
