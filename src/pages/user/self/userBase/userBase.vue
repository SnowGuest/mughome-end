<template>
    <div class="user-base p-6">
        <h2 class="mb-3">基本信息</h2>
        <n-form label-placement="left" label-width="80" :model="form">
            <n-form-item label="头像">
                <n-upload @error="handleError" @finish="handleFinish" :max="1" :action :default-file-list="avatarList"
                    list-type="image-card" :headers="{ Authorization: `Bearer ${token?.value}` }">
                </n-upload>
            </n-form-item>
            <n-form-item label="用户名" path="nickname">
                <n-input v-model:value="form.nickname" maxlength="10" show-count />
            </n-form-item>
            <n-form-item label="个性签名" path="bio">
                <n-input type="textarea" v-model:value="form.bio" maxlength="200" show-count />
            </n-form-item>
            <n-button type="primary" @click="save">保存修改</n-button>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { UploadFileInfo } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { updateUserInfo, type UpdateUserInfoReqBody } from '@/api/account'
const { userInfo, token } = storeToRefs(useAppStore())
const avatarList = computed<UploadFileInfo[]>(() => userInfo.value && userInfo.value.avatarUrl ? [{
    id: `${userInfo.value.id}`,
    name: '',
    status: 'finished',
    url: userInfo.value.avatarUrl
}] : []);
const action = computed(() => {
    return `${import.meta.env.VITE_REQUEST_BASE_URL}upload/file`
})
const message = useMessage()
const handleError = () => {
    message.error("上传头像文件失败请重试")
}
const form = reactive<UpdateUserInfoReqBody>({
    avatar: undefined,
    nickname: userInfo.value?.nickName || '',
    bio: userInfo.value?.bio || ''
})
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
    if (file.file) form.avatar = file.file
}
async function save() {
    message.success("保存成功")
    await updateUserInfo(form);
    if (userInfo.value) {
        userInfo.value.nickName = form.nickname || userInfo.value?.nickName
        userInfo.value.bio = form.bio || userInfo.value?.bio
        // if (form.avatar) {
            // 假设头像URL是通过某种方式生成的，这里只是一个示例
            // userInfo.value.avatarUrl = form.avatar
        // }
    }

}
</script>

<style scoped lang="less">
.user-base {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;

}
</style>