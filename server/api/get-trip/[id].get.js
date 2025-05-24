import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const id = event.context.params.id;

  try {
    const { data, error } = await client
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching trip details",
    });
  }
});
