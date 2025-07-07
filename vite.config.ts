import { fileURLToPath, URL } from "node:url";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";
import presetIcons from "@unocss/preset-icons";
import presetMini from "@unocss/preset-mini";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { VineVitePlugin } from "vue-vine/vite";
// https://vite.dev/config/
export default defineConfig({
  base: "/mughome-end/",
  plugins: [
    vue(),
    VineVitePlugin(),
    vueJsx(),
    vueDevTools(),
    UnoCSS({
      presets: [
        presetMini(),
        presetIcons({
          /* options */
        }),
        // ...other presets
      ],
    }),
    AutoImport({
      dts: "./types/auto-imports.d.ts",
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      dts: "./types/components.d.ts",
      resolvers: [NaiveUiResolver()],
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
