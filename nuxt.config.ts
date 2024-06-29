// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",
  },
  colorMode: {
    preference: 'light'
  },
  modules: ["nitro-cloudflare-dev", "@nuxt/ui"],
})