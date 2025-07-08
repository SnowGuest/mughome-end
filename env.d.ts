/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_REQUEST_BASE_URL: string;
    readonly VITE_REQUEST_BASE_WS_URL: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

import type { StyleValue } from "vue";
import "vue-router";

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {};

declare module "vue-router" {
    interface RouteMeta {
        background?: string;
    }
}
