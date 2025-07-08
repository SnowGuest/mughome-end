import { useAppStore } from "@/stores/app";
import request from "@/utils/request";

type AccountResponse = InstanceBody<{
    user: User;
    token: Token;
}>;

/**
 * @description 登录
 */
export async function login(reqBody: Record<string, any>) {
    return await request.Post<AccountResponse>("/account/login", reqBody, {
        meta: {
            errorCode: {
                13: "该账号未注册",
                12: "用户名或者密码错误",
                21: "账号或密码错误",
                1001: "账号或密码错误",
            },
            authRole: "login",
        },
    });
}

/**
 * @description 注册
 */
export async function register(reqBody: Record<string, any>) {
    return await request.Post<AccountResponse>("/account/register", reqBody, {
        meta: {
            errorCode: {
                13: "该账号未注册",
                12: "用户名或者密码错误",
                21: "账号或密码错误",
                1001: "账号或密码错误",
            },
        },
    });
}

/**
 * @description 获取图形验证码
 */
export async function getCaptcha() {
    return await request.Get<
        InstanceBody<{
            uuid: string;
            imgBase64: string;
        }>
    >("/captcha");
}

/**
 * @description 注册的时候获取验证码
 */
export async function getRegisterCode(email: string) {
    return await request.Get<InstanceBody<undefined>>(
        "/account/sendRegisterCode",
        {
            params: { email },
            meta: {
                errorCode: {
                    16: "该邮箱已被其他账户注册",
                    41: "邮箱验证码错误,请重新获取",
                },
            },
        },
    );
}

interface UpdateUserInfoReqBody {
    nickname: User["nickName"];
    avatar: File;
    bio: User["bio"];
}

/**
 * @description 注册的时候获取验证码
 */
export async function updateUserInfo(reqBody: UpdateUserInfoReqBody) {
    const appStore = useAppStore();
    if (!appStore.userInfo) throw new Error("无用户信息");
    return request.Put<InstanceBody<undefined>>(
        `/user/${appStore.userInfo.id}`,
        reqBody,
        {
            meta: {
                errorCode: {},
            },
        },
    );
}
