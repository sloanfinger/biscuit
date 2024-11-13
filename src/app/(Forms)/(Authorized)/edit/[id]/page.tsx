import { lookup } from "@/server/actions/itunes";
import connection from "@/server/models";
import Review from "@/server/models/Review";
import User from "@/server/models/User";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import * as z from "zod";
import Editor from "./Editor";

const paramSchema = z
  .object({
    id: z
      .string()
      .transform((str) => decodeURIComponent(str).split(":"))
      .pipe(z.tuple([z.enum(["i"]), z.coerce.number()])),
  })
  .transform(({ id }) => id);

interface Props {
  params: Promise<unknown>;
}

export default async function ReleaseLayout({ params }: Props) {
  const session = await cookies()
    .then(User.authorize)
    .catch(() => redirect("/login"));

  const album = await paramSchema
    .parseAsync(await params)
    .then(([_source, id]) => lookup(id, { entity: "album", limit: "1" }))
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
  const review = await Review
    .findOne({
      owner: ObjectId.createFromHexString(session.id),
      releaseId: `i:${String(album.collectionId)}`,
    })
    .catch(() => null);

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
