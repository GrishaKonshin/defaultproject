import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
export default defineConfig({
    base: "defaultproject",
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    // const info = assetInfo.name.split(".")
                    // const extType = info[info.length - 1]
                    if (/\.(png|jpe?g|gif|svg|webp|webm|)$/.test(assetInfo.names)) {
                        return "assets/images/[name].[ext]"
                    }
                    if (/\.(css)$/.test(assetInfo.names)) {
                        return "assets/css/[name].css"
                    }
                    if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.names)) {
                        return "assets/fonts/[name].[ext]"
                    }
                    return "assets/[name].[ext]"
                },
                chunkFileNames: "assets/js/[name].js",
                entryFileNames: "assets/js/[name].js",
            },
        },
    },
})
