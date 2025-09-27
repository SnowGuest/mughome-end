<template>
    <n-modal v-model:show="show" :close-on-esc="false" preset="dialog" title="修改邮箱" positive-text="确认修改"
        negative-text="取消" size="large" @positive-click="handleSubmit" @negative-click="show = false">

        <!-- 当前绑定邮箱显示 -->
        <n-alert type="success" :show-icon="true" class="mb-4">
            <template #header>
                当前绑定邮箱
            </template>
            {{ currentEmail }}
        </n-alert>

        <n-form :model="form" :rules="rules">
            <n-form-item label="新邮箱地址" path="newemail">
                <n-input v-model:value="form.newemail" placeholder="请输入新的邮箱地址" />
            </n-form-item>

            <n-form-item label="验证码" path="code">
                <n-input-group>
                    <n-input v-model:value="form.code" placeholder="请输入验证码" />
                    <n-button class="w-30" type="primary" :disabled="isCountingDown" @click="handleSendCode">
                        {{ sendCodeButtonText }}
                    </n-button>
                </n-input-group>
            </n-form-item>

            <div class="text-sm text-gray-500 mb-4">
                验证码将发送至您的新邮箱
            </div>
        </n-form>

    </n-modal>
</template>
<script setup lang="ts">
import type { FormRules } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { useInterval } from '@vueuse/core';
import { getUpdateUserEmailCode, updateEmailAPI } from '@/api/account';
import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'vue-router';

const show = defineModel<boolean>('show');
const { user } = defineProps<{ user: User }>();
const message = useMessage();

// 当前邮箱地址 - 可以根据实际情况设置
const currentEmail = computed(() => user.email) // 留空变量，可以从 user 对象中获取

// 倒计时相关
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
        return `${countdown.value}s 后重新发送`
    }
    return '发送验证码'
})

const form = ref({
    newemail: '',
    code: '',
})
const rules: FormRules = {
    newemail: [
        { required: true, message: '请输入邮箱地址' },
        { type: 'email', message: '请输入正确的邮箱地址' },
    ],
    code: [
        { required: true, message: '请输入验证码' },
    ],
}
const router = useRouter()
const app = useAppStore();
async function handleSubmit() {
    // 验证表单
    if (!form.value.newemail) {
        message.error('请输入新邮箱地址');
        return false;
    }

    if (!form.value.code) {
        message.error('请输入验证码');
        return false;
    }

    try {
        // 调用更新邮箱API
        const result = await updateEmailAPI({
            newemail: form.value.newemail,
            code: form.value.code
        });
        if (result.code === 0) {
            app.loginOut();
            message.success('邮箱修改成功，请重新登录！');
            router.replace("/")
            show.value = false;
        }

        // 重置表单
        form.value = {
            newemail: '',
            code: ''
        };
        isCountingDown.value = false;
        countdown.value = 0;
        pause();

        return true;
    } catch (error: any) {
        message.error(error.message || '邮箱修改失败，请重试');
        return false;
    }
}

async function handleSendCode() {
    if (!form.value.newemail) {
        message.error('请先输入新邮箱地址');
        return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.newemail)) {
        message.error('请输入正确的邮箱格式');
        return;
    }

    try {
        // 调用API发送验证码
        await getUpdateUserEmailCode(form.value.newemail);

        message.success('验证码已发送至您的新邮箱');

        // 开始倒计时
        countdown.value = 60;
        isCountingDown.value = true;
        resume();
    } catch (error: any) {
        message.error(error.message || '发送验证码失败，请重试');
    }
}
</script>
<style scoped lang="less"></style>