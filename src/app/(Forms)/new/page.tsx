import { authorize } from "@/server/auth";
import { redirect } from "next/navigation";
import New from "./New";

export default async function Authorized() {
  const session = await authorize().catch(() => null);

  if (session === null) {
    redirect("/login");
  }

  return <New />
}