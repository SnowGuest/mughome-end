<template>
    <div class="flex-1 flex flex-col pl-3 pr-3">
        <div class="top-container p-6">
            <h2>账号安全</h2>
            <div class="line">
                <div class="title">登录密码</div>
                <div class="subTitle">用于保护账号信息安全, 请定期修改</div>
                <div class="icon">
                    <img src="../../images/password.svg" alt="">
                </div>
                <div class="control">
                    <n-button ghost @click="showUpdatePassword = true">修改</n-button>
                </div>
            </div>
            <div class="line">
                <div class="title">安全邮箱</div>
                <div class="subTitle">用于验证身份和接受安全通知</div>
                <div class="icon">
                    <img src="../../images/email.svg" alt="">
                </div>
                <div class="control">
                    <n-button text type="success" v-if="user.email">
                        已绑定{{ user.email }}
                    </n-button>
                    <n-button ghost class="ml-2" @click="handleModifyEmail">修改</n-button>
                </div>
            </div>
        </div>
    </div>
    <UpdateEmail v-model:show="showUpdateEmail" :user="user" />
    <UpdatePassword v-model:show="showUpdatePassword" :user="user" />
</template>
<script setup lang="ts">
import UpdateEmail from './updateEmail.vue';
import UpdatePassword from './updatePassword.vue';
const { user } = defineProps<{
    user: User
}>()
const showUpdateEmail = ref(false);
const showUpdatePassword = ref(false);
function handleModifyEmail() {
    showUpdateEmail.value = true;
}
</script>
<style scoped lang="less">
.top-container {
    background-color: #fff;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;
}

.line {
    display: grid;
    grid-template-columns: 56px 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 16px 0;
    grid-template-areas:
        "icon title control"
        "icon subTitle control";
    border-bottom: 1px solid #F3F4F6;

    &:last-child {
        border: none;
    }

    .title {
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        grid-area: title;
    }

    .subTitle {
        color: #6B7280;
        font-size: 14px;
        font-weight: 400;
        grid-area: subTitle;
    }

    .icon {
        grid-area: icon;
        background: rgba(255, 107, 53, 0.10);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .control {
        grid-area: control;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>