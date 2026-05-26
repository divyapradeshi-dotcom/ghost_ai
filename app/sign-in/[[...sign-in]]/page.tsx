import { SignIn } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { signInPath, signUpUrl } from "@/lib/auth-routes";

export default function SignInPage() {
  return (
    <AuthPageShell heading="Welcome back to Ghost AI">
      <SignIn path={signInPath} signUpUrl={signUpUrl} />
    </AuthPageShell>
  );
}
