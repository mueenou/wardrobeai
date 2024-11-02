// server/api/generate-midjourney.ts

interface MidjourneyResponse {
  status: string;
  task_id: string;
}

interface ImageResult {
  code: number;
  data: {
    task_id: string;
    status: "pending" | "succeeded" | "failed";
    images?: string[];
    // autres propriétés possibles
  };
}

export default defineEventHandler(async (event) => {
  const apiKey = process.env.GOAPI_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: "API key is not configured",
    });
  }

  const headers = {
    "x-api-key": apiKey,
    "User-Agent": "Apidog/1.0.0 (https://apidog.com)",
    "Content-Type": "application/json",
  };

  try {
    // 1. Premier appel pour initier la génération
    const body = await readBody(event);
    const initialResponse = await $fetch<MidjourneyResponse>(
      "https://api.goapi.ai/api/v1/task",
      {
        method: "POST",
        headers,
        body: {
          model: "midjourney",
          task_type: "imagine",
          input: {
            prompt: body.prompt,
            aspect_ratio: body.aspectRatio || "16:9",
            process_mode: body.processMode || "fast",
            skip_prompt_check: false,
            bot_id: 0,
          },
          config: {
            service_mode: "",
            webhook_config: {
              endpoint: "",
              secret: "",
            },
          },
        },
      }
    );

    // 2. Polling pour obtenir le résultat
    const maxAttempts = 30; // Maximum 30 tentatives
    const pollingInterval = 2000; // 2 secondes entre chaque tentative
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Attendre l'intervalle de polling
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));

      // Vérifier le statut
      const result = await $fetch<ImageResult>(
        "https://api.goapi.ai/mj/v2/fetch",
        {
          method: "POST",
          headers,
          body: {
            task_id: initialResponse.task_id,
          },
        }
      );

      // Vérifier si l'image est prête
      if (result.data.status === "succeeded" && result.data.images?.[0]) {
        return {
          status: "success",
          imageUrl: result.data.images[0],
        };
      }

      // Si la génération a échoué
      if (result.data.status === "failed") {
        throw createError({
          statusCode: 400,
          message: "Image generation failed",
        });
      }

      attempts++;
    }

    // Si on atteint le nombre maximum de tentatives
    throw createError({
      statusCode: 408,
      message: "Timeout waiting for image generation",
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});
