<template>
    <div class="user-base p-6">
        <h2 class="mb-3">基本信息</h2>
        <n-form ref="formInst" label-placement="left" label-width="80" :model="form">
            <n-form-item label="头像">
                <n-upload method="put" name="avatar" @error="handleError" @finish="handleFinish" :max="1" :action
                    :default-file-list="avatarList" list-type="image-card"
                    :headers="{ Authorization: `Bearer ${token?.value}` }">
                </n-upload>
            </n-form-item>
            <n-form-item label="用户名" path="nickName">
                <n-input @blur="() => save('nickName')" v-model:value="form.nickName" maxlength="10" show-count />
            </n-form-item>
            <n-form-item label="个性签名" path="bio">
                <n-input @blur="() => save('bio')" type="textarea" v-model:value="form.bio" maxlength="200"
                    show-count />
            </n-form-item>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { FormInst, UploadFileInfo, UploadOnFinish } from 'naive-ui'
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
    return `${import.meta.env.VITE_REQUEST_BASE_URL}account/${userInfo.value?.id}`
})
const appStore = useAppStore()
const formInst = ref<FormInst>();
const message = useMessage()
const handleError = () => {
    message.error("上传头像文件失败请重试")
}
const handleFinish = ({
    file,
    event
}: {
    file: UploadFileInfo
    event?: ProgressEvent
}) => {
    if (!event) return
    let res = (event.target as XMLHttpRequest).response as InstanceBody<{ user: User, token: Token }>
    if (typeof res === "string") res = JSON.parse(res);
    message.success("上传头像成功")
    file.url = res.data.user.avatarUrl
    appStore.userInfo = res.data.user;
    appStore.token = res.data.token;

    return file
}
const form = reactive<UpdateUserInfoReqBody>({
    nickName: userInfo.value?.nickName || '',
    bio: userInfo.value?.bio || ''
})
async function save(key: keyof UpdateUserInfoReqBody) {
    await formInst.value?.validate(undefined, rule => rule.key === key)
    message.success("保存成功")
    const fetchReq: UpdateUserInfoReqBody = {
        [key]: form[key]
    }
    await updateUserInfo(fetchReq);
    if (userInfo.value) {
        if (key === 'nickName' && form[key]) {
            userInfo.value.nickName = form[key] // 同步更新 username 字段
        }
        if (key === 'bio' && form[key]) {
            userInfo.value.bio = form[key] // 同步更新 bio 字段
        }
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