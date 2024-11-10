"use server";

import * as z from "zod";

const ItunesResults = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    results: z.array(z.object(shape)),
  });

const Albums = ItunesResults({
  artistId: z.number(),
  artistName: z.string(),
  artistViewUrl: z.string().url(),
  artworkUrl60: z.string().url(),
  artworkUrl100: z.string().url(),
  collectionCensoredName: z.string(),
  collectionExplicitness: z.string(),
  collectionId: z.number(),
  collectionName: z.string(),
  collectionPrice: z.number().optional(),
  collectionType: z.string(),
  collectionViewUrl: z.string().url(),
  contentAdvisoryRating: z.string().optional(),
  copyright: z.string(),
  country: z.string(),
  currency: z.string(),
  primaryGenreName: z.string(),
  releaseDate: z.string().datetime(),
  trackCount: z.number(),
  wrapperType: z.string(),
});

export type Album = z.infer<typeof Albums>["results"][number];

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
    const data = await Albums.parseAsync(json);

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

export async function lookup(id: number, params: Omit<LookupParams, "id">) {
  const urlSearchParams = new URLSearchParams({
    id: id.toString(),
    ...params,
  } satisfies LookupParams);

  const response = await fetch(
    `https://itunes.apple.com/lookup?${urlSearchParams.toString()}`,
  );

  if (response.status !== 200) {
    return { error: "An unexpected error occurred." };
  }

  try {
    const json: unknown = await response.json();
    const data = await Albums.parseAsync(json);

    return {
      success: data.results,
    };
  } catch (error) {
    console.error(error);
    return { error: "An unexpected error occurred." };
  }
}
