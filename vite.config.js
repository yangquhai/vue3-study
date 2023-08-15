import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postCssPxToRem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'
import copy from 'rollup-plugin-copy'
import { resolve } from 'path'
// import browserslist from 'browserslist'
// import legacy from '@vitejs/plugin-legacy'

// const browserslistConfig = browserslist.loadConfig({ path: '.' })

import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import UnocssIcons from '@unocss/preset-icons'

export default defineConfig(({ mode }) => {
    const PROJECT_NAME = 'anywell-collaboration'
    const FOLDER_PATH = `/projects/mobile/${PROJECT_NAME}/`
    const BASE_PATH = mode === 'development' ? '' : FOLDER_PATH
    return {
        chunkSizeWarningLimit: 1500,
        // 根据mode返回不同的配置选项
        base: BASE_PATH, // 修改 publicPath
        build: {
            rollupOptions: {
                output: {
                    // 修改输出目录为 dist/projects/mobile/anywell-collaboration
                    dir: resolve(__dirname, 'dist' + FOLDER_PATH),
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                },
            }
        },
        server: {
            port: 8080,
            cors: true,//开发模式
            host: "0.0.0.0",
            proxy: {
                '^/api/*': {
                    target: 'http://dx.anywellchat.com:8888/ANYWELL_hylingls',
                    changeOrigin: true,//允许跨域
                    rewrite: (path) => path.replace(/^\/api/, "")
                }
            },
        },
        plugins: [
            vue(),
            // legacy({
            //     targets: browserslistConfig,
            //   }),
            Components({
                resolvers: [VantResolver()],
            }),

            Unocss({
                presets: [
                    UnocssIcons({
                        prefix: 'i-',
                        extraProperties: {
                            display: 'inline-block'
                        }
                    }),
                    presetUno(),
                    presetAttributify(),
                    presetIcons()
                ],
            }),
            copy({
                targets: [
                    // 将 index.html 复制到 dist 目录中，并重命名为 anywell-collaboration.html
                    { src: `dist${FOLDER_PATH}index.html`, dest: 'dist', rename: `${PROJECT_NAME}.html` },
                ],
                hook: 'writeBundle', // 在构建完成后执行复制操作
            }),
        ],
        resolve: {
            // 设置路径别名
            alias: {
                '_components': resolve(__dirname, './src/components'),
                '_request': resolve(__dirname, './src/utils/request'),
                '_api': resolve(__dirname, './src/utils/api'),
                '_helpers': resolve(__dirname, './src/utils/helpers'),
                '_stores': resolve(__dirname, './src/stores'),
                '*': resolve(''),
            },
        },

        css: {
            postcss: {
                plugins: [
                    autoprefixer,
                    postCssPxToRem({
                        rootValue: 37.5,
                        propList: ['*'],
                    })
                ]
            }
        },
    }
})
