<template>
    <div class="register-container">
        <n-card class="register-card" :bordered="false">
            <div class="logo-title">
                <img src="@/assets/images/logo.png" alt="logo" class="logo" />
                <div class="forum-title">音柚窝</div>
            </div>
            <div class="register-title">创建账号</div>
            <div class="register-desc">加入音游爱好者的集聚地，开启你的音乐之旅</div>
            <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" size="large" :disabled="loading">
                <n-form-item label="昵称" path="name">
                    <n-input v-model:value="form.name" placeholder="请输入昵称" :input-props="{ autocomplete: 'off' }" />
                </n-form-item>
                <n-form-item label="邮箱" path="email">
                    <n-input v-model:value="form.email" placeholder="请输入邮箱地址" :input-props="{ autocomplete: 'off' }">
                        <template #prefix>
                            <img src="./images/email.png" alt="邮箱" class="input-icon" />
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item label="邮箱验证码" path="RegisterCode">
                    <div class="captcha-row">
                        <n-input v-model:value="form.RegisterCode" placeholder="请输入邮箱验证码"
                            :input-props="{ autocomplete: 'off' }" />
                        <n-button type="primary" ghost :disabled="remaining > 0" @click="handleGetCode">
                            {{ remaining > 0 ? `${remaining}秒后重试` : '获取验证码' }}
                        </n-button>
                    </div>
                </n-form-item>
                <n-form-item label="设置密码" path="password">
                    <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="请输入密码"
                        :input-props="{ autocomplete: 'new-password' }">
                        <template #prefix>
                            <img src="./images/password.png" alt="密码" class="input-icon" />
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item label="确认密码" path="confirmPassword">
                    <n-input v-model:value="form.confirmPassword" type="password" show-password-on="click"
                        placeholder="请再次输入密码" :input-props="{ autocomplete: 'new-password' }">
                        <template #prefix>
                            <img src="./images/password.png" alt="密码" class="input-icon" />
                        </template>
                    </n-input>
                </n-form-item>
                <n-form-item label="图形验证码" path="captchaValue">
                    <div class="captcha-row">
                        <n-input v-model:value="form.captchaValue" placeholder="请输入图形验证码"
                            :input-props="{ autocomplete: 'off' }" />
                        <img class="captcha-img" :src="captchaUrl" alt="验证码" @click="refreshCaptcha" />
                    </div>
                </n-form-item>
              
                <n-form-item prop="isAcceptTerm">
                    <n-checkbox v-model:checked="form.isAcceptTerm">
                        我已阅读并同意
                        <a href="/user-agreement" target="_blank">用户协议</a>
                        和
                        <a href="/privacy-policy" target="_blank">隐私政策</a>
                    </n-checkbox>
                </n-form-item>
                <n-button type="primary" block size="large" @click="handleRegister"
                    :disabled="!form.isAcceptTerm || loading" :loading="loading">
                    立即注册
                </n-button>
            </n-form>
            <div class="login-link">
                已有账号？<a href="/login">立即登录</a>
            </div>
        </n-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NCard, useMessage, type FormRules } from 'naive-ui'
import { getCaptcha, getRegisterCode, register } from '@/api/account'
import { useCountdown } from "@vueuse/core"
import { type FormInst } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst>()
const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaValue: "",
    CaptchaUUID: "",
    RegisterCode: "",
    isAcceptTerm: false
})

const rules: FormRules = {
    name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur', key: "email" },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur', key: "email" }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (_, value) => value === form.value.password,
            message: '两次输入的密码不一致',
            trigger: 'blur'
        }
    ],
    captchaValue: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    RegisterCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
}
const app = useAppStore()
const captchaUrl = ref()
const { remaining, start, stop, pause, resume } = useCountdown(0, {
    onComplete() {
        resume();
    },

})

const loading = ref(false)

async function refreshCaptcha() {
    const result = await getCaptcha();
    console.log(result)
    captchaUrl.value = `data:image/;base64,${result.data.imgBase64}`;
    form.value.CaptchaUUID = result.data.uuid;
}
refreshCaptcha();

async function handleGetCode() {
    await formRef.value?.validate(() => { }, (rule) => rule.key === "email")
    try {
        const result = await getRegisterCode(form.value.email)
        if (result.code === 0) {
            message.success('验证码已发送到您的邮箱')
            start(60) // 开始倒计时
        } else {
            message.error(result.message || '获取验证码失败')
        }
    } catch (error) {
        message.error('获取验证码失败，请稍后重试')
    }
}

async function handleRegister() {
    await formRef.value?.validate()
    try {
        loading.value = true

        const result = await register(form.value)
        if (result.code === 0) {
            message.success('注册成功')
            app.token = result.data.token;
            app.userInfo = result.data.user;
            router.replace('/')
        }
    } catch (error: any) {
        message.error('注册失败，请稍后重试')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.register-container {
    min-height: 100vh;
    max-height: 100vh;
    height: 100vh;
    flex: 1;
    overflow-y:auto;
    display: flex;
    justify-content: center;
    background: #fff;
    /* overflow: hidden; */
}

.register-card {
    width: 520px;
    padding: 40px 32px 24px 32px;
    box-sizing: border-box;
}

.logo-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
}

.logo {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
}

.forum-title {
    font-size: 22px;
    font-weight: 700;
    color: #222;
    margin-bottom: 8px;
}

.register-title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 6px;
}

.register-desc {
    font-size: 14px;
    color: #888;
    text-align: center;
    margin-bottom: 24px;
}

.captcha-row {
    display: flex;
    align-items: center;
    width: 100%;
}

.captcha-row .n-input {
    flex: 1;
    margin-right: 8px;
}

.captcha-img {
    width: 90px;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
    object-fit: cover;
    border: 1px solid #eee;
}

.login-link {
    text-align: center;
    margin-top: 18px;
    color: #888;
    font-size: 14px;
}

.login-link a {
    color: #ff6a00;
    text-decoration: none;
    margin-left: 4px;
}

.input-icon {
    width: 18px;
    height: 18px;
    margin-right: 4px;
}
</style>
