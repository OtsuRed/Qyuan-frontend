import {defineConfig} from "vite";
import vue from  '@vitejs/plugin-vue'
import * as http from "http"
import { resolve } from 'path'

export default defineConfig(()=>{
    return {
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    server: {
        port: 5173,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9999',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
                secure: false,
                agent: new http.Agent(),
            },
            '/ai':{
                target: 'http://119.3.221.150:8001',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/ai/, ''),
                secure: false,
                agent: new http.Agent(),
            },
            '/obs-proxy': {
                target: 'https://bucket-pdf-74a6.obs.cn-north-4.myhuaweicloud.com',
                changeOrigin: true,
                rewrite: path => {
                    // 保留完整的路径
                    return path.replace(/^\/obs-proxy/, '')
                },
                secure: false,
                headers: {
                    'Accept': 'application/pdf',
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        }
    }
}
})