// server/api/generate-image.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  try {
    const { prompt } = await readBody(event);

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1536",
      quality: "low",
      // Do NOT include `response_format`, it's not supported
    });

    const base64Image = response.data[0].b64_json;

    // Return the base64 string so frontend can render it
    return { image: `data:image/png;base64,${base64Image}` };
  } catch (error: any) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
