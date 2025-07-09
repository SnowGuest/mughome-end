<template>
    <div class="post-container">
        <div class="flex  items-center">
            <h3 class="title font-bold mr-auto" @click="handleClick">{{ post.title }}</h3>
            <n-button quaternary>
                <template #icon><n-icon :component="Edit" size="18" /></template>
            </n-button>
            <n-button quaternary @click="deletePost">
                <template #icon><n-icon :component="Delete" size="18" /></template>
            </n-button>
        </div>
        <Tag :post="post" />
        <n-space align="center">
            <span class="text-xs"> {{ post.createdDate }}</span>
            <n-button quaternary>
                <template #icon><n-icon :component="HeartOutline" size="18" /></template>
                <span class="text-sm">{{ post.likeCount }}赞</span>
            </n-button>
            <n-button quaternary>
                <template #icon><n-icon :component="ChatbubbleOutline" size="16" /></template>
                <span class="text-sm">
                    {{ post.commentCount }}评论
                </span>
            </n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { HeartOutline, ChatbubbleOutline, ShareSocialOutline, BookmarkOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router';
import { Delete, Edit } from '@vicons/carbon'
const { post } = defineProps<{
    post: Post
}>();
const router = useRouter()
async function handleClick() {
    await router.push(`/post/${post.id}`)
}
const dialog = useDialog()
function deletePost() {
    dialog.error({
        title: '警告',
        content: '你确定要删除该帖子吗？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        async onPositiveClick() {
            // await deletePost()
        },
    })
}
</script>
<style scoped lang="scss">
.post-container {
    border-bottom: 1px solid #F3F4F6;
    // margin-top: 16px;
    padding-bottom: 6px;
    margin-top: 6px;

    &:last-child {
        border-bottom: none;
    }
}

.title {
    transition: color 0.12s;
    cursor: pointer;

    &:hover {
        color: var(--primary-color-hover);
    }
}
</style>