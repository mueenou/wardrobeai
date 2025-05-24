import { createError } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { image, tripId, day } = await readBody(event);
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);

  try {
    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const filename = `${user.id}/${tripId}/${day}-${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await client.storage
      .from("outfit-images")
      .upload(filename, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      throw createError({ statusMessage: uploadError.message });
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = client.storage.from("outfit-images").getPublicUrl(filename);

    // Update the trip's outfit suggestions with the new image URL
    const { data: tripData, error: tripError } = await client
      .from("trips")
      .select("outfit_suggestions")
      .eq("id", tripId)
      .single();

    if (tripError) {
      throw createError({ statusMessage: tripError.message });
    }

    const updatedOutfitSuggestions = {
      ...tripData.outfit_suggestions,
      [day]: {
        ...tripData.outfit_suggestions[day],
        imageUrl: publicUrl,
      },
    };

    const { error: updateError } = await client
      .from("trips")
      .update({ outfit_suggestions: updatedOutfitSuggestions })
      .eq("id", tripId);

    if (updateError) {
      throw createError({ statusMessage: updateError.message });
    }

    return { imageUrl: publicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
