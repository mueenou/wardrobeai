// server/api/generate-image.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default defineEventHandler(async (event) => {
  try {
    const { prompt } = await readBody(event);

    console.log(prompt);

    const response = await openai.images.generate({
      model: "dall-e-3", // ou "dall-e-2" pour la version précédente
      prompt: prompt,
      n: 1, // nombre d'images à générer
      quality: "standard", // "standard" ou "hd" pour dall-e-3
      style: "natural", // "natural" ou "vivid" pour dall-e-3
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
