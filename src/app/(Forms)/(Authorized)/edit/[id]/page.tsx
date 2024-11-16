import { lookup } from "@/server/actions/itunes";
import connection from "@/server/models";
import Review from "@/server/models/Review";
import User from "@/server/models/User";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Editor from "./Editor";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReleaseLayout({ params }: Props) {
  const session = await cookies()
    .then(User.authorize)
    .catch(() => redirect("/login"));

  const album = await params
    .then(({ id }) =>
      lookup(decodeURIComponent(id), { entity: "album", limit: "1" }),
    )
    .then((result) =>
      result.success && result.success.length >= 1
        ? result.success[0]
        : notFound(),
    )
    .catch((error: unknown) => {
      console.error(error);
      notFound();
    });

  await connection;
  const review = await Review.findOne({
    author: ObjectId.createFromHexString(session.id),
    releaseId: album.collectionId,
  }).catch(() => null);

  return (
    <Editor
      defaultValue={{
        rating: review?.rating ?? 0,
        content: review?.content ?? "",
        shouldPublish: !(review?.isDraft ?? true),
      }}
      release={album}
    />
  );
}
