import { createError } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  try {
    const { data, error } = await supabase
      .from("trips")
      .update({ outfit_suggestions: updatedOutfitSuggestions })
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
