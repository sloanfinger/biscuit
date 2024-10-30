"use server";

export type Result<T> = Promise<
  (T extends never ? never : { success: T }) | { error: string }
>;
