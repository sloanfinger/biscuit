import { cookies } from "next/headers";
import Link from "next/link";
import { PiPencilSimple } from "react-icons/pi";
import ReviewDelete from "./ReviewDelete";
import User from "@/server/models/User";

interface Props {
  releaseId: string;
  username: string;
}

export default async function ReveiwToolbar({ releaseId, username }: Props) {
  const session = await cookies().then(User.authorize).catch(() => null);

  if (session === null || session.avatar.username !== username) {
    return null;
  }

  return (
    <div className="flex gap-3 pr-[3px]">
      <Link
        className="-m-[3px] rounded-md border border-yellow-400/50 bg-yellow-700/25 p-0.5 text-yellow-400 hover:border-yellow-400"
        href={`/edit/${releaseId}`}
      >
        <PiPencilSimple />
        <span className="sr-only">Edit Review</span>
      </Link>

      <ReviewDelete releaseId={releaseId} />
    </div>
  );
}
