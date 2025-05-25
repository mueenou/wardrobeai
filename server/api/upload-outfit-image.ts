import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const { image, tripId, day } = await readBody(event);

    // Remove the data:image/png;base64, prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const filename = `outfit-${tripId}-${day}-${Date.now()}.png`;

    // Get Supabase client
    const client = await serverSupabaseClient(event);

    // Upload to Supabase Storage
    const { data, error } = await client.storage
      .from("outfit-images")
      .upload(filename, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = client.storage.from("outfit-images").getPublicUrl(filename);

    return { imageUrl: publicUrl };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
