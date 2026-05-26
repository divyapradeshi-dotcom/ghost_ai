import { SignUp } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { signInUrl, signUpPath } from "@/lib/auth-routes";

export default function SignUpPage() {
  return (
    <AuthPageShell heading="Create your Ghost AI account">
      <SignUp path={signUpPath} signInUrl={signInUrl} />
    </AuthPageShell>
  );
}
