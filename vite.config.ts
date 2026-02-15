import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/icon-512x512.png", "icons/icon-maskable-512x512.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "vybz-api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "vybz-images-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      manifest: {
        name: "Vybz Music - Streaming & Discovery",
        short_name: "Vybz",
        description: "Your ultimate music streaming and discovery platform with offline playback support",
        start_url: "/",
        display: "standalone",
        background_color: "#141B2D",
        theme_color: "#E8622B",
        orientation: "portrait-primary",
        categories: ["music", "entertainment"],
        icons: [
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
