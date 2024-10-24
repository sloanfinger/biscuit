import CreateAccount from "@/app/(Auth)/onboarding/CreateAccount";
import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const session = await authorize().catch(() => null);

  if (session !== null) {
    redirect("/");
  }

  return <CreateAccount />;
}
