import SignIn from "@/app/(Auth)/login/SignIn";
import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Account() {
  const session = await authorize().catch(() => null);

  if (session !== null) {
    redirect("/");
  }

  return <SignIn />;
}
