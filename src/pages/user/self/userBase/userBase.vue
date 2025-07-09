<template>
    <div class="user-base p-6">
        <h2 class="mb-3">基本信息</h2>
        <n-form label-placement="left" label-width="80">
            <n-form-item label="头像">
                <n-upload @error="handleError" @finish="handleFinish" :max="1" :action :default-file-list="avatarList"
                    list-type="image-card">
                </n-upload>
            </n-form-item>
            <n-form-item label="用户名">
                <n-input></n-input>
            </n-form-item>
            <n-form-item label="个性签名">
                <n-input type="textarea"></n-input>
            </n-form-item>
        </n-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import type { UploadFileInfo } from 'naive-ui'
import { storeToRefs } from 'pinia'
const { userInfo } = storeToRefs(useAppStore())
const avatarList = computed<UploadFileInfo[]>(() => userInfo.value ? [{
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
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
    console.log(file)
}
</script>

<style scoped lang="scss">
.user-base {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;

}
</style>