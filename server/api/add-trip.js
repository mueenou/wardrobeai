import { createError } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  try {
    const { data, error } = await client
      .from("trips")
      .insert({
        user_id: user.id,
        start_date: body.start_date,
        end_date: body.end_date,
        destination: body.destination,
        clothes_list: body.clothes_list,
        outfit_suggestions: body.outfit_suggestions,
      })
      .select();
    if (error) {
      throw createError({ statusMessage: error.message });
    }
    return data;
  } catch (error) {
    return error;
  }
});
