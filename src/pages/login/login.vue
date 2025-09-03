<template>
    <n-form size="large" ref="formRef" :model="formValue" :rules="rules" :disabled="loading">
        <n-form-item label="账号" path="account">
            <n-input v-model:value="formValue.account" placeholder="请输入账号" :input-props="{
                autocomplete: 'username'
            }">
                <template #prefix>
                    <img src="./images/account.png" width="20" height="20" />
                </template>
            </n-input>
        </n-form-item>
        <n-form-item label="密码" path="password">
            <n-input type="password" v-model:value="formValue.password" placeholder="请输入密码" :input-props="{
                autocomplete: 'password'
            }" show-password-on="click">
                <template #prefix>
                    <img src="./images/password.png" width="20" height="20" />
                </template>
            </n-input>
        </n-form-item>

        <div class=" flex justify-end items-center">

            <n-button quaternary type="primary" @click="toForgetPasswordPage">
                忘记密码？
            </n-button>
        </div>

        <n-form-item>
            <n-button type="primary" block :loading="loading" @click="handleLogin">
                登录
            </n-button>
        </n-form-item>
        <div class="flex justify-center items-center">
            还没有账号？
            <n-button quaternary type="primary" @click="handleRegister">
                立即注册
            </n-button>
        </div>
    </n-form>
</template>
<script setup lang="ts">
import { login } from '@/api/account';
import { useAppStore } from '@/stores/app';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(false)
const rules = {
    account: {
        required: true,
        message: '请输入账号',
        trigger: ['blur', 'input']
    },
    password: {
        required: true,
        message: '请输入密码',
        trigger: ['blur', 'input'],
    }
}
const formValue = ref({
    account: "",
    password: "",
});
function toForgetPasswordPage(){
    router.push('/forget-password');
}
const router = useRouter();
const app = useAppStore();
async function handleLogin() {
    try {
        loading.value = true;
        const result = await login(formValue.value);
        if (result.code === 0) {
            router.replace("/");
        }
    } finally {
        loading.value = false
    }

}
async function handleRegister() {
    router.push('/register');
}
</script>

<style scoped lang="less"></style>
