<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInterval } from '@vueuse/core'
import { forgetPasswordAPI, getForgetpasswordEmailCode } from '@/api/account'
import {
    type FormRules
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 表单数据
const formData = reactive({
    account: '',
    code: '',
    newpassword: '',
    confirmPassword: ''
})

// 表单规则
const rules: FormRules = {
    account: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email' as const, message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
        { min: 4, max: 6, message: '验证码长度为4-6位', trigger: 'blur' }
    ],
    newpassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (_rule: any, value: string) => {
                return value === formData.newpassword
            },
            message: '两次密码输入不一致',
            trigger: 'blur'
        }
    ]
}

// 验证码发送相关
const countdown = ref(0)
const isCountingDown = ref(false)

// 倒计时控制
const { pause, resume } = useInterval(1000, {
    controls: true,
    immediate: false,
    callback() {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            isCountingDown.value = false
            pause()
        }
    }
})

// 发送验证码按钮文本
const sendCodeButtonText = computed(() => {
    if (isCountingDown.value) {
        return `${countdown.value}秒后重新发送`
    }
    return '发送验证码'
})

// 加载状态
const loading = ref(false)
const sendingCode = ref(false)

// 密码可见性
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 发送邮箱验证码
const sendEmailCode = async () => {
    if (!formData.account) {
        message.error('请先输入邮箱地址')
        return
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.account)) {
        message.error('请输入正确的邮箱格式')
        return
    }

    try {
        sendingCode.value = true
        
        // 调用API发送验证码
        await getForgetpasswordEmailCode(formData.account)
        
        message.success('验证码已发送到您的邮箱')
        
        // 开始倒计时
        countdown.value = 60
        isCountingDown.value = true
        resume()
    } catch (error: any) {
        message.error(error.message || '发送失败，请重试')
    } finally {
        sendingCode.value = false
    }
}

// 提交表单
const handleSubmit = async () => {
    try {
        loading.value = true

        // 调用重置密码API
        await forgetPasswordAPI({
            account: formData.account,
            newpassword: formData.newpassword,
            code: formData.code
        })

        message.success('密码重置成功！')
        router.push('/login')
    } catch (error: any) {
        message.error(error.message || '重置失败，请重试')
    } finally {
        loading.value = false
    }
}

// 返回登录
const goToLogin = () => {
    router.push('/login')
}



</script>

<template>
    <n-infinite-scroll class="container-scroll">
        <n-card class="main-form">
            <n-form :model="formData" :rules="rules" size="large" label-placement="top">
                <div >
                    <div class="header mb-6">
                        <h1 class="title">找回密码</h1>
                         <p class="subtitle">请填写以下信息以重置您的密码</p>
                    </div>

                    <!-- 邮箱地址 -->
                    <n-form-item label="邮箱地址" path="account">
                        <n-input v-model:value="formData.account" placeholder="请输入您的注册邮箱"
                            :input-props="{ type: 'email' }">
                            <template #suffix>
                                <div class="i-carbon:email text-gray-400" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <!-- 验证码 -->
                    <n-form-item label="验证码" path="code">
                        <n-flex style="width: 100%">
                            <n-input v-model:value="formData.code" placeholder="请输入邮箱验证码" style="flex: 1" />
                            <n-button 
                                type="primary" 
                                ghost
                                :disabled="isCountingDown || !formData.account"
                                :loading="sendingCode"
                                @click="sendEmailCode"
                                style="width: 120px"
                            >
                                {{ sendCodeButtonText }}
                            </n-button>
                        </n-flex>
                    </n-form-item>

                    <!-- 新密码 -->
                    <n-form-item label="新密码" path="newpassword">
                        <n-input v-model:value="formData.newpassword" :type="showPassword ? 'text' : 'password'"
                            placeholder="请输入新密码" show-password-on="click">
                            <template #password-visible-icon>
                                <div class="i-carbon:view text-gray-400" />
                            </template>
                            <template #password-invisible-icon>
                                <div class="i-carbon:view-off text-gray-400" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <!-- 确认新密码 -->
                    <n-form-item label="确认新密码" path="confirmPassword">
                        <n-input v-model:value="formData.confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'" placeholder="请再次输入新密码"
                            show-password-on="click">
                            <template #password-visible-icon>
                                <div class="i-carbon:view text-gray-400" />
                            </template>
                            <template #password-invisible-icon>
                                <div class="i-carbon:view-off text-gray-400" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <!-- 重置密码按钮 -->
                    <n-form-item>
                        <n-button type="primary" size="large" :loading="loading" style="width: 100%; margin-top: 16px"
                            @click="handleSubmit">
                            重置密码
                        </n-button>
                    </n-form-item>

                    <!-- 返回登录 -->
                    <div class="footer">
                        <n-button text type="primary" @click="goToLogin">
                            返回登录
                        </n-button>
                    </div>
                </div>
            </n-form>
        </n-card>

    </n-infinite-scroll>
</template>

<style lang="less" scoped>
.main-form {
    width: 480px;
    margin-left: auto;
    margin-right: auto;
    max-width: 100vw;
    margin-top: 10vh;
    box-shadow: 0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
}
</style>