// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/ui"],
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY, // Ajoutez votre clé OpenAI ici
      goApi: process.env.GOAPI_KEY, // Ajoutez votre clé GoAPI ici
    },
  },
});
