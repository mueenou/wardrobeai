// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/icon",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@nuxt/fonts",
  ],
  nitro: {
    routeRules: {
      "/**": { middleware: { override: true } },
    },
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: undefined,
      exclude: ["/register"],
      cookieRedirect: false,
    },
  },
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY, // Ajoutez votre clé OpenAI ici
    },
  },
});
