import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";
import Onboarding from "./Onboarding";

export default async function Unauthorized() {
  const session = await authorize().catch(() => null);

  if (session !== null) {
    redirect(`/@${session.username}`);
  }

  return <Onboarding />
}