<template>
    <n-modal v-model:show="show" :close-on-esc="false" preset="dialog" title="修改邮箱" @positive-click="submitCallback">
        <n-form :model="form" :rules="rules" v-if="checkTab === '1'">
            <n-form-item path="code">
                <div class="flex flex-col w-full">
                    <n-alert type="warning" class="mb-6 ">
                        请先验证您的旧邮箱地址
                    </n-alert>
                    <div class="flex justify-center">
                        <n-input-otp class="ml-auto mr-auto" v-model:value="firstForm.code" />
                        <div class="w-30 flex justify-center items-center">
                            <n-button type="primary" @click="firstActive = true" v-if="!firstActive">
                                发送验证码
                            </n-button>
                            <n-button disabled @click="firstActive = true" v-else>
                                <n-countdown :render="renderCountdown" :duration="1000 * 60" :active="firstActive"
                                    class="ml-2" />
                            </n-button>


                        </div>
                    </div>
                </div>
            </n-form-item>
            <n-button block type="primary" @click="handleSubmit"> 提交</n-button>
        </n-form>
        <n-form :model="form" :rules="rules" v-else-if="checkTab === '2'">
            <n-form-item label="新邮箱地址" path="email">
                <n-input v-model:value="form.email" />
            </n-form-item>
            <n-form-item label="验证码" path="code">
                <n-input-group>
                    <n-input v-model:value="form.code" />
                    <n-button class="w-30" type="primary" @click="handleSendCode" v-if="!active">
                        发送验证码
                    </n-button>
                    <n-button disabled v-else class="w-30" type="primary">
                        <n-countdown :render="renderCountdown" :duration="1000 * 60" :active="active" class="ml-2" />
                    </n-button>
                </n-input-group>
            </n-form-item>
            <n-space justify="end">
                <n-button @click="checkTab = '1'">返回上一步</n-button>
                <n-button block type="primary" @click="handleSubmit">修改邮箱</n-button>
            </n-space>
        </n-form>

    </n-modal>
</template>
<script setup lang="ts">
import type { CountdownTimeInfo, FormRules } from 'naive-ui';

const show = defineModel<boolean>('show');
const { user } = defineProps<{ user: User }>();
const firstForm = ref({
    code: []
})
const firstActive = ref(false);
const active = ref(false);
const form = ref({
    email: '',
    code: '',
    password: '',
})
const checkTab = ref("1")
const rules: FormRules = {
    email: [
        { required: true, message: '请输入邮箱地址' },
        { type: 'email', message: '请输入正确的邮箱地址' },
    ],
}
function submitCallback() {
    console.log('submitCallback');
}
function handleSubmit() {
    checkTab.value = '2'
}
function renderCountdown(props: CountdownTimeInfo) {
    return `请${props.minutes * 60 || props.seconds}秒后重试`;
}
function handleSendCode() {
    active.value = true;
}
</script>
<style scoped lang="scss"></style>