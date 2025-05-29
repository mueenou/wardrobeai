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
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/landing",
      callback: "/confirm",
      include: undefined,
      exclude: ["/register", "/landing", "/login"],
      cookieRedirect: false,
    },
  },
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
  },
});
