<template>
    <div class="post-container">
        <div class="flex  items-center">
            <h3 class="title font-bold mr-auto" @click="handleClick">{{ post.title }}</h3>
            <n-button quaternary v-if="editPost">
                <template #icon><n-icon :component="Edit" size="18" /></template>
            </n-button>
            <n-button quaternary @click="deletePost" v-if="editPost">
                <template #icon><n-icon :component="Delete" size="18" /></template>
            </n-button>
        </div>
        <Tag :post="post" />
        <n-space align="center">
            <span class="text-xs"> {{ post.createdDate }}</span>
            <n-button quaternary :loading="likeLoading" @click="handleLike">
                <template #icon><n-icon :color="post.relations.isLiked ? '#ff7846' : ''"
                        :component="post.relations.isLiked ? Heart : HeartOutline" size="18" /></template>
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
import { HeartOutline, Heart, ChatbubbleOutline, ShareSocialOutline, BookmarkOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router';
import { Delete, Edit } from '@vicons/carbon'
import { postLike } from '@/api/post';
const { post, editPost = false } = defineProps<{
    post: Post,
    editPost: boolean
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
const likeLoading = ref(false)
async function handleLike() {
    try {
        console.log("部署？？？")
        likeLoading.value = true
        const cancel = post.relations.isLiked
        const result = await postLike(post.id, cancel);
        if (result.code === 0) {
            post.likeCount = post.likeCount + (cancel ? -1 : 1)
            post.relations.isLiked = !cancel
        }
    } catch (e) {
        console.log(e, '点赞接口出错')
    } finally {
        likeLoading.value = false
    }
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