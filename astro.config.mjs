import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { autolinkConfig } from "./plugins/rehype-autolink-config";
import rehypeSlug from "rehype-slug";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import astroI18next from "astro-i18next";
import alpinejs from "@astrojs/alpinejs";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";

const defaultLocale = "en";
const locales = {
  en: "en", // the `defaultLocale` value must present in `locales` keys
  it: "it",
  fr: "fr",
};

// https://astro.build/config
export default defineConfig({
  site: "https://ytdll.vercel.app/it",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`
    }
  },
  output: "hybrid",
  integrations: [tailwind(), sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
    astroI18next(), 
    alpinejs(), 
    i18n({
      locales,
      defaultLocale,
    }),
    AstroPWA({
    mode: "production",
    base: "/",
    scope: "/",
    includeAssets: ["favicon.svg"],
    registerType: "autoUpdate",
    manifest: {
      name: "Astros - Starter Template for Astro with Tailwind CSS",
      short_name: "Astros",
      theme_color: "#ffffff",
      icons: [{
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      }, {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }, {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }]
    },
    workbox: {
      navigateFallback: "/404",
      globPatterns: ["*.js"]
    },
    devOptions: {
      enabled: false,
      navigateFallbackAllowlist: [/^\/404$/],
      suppressWarnings: true
    }
  }), icon(), solidJs()],
  markdown: {
    rehypePlugins: [rehypeSlug,
    // This adds links to headings
    [rehypeAutolinkHeadings, autolinkConfig]]
  },
  experimental: {
    contentCollectionCache: true
  },
  adapter: vercel()
});
