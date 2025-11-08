import { useAppStore } from "@/stores/app";
import { createAlova } from "alova";
import fetchAdapter from "alova/fetch";
import VueHook from "alova/vue";
import { createClientTokenAuthentication } from "alova/client";
import { refreshToken } from "@/api/token";
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar", "modal"],
);

const { onAuthRequired, onResponseRefreshToken } =
    createClientTokenAuthentication({
        async login(response) {
            const res = await response.clone().json();
            const appStore = useAppStore();
            if (res.code === 0) {
                console.log(res.data.token, "过来了");
                appStore.userInfo = res.data.user;
                appStore.token = res.data.token;
                console.log(appStore.token, "存入token");
            }
        },

        refreshToken: {
            // 在请求前触发，将接收到method参数，并返回boolean表示token是否过期
            isExpired: () => {
                const appStore = useAppStore();
                if (appStore.token) {
                    return Number(`${appStore.token.exp}0000`) +
                            (2 * 60 * 1000) <
                        Date.now();
                }
                return false;
            },

            // 当token过期时触发，在此函数中触发刷新token
            handler: async () => {
                const appStore = useAppStore();
                try {
                    const { data } = await refreshToken();
                    console.log("过期了");
                    appStore.token = data.token;
                } catch (error) {
                    console.log(error);
                    // appStore.loginOut()
                    // localforage.clear();
                    // const router = useRouter()
                    // router
                    // token刷新失败，跳转回登录页
                    // location.href = '/login';
                    // 并抛出错误
                    throw error;
                }
            },
        },
    });
console.log(fetchAdapter);
const alovaInstance = createAlova({
    requestAdapter: fetchAdapter(),
    statesHook: VueHook,
    baseURL: import.meta.env.VITE_REQUEST_BASE_URL,
    timeout: 10000,
    cacheFor: {
        GET: {
            expire: 1000, // 10分钟缓存
        },
    },
    beforeRequest: onAuthRequired((method) => {
        const appStore = useAppStore();
        console.log(method.meta, "走不走拦截");
        if (method.meta && "requiredLogin" in method.meta) {
            console.log(method.meta.requiredLogin, "是否要求必须登录");
        }
        if (
            method.meta && "requiredLogin" in method.meta &&
            method.meta.requiredLogin && !appStore.signin
        ) {
            message.warning("请先登录");
            throw Promise.reject();
        }
        console.log(appStore.signin, "看看有没有登录");
        if (appStore.signin) {
            method.config.headers.Authorization =
                `Bearer ${appStore.token?.value}`;
        }
    }),
    responded: onResponseRefreshToken({
        onSuccess: async (response, method) => {
            const appStore = useAppStore();

            let json = await response.json();
            if (method.meta?.errorCode) {
                requestError2Message(json, method.meta.errorCode);
            }
            if (json.code === 52) {
                appStore.loginOut();
                message.warning("登录信息已过期，请重新登录");
                const newRponse = await method;
                method.config.headers.Authorization = undefined;
                json = await newRponse.json();
                if (method.meta?.errorCode) {
                    requestError2Message(json, method.meta.errorCode);
                }
                // throw Promise.reject(json);
            }

            return json;
        },

        // 请求失败的拦截器
        // 请求错误时将会进入该拦截器。
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onError: () => {
            message.error("服务器异常，请稍后重试");
        },
    }),
});
function requestError2Message<T>(
    reqBody: InstanceBody<T>,
    errorBody: Record<string, string>,
) {
    if (reqBody.code in errorBody) {
        message.error(errorBody[reqBody.code]);
    }
}

export default alovaInstance;
