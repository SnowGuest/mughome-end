<template>
    <Container background="#fff">
        <div class="flex flex-col p-6 container">
            <h2 class="title mb-6">发布新帖子</h2>
            <n-form ref="formRef" label-placement="top" :model="formValue" :rules="rules" size="large">
                <n-form-item label="帖子标题" path="title">
                    <n-input v-model:value="formValue.title" placeholder="请输入帖子标题" maxlength="50" show-count />
                </n-form-item>
                <n-form-item label="选择分区" path="categoryId">
                </n-form-item>
                <n-form-item label="关联标签" path="tagIds">
                    <n-input v-model:value="inputTag" placeholder="添加标签，按回车确认" maxlength="5" show-count />
                </n-form-item>
                <n-form-item label="封面图片" path="cover">
                    <n-upload directory-dnd @error="handleError" @finish="handleFinish" :max="1" :action
                        :default-file-list="headerImage">
                        <n-upload-dragger>

                            <div style="margin-bottom: 12px">
                                <n-icon size="48" :depth="3">
                                    <ArchiveIcon />
                                </n-icon>
                            </div>
                            <n-text style="font-size: 16px">
                                点击或者拖动文件到该区域来上传
                            </n-text>
                        </n-upload-dragger>
                    </n-upload>
                </n-form-item>
                <n-form-item label="帖子内容" path="content">
                    <MdEditor v-model="formValue.content" :toolbars-exclude="['save', 'github']"
                        @onUploadImg="onUploadImg" />
                </n-form-item>
                <n-form-item label="帖子简介" path="description">
                    <n-input type="textarea" v-model:value="formValue.description" placeholder="请输入帖子简介" maxlength="100"
                        show-count />
                </n-form-item>
                <n-form-item>
                    <div class="flex items-center w-full">
                        <n-button class="w-20 mr-4" @click="handleSave">草稿箱</n-button>
                        <n-button class="w-20" @click="handlePreview">预览</n-button>
                        <n-button class="w-40 ml-auto" type="primary" @click="handlePublish">
                            发布
                        </n-button>
                    </div>
                </n-form-item>

            </n-form>
        </div>
    </Container>
</template>

<script setup lang="ts">
import type { FormInst, UploadFileInfo } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { uploaderFile } from '@/api/file';

const formRef = ref<FormInst>();
const inputTag = ref('');
const headerImage = computed<UploadFileInfo[]>(() => []);
const formValue = ref({
    title: '',
    categoryId: '',
    tagIds: [],
    cover: '',
    content: '',
    description: ''
});
const action = computed(() => {
    return `${import.meta.env.VITE_REQUEST_BASE_URL}upload/file`
});
const message = useMessage()
const handleError = () => {
    message.error("上传头像文件失败请重试")
}
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
    console.log(file)
}
const onUploadImg = async (files: File[], callback: (url: string[]) => void) => {
    console.log("触发", files)
    const res = await Promise.all(
        files.map((file) => {
            console.log(file)
            return uploaderFile(file)
        })
    );
    callback(res.map((item) => item.data.UploadFileUrl));
}
const rules = {
    title: {
        required: true,
        message: '请输入帖子标题'
    }
}
const handleSave = () => {
    console.log("草稿箱")
}
const handlePreview = () => {
    console.log("预览")
}
const handlePublish = () => {
    console.log("发布")
}
</script>

<style scoped lang="less">
.container {
    max-width: 1280px;
    margin: 0 auto;
}

.title {
    color: #212121;
    font-size: 24px;
    font-weight: 700;
}
</style>