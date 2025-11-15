<template>
    <Container background="#fff">
        <div class="flex flex-col p-6 container">
            <h2 class="title mb-6">发布新帖子</h2>
            <n-form ref="formRef" label-placement="top" :model="formValue" :rules="rules" size="large">
                <n-form-item label="帖子标题" path="title">
                    <n-input v-model:value="formValue.title" placeholder="请输入帖子标题" maxlength="50" show-count />
                </n-form-item>
                <n-form-item label="选择分区 (请选择子级)" path="categoryId">
                    <n-spin :show="loadingCategories">
                        <n-cascader placeholder="请选择所属子分区" :options="categories" v-model:value="formValue.categoryId"
                            check-strategy="child" clearable filterable show-path label-field="name" value-field="id" />
                    </n-spin>
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
import { getCategories } from '@/api/categorie';
import { setPost, type setPostParams } from '@/api/post';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const formRef = ref<FormInst>();
const headerImage = computed<UploadFileInfo[]>(() => []);

// 从路由获取分区 ID 作为默认值
const initialCategoryId = route.query.categorieId 
    ? Number(route.query.categorieId) 
    : "";

const formValue = ref({
    description: "",
    cover: "",
    title: '',
    categoryId: initialCategoryId,
    content: '',
});

// 发布加载状态
const publishing = ref(false)

// 分类列表（包含子分类）
const categories = ref<Categorie[]>([])
const loadingCategories = ref(false)




const fetchCategories = async () => {
    try {
        loadingCategories.value = true
        const res = await getCategories()
        // 原始数据可能包含没有子级的父类，保留全部，过滤交给 cascaderOptions
        categories.value = res.data.categories
    } catch (e) {
        message.error('获取分区失败')
    } finally {
        loadingCategories.value = false
    }
}

onMounted(fetchCategories)
const action = computed(() => {
    return `${import.meta.env.VITE_REQUEST_BASE_URL}upload/file`
});
const message = useMessage()
const handleError = () => {
    message.error("上传头像文件失败请重试")
}
const handleFinish = ({ file }: { file: UploadFileInfo }) => {
    // 依据 naive upload 返回结构提取 url
    const resp = (file as any).response
    const url = (file.url as string) || resp?.data?.UploadFileUrl || ''
    if (url) formValue.value.cover = url
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
    },
    categoryId: {
        required: true,
        message: '请选择分区'
    }
}
const router = useRouter();
const handleSave = () => {
    console.log("草稿箱")
}
const handlePreview = () => {
    console.log("预览")
}
const handlePublish = async () => {
    if (publishing.value) return
    // 基础校验
    if (!formValue.value.title.trim()) {
        message.error('请输入帖子标题')
        return
    }
    if (!formValue.value.content.trim()) {
        message.error('请输入帖子内容')
        return
    }
    if (!formValue.value.categoryId) {
        message.error('请选择分区')
        return
    }

    // 表单规则校验（可选）
    const validateErr = await new Promise<boolean>((resolve) => {
        formRef.value?.validate?.((errors) => {
            resolve(!!errors)
        })
    })
    if (validateErr) return

    const payload = {
        title: formValue.value.title.trim(),
        content: formValue.value.content, // 不裁剪 markdown
        categoryId: [] as number[],
        headerImage: formValue.value.cover || undefined
    }
    try {
        const categoryId = formValue.value.categoryId
        publishing.value = true
        if (typeof categoryId === "number") {
            const categorie = categories.value.find(c => {
                console.log(`${c.id}`, categoryId)
                if (c.id === categoryId) {
                    return true
                } else {
                    return Boolean(c.children?.find(sub => sub.id === categoryId))
                }
            })
            console.log(categorie)
            if (!categorie) return
            if (categorie.id === categoryId) {
                payload.categoryId = [categorie.id]
            } else {
                const subCategorie = categorie?.children?.find(sub => sub.id === categoryId)
                if (subCategorie) {
                    payload.categoryId = [categorie?.id, subCategorie.id]
                }
            }
        }
        const res = await setPost(payload)
        message.success('发布成功,即将跳转帖子详情')
        // 发布后可根据需要跳转帖子详情
        setTimeout(() => {
            router.push(`/post/${res.data.post.id}`)
        }, 1000)
        // 清理表单
        formValue.value.title = ''
        formValue.value.content = ''
        formValue.value.categoryId = ""
        formValue.value.cover = ''
        formValue.value.description = ''
    } catch (e: any) {
        message.error(e?.message || '发布失败')
    } finally {
        publishing.value = false
    }
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