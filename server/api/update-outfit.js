import { createError } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { tripId, outfitSuggestions } = await readBody(event);
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  try {
    const { data, error } = await client
      .from("trips")
      .update({ outfit_suggestions: outfitSuggestions })
      .eq("id", tripId)
      .select();

    if (error) {
      throw createError({ statusMessage: error.message });
    }
    return data;
  } catch (error) {
    return error;
  }
});
