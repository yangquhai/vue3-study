// vite.config.js
import { defineConfig } from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver } from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import postCssPxToRem from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/postcss-pxtorem/index.js";
import autoprefixer from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/autoprefixer/lib/autoprefixer.js";
import copy from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
import { resolve } from "path";
import Unocss from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/unocss/dist/vite.mjs";
import { presetUno, presetAttributify, presetIcons } from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/unocss/dist/index.mjs";
import UnocssIcons from "file:///C:/Users/admin/Desktop/anywell-collaboration/node_modules/@unocss/preset-icons/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\admin\\Desktop\\anywell-collaboration";
var vite_config_default = defineConfig(({ mode }) => {
  const PROJECT_NAME = "anywell-collaboration";
  const FOLDER_PATH = `/projects/mobile/${PROJECT_NAME}/`;
  const BASE_PATH = mode === "development" ? "" : FOLDER_PATH;
  return {
    // 根据mode返回不同的配置选项
    base: BASE_PATH,
    // 修改 publicPath
    build: {
      rollupOptions: {
        output: {
          // 修改输出目录为 dist/projects/mobile/anywell-collaboration
          dir: resolve(__vite_injected_original_dirname, "dist" + FOLDER_PATH)
        }
      }
    },
    server: {
      port: 8080,
      cors: true,
      //开发模式
      host: "0.0.0.0",
      proxy: {
        "^/api/*": {
          /* 转发/api  */
          target: "http://dx.anywellchat.com:8888/ANYWELL_hylingls",
          changeOrigin: true,
          //允许跨域
          rewrite: (path) => path.replace(/^\/api/, "")
          //路径重新
        }
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()]
      }),
      Unocss({
        presets: [
          UnocssIcons({
            prefix: "i-",
            extraProperties: {
              display: "inline-block"
            }
          }),
          presetUno(),
          presetAttributify(),
          presetIcons()
        ]
      }),
      copy({
        targets: [
          // 将 index.html 复制到 dist 目录中，并重命名为 anywell-collaboration.html
          { src: `dist${FOLDER_PATH}index.html`, dest: "dist", rename: `${PROJECT_NAME}.html` }
        ],
        hook: "writeBundle"
        // 在构建完成后执行复制操作
      })
    ],
    resolve: {
      // 设置路径别名
      alias: {
        "_components": resolve(__vite_injected_original_dirname, "./src/components"),
        "_request": resolve(__vite_injected_original_dirname, "./src/utils/request"),
        "_api": resolve(__vite_injected_original_dirname, "./src/utils/api"),
        "_helpers": resolve(__vite_injected_original_dirname, "./src/utils/helpers"),
        "_stores": resolve(__vite_injected_original_dirname, "./src/stores"),
        "*": resolve("")
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer,
          postCssPxToRem({
            rootValue: 37.5,
            propList: ["*"]
          })
        ]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhZG1pblxcXFxEZXNrdG9wXFxcXGFueXdlbGwtY29sbGFib3JhdGlvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWRtaW5cXFxcRGVza3RvcFxcXFxhbnl3ZWxsLWNvbGxhYm9yYXRpb25cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FkbWluL0Rlc2t0b3AvYW55d2VsbC1jb2xsYWJvcmF0aW9uL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgcG9zdENzc1B4VG9SZW0gZnJvbSAncG9zdGNzcy1weHRvcmVtJ1xyXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcclxuaW1wb3J0IGNvcHkgZnJvbSAncm9sbHVwLXBsdWdpbi1jb3B5J1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuXHJcbmltcG9ydCBVbm9jc3MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCB7IHByZXNldFVubywgcHJlc2V0QXR0cmlidXRpZnksIHByZXNldEljb25zIH0gZnJvbSAndW5vY3NzJ1xyXG5pbXBvcnQgVW5vY3NzSWNvbnMgZnJvbSAnQHVub2Nzcy9wcmVzZXQtaWNvbnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgICBjb25zdCBQUk9KRUNUX05BTUUgPSAnYW55d2VsbC1jb2xsYWJvcmF0aW9uJ1xyXG4gICAgY29uc3QgRk9MREVSX1BBVEggPSBgL3Byb2plY3RzL21vYmlsZS8ke1BST0pFQ1RfTkFNRX0vYFxyXG4gICAgY29uc3QgQkFTRV9QQVRIID0gbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/ICcnIDogRk9MREVSX1BBVEhcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gXHU2ODM5XHU2MzZFbW9kZVx1OEZENFx1NTZERVx1NEUwRFx1NTQwQ1x1NzY4NFx1OTE0RFx1N0Y2RVx1OTAwOVx1OTg3OVxyXG4gICAgICAgIGJhc2U6IEJBU0VfUEFUSCwgLy8gXHU0RkVFXHU2NTM5IHB1YmxpY1BhdGhcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTRGRUVcdTY1MzlcdThGOTNcdTUxRkFcdTc2RUVcdTVGNTVcdTRFM0EgZGlzdC9wcm9qZWN0cy9tb2JpbGUvYW55d2VsbC1jb2xsYWJvcmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyOiByZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnICsgRk9MREVSX1BBVEgpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICAgICAgICAgIGNvcnM6dHJ1ZSwvL1x1NUYwMFx1NTNEMVx1NkEyMVx1NUYwRlxyXG4gICAgICAgICAgICBob3N0OlwiMC4wLjAuMFwiLFxyXG4gICAgICAgICAgICBwcm94eTp7XHJcbiAgICAgICAgICAgICAgJ14vYXBpLyonOnsgLyogXHU4RjZDXHU1M0QxL2FwaSAgKi9cclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9keC5hbnl3ZWxsY2hhdC5jb206ODg4OC9BTllXRUxMX2h5bGluZ2xzJyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwvL1x1NTE0MVx1OEJCOFx1OERFOFx1NTdERlxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLy9cdThERUZcdTVGODRcdTkxQ0RcdTY1QjBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXSxcclxuICAgICAgICAgICAgfSksXHJcblxyXG4gICAgICAgICAgICBVbm9jc3Moe1xyXG4gICAgICAgICAgICAgICAgcHJlc2V0czogW1xyXG4gICAgICAgICAgICAgICAgICAgIFVub2Nzc0ljb25zKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAnaS0nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYVByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBwcmVzZXRVbm8oKSxcclxuICAgICAgICAgICAgICAgICAgICBwcmVzZXRBdHRyaWJ1dGlmeSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXNldEljb25zKClcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBjb3B5KHtcclxuICAgICAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAvLyBcdTVDMDYgaW5kZXguaHRtbCBcdTU5MERcdTUyMzZcdTUyMzAgZGlzdCBcdTc2RUVcdTVGNTVcdTRFMkRcdUZGMENcdTVFNzZcdTkxQ0RcdTU0N0RcdTU0MERcdTRFM0EgYW55d2VsbC1jb2xsYWJvcmF0aW9uLmh0bWxcclxuICAgICAgICAgICAgICAgICAgICB7IHNyYzogYGRpc3Qke0ZPTERFUl9QQVRIfWluZGV4Lmh0bWxgLCBkZXN0OiAnZGlzdCcsIHJlbmFtZTogYCR7UFJPSkVDVF9OQU1FfS5odG1sYCB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGhvb2s6ICd3cml0ZUJ1bmRsZScsIC8vIFx1NTcyOFx1Njc4NFx1NUVGQVx1NUI4Q1x1NjIxMFx1NTQwRVx1NjI2N1x1ODg0Q1x1NTkwRFx1NTIzNlx1NjRDRFx1NEY1Q1xyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgLy8gXHU4QkJFXHU3RjZFXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHJcbiAgICAgICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICAgICAnX2NvbXBvbmVudHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcclxuICAgICAgICAgICAgICAgICdfcmVxdWVzdCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMvcmVxdWVzdCcpLFxyXG4gICAgICAgICAgICAgICAgJ19hcGknOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3V0aWxzL2FwaScpLFxyXG4gICAgICAgICAgICAgICAgJ19oZWxwZXJzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscy9oZWxwZXJzJyksXHJcbiAgICAgICAgICAgICAgICAnX3N0b3Jlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmVzJyksXHJcbiAgICAgICAgICAgICAgICAnKic6IHJlc29sdmUoJycpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNzczoge1xyXG4gICAgICAgICAgICBwb3N0Y3NzOiB7XHJcbiAgICAgICAgICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3ByZWZpeGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc3RDc3NQeFRvUmVtKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFZhbHVlOiAzNy41LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wTGlzdDogWycqJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1UsU0FBUyxvQkFBb0I7QUFDN1YsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGVBQWU7QUFFeEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsV0FBVyxtQkFBbUIsbUJBQW1CO0FBQzFELE9BQU8saUJBQWlCO0FBWHhCLElBQU0sbUNBQW1DO0FBYXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3RDLFFBQU0sZUFBZTtBQUNyQixRQUFNLGNBQWMsb0JBQW9CO0FBQ3hDLFFBQU0sWUFBWSxTQUFTLGdCQUFnQixLQUFLO0FBQ2hELFNBQU87QUFBQTtBQUFBLElBRUgsTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDSCxlQUFlO0FBQUEsUUFDWCxRQUFRO0FBQUE7QUFBQSxVQUVKLEtBQUssUUFBUSxrQ0FBVyxTQUFTLFdBQVc7QUFBQSxRQUNoRDtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixNQUFLO0FBQUE7QUFBQSxNQUNMLE1BQUs7QUFBQSxNQUNMLE9BQU07QUFBQSxRQUNKLFdBQVU7QUFBQTtBQUFBLFVBQ1IsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsVUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUE7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNKO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxJQUFJO0FBQUEsTUFDSixXQUFXO0FBQUEsUUFDUCxXQUFXLENBQUMsYUFBYSxDQUFDO0FBQUEsTUFDOUIsQ0FBQztBQUFBLE1BRUQsT0FBTztBQUFBLFFBQ0gsU0FBUztBQUFBLFVBQ0wsWUFBWTtBQUFBLFlBQ1IsUUFBUTtBQUFBLFlBQ1IsaUJBQWlCO0FBQUEsY0FDYixTQUFTO0FBQUEsWUFDYjtBQUFBLFVBQ0osQ0FBQztBQUFBLFVBQ0QsVUFBVTtBQUFBLFVBQ1Ysa0JBQWtCO0FBQUEsVUFDbEIsWUFBWTtBQUFBLFFBQ2hCO0FBQUEsTUFDSixDQUFDO0FBQUEsTUFDRCxLQUFLO0FBQUEsUUFDRCxTQUFTO0FBQUE7QUFBQSxVQUVMLEVBQUUsS0FBSyxPQUFPLHlCQUF5QixNQUFNLFFBQVEsUUFBUSxHQUFHLG9CQUFvQjtBQUFBLFFBQ3hGO0FBQUEsUUFDQSxNQUFNO0FBQUE7QUFBQSxNQUNWLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTO0FBQUE7QUFBQSxNQUVMLE9BQU87QUFBQSxRQUNILGVBQWUsUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxRQUNwRCxZQUFZLFFBQVEsa0NBQVcscUJBQXFCO0FBQUEsUUFDcEQsUUFBUSxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLFFBQzVDLFlBQVksUUFBUSxrQ0FBVyxxQkFBcUI7QUFBQSxRQUNwRCxXQUFXLFFBQVEsa0NBQVcsY0FBYztBQUFBLFFBQzVDLEtBQUssUUFBUSxFQUFFO0FBQUEsTUFDbkI7QUFBQSxJQUNKO0FBQUEsSUFFQSxLQUFLO0FBQUEsTUFDRCxTQUFTO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDTDtBQUFBLFVBQ0EsZUFBZTtBQUFBLFlBQ1gsV0FBVztBQUFBLFlBQ1gsVUFBVSxDQUFDLEdBQUc7QUFBQSxVQUNsQixDQUFDO0FBQUEsUUFDTDtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
