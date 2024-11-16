"use server";

import * as z from "zod";

const ItunesResults = <T extends z.SomeZodObject>(schema: T) =>
  z.object({
    results: z
      .array(z.unknown())
      .transform((results) =>
        results
          .map((item) => schema.safeParse(item).data)
          .filter((item): item is z.infer<T> => item !== undefined),
      ),
  });

const Releases = ItunesResults(
  z.object({
    wrapperType: z.literal("collection"),
    collectionExplicitness: z.enum(["explicit", "cleaned", "notExplicit"]),
    artistId: z.number().transform((id) => `i:${String(id)}`),
    collectionId: z.number().transform((id) => `i:${String(id)}`),
    collectionName: z.string(),
    collectionCensoredName: z.string(),
    artistName: z.string(),
    artworkUrl100: z.string().url().optional(),
    collectionType: z.string(),
    contentAdvisoryRating: z.string().optional(),
    primaryGenreName: z.string().optional(),
    releaseDate: z.string().datetime(),
    trackCount: z.number(),
  }),
);

export type Release = z.infer<typeof Releases>["results"][number];

interface SearchParams {
  term: string;
  country: string;
  media: "music";
  entity: "album";
  limit?: string;
  explicit?: "Yes" | "No";
}

export async function search(
  query: string,
  params: Omit<SearchParams, "term">,
) {
  const urlSearchParams = new URLSearchParams({
    term: query,
    ...params,
  } satisfies SearchParams);

  const response = await fetch(
    `https://itunes.apple.com/search?${urlSearchParams.toString()}`,
  );

  if (response.status !== 200) {
    return { error: "An unexpected error occurred." };
  }

  try {
    const json: unknown = await response.json();
    const data = await Releases.parseAsync(json);

    return {
      success: data.results,
    };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred." };
  }
}

interface LookupParams {
  id: string;
  entity: "album";
  limit?: string;
}

export async function lookup(id: string, params: Omit<LookupParams, "id">) {
  const urlSearchParams = new URLSearchParams({
    id: id.split(":")[1],
    ...params,
  } satisfies LookupParams);

  const response = await fetch(
    `https://itunes.apple.com/lookup?${urlSearchParams.toString()}`,
  );

  if (response.status !== 200) {
    return { error: "An unexpected error occurred." };
  }

  try {
    const { results } = await response
      .json()
      .then((json) => Releases.parseAsync(json));

    return {
      success: results,
    };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred." };
  }
}
