const defaultSignInUrl = "/sign-in";
const defaultSignUpUrl = "/sign-up";

function pathnameFromUrl(url: string) {
  return url.startsWith("http") ? new URL(url).pathname : url;
}

export const signInUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? defaultSignInUrl;

export const signUpUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? defaultSignUpUrl;

export const signInPath = pathnameFromUrl(signInUrl);
export const signUpPath = pathnameFromUrl(signUpUrl);

export function routePatternFromPath(pathname: string) {
  return `${pathname.replace(/\/$/, "")}(.*)`;
}
