import { createError } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  try {
    const { data, error } = await client
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      throw createError({ statusMessage: error.message });
    }
    return data;
  } catch (error) {
    return error;
  }
});
