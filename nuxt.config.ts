// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/icon", "@nuxtjs/supabase"],
	supabase: {
		redirect: false,
	},
});
