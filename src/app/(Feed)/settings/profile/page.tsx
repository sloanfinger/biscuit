import connection from "@/server/models";
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

export default async function Page({ params }: Props) {
  const session = await cookies()
    .then(User.authorize)
    .catch(() => redirect("/login"));

    await connection;

  const user = await User.findOne({
    _id: new ObjectId(session.id), 
  }).catch(() => null);

  if (!user) {
    return notFound(); 
  }

  return (
    <Editor
      defaultValue={{
        username: user.profile.avatar.username,
        email: user.settings.email,
        bio: user.profile.bio ?? "",
        avatarImage: user.profile.avatar.image ?? "",
        bannerImage: user.profile.profileBanner ?? "",
        displayName: user.profile.avatar.displayName,
        password: "",
      }}
    />
  )
}
