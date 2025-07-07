<template>
    <div v-if="user" class="comment flex">
        <n-avatar round :size="30" class="mr-4" :src="user.avatarUrl" />
        <div class="flex flex-col">
            <span>{{ user.nickName }}</span>
            <div>{{ DOMPurify.sanitize(comment.content) }}</div>
            <n-space>
                <n-button text>
                    <template #icon><n-icon :component="HeartOutline" size="18" /></template>
                    <span class="text-sm">{{ comment.likeCount }}赞</span>
                </n-button>
                <n-button text>回复</n-button>
            </n-space>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUsers } from '@/stores/user';
import { computed } from "vue"
import DOMPurify from 'dompurify';
import { HeartOutline, ChatbubbleOutline, ShareSocialOutline, BookmarkOutline } from '@vicons/ionicons5'

const { comment } = defineProps<{
    comment: PostComment;
}>();
const userStore = useUsers()
const user = computed<User | undefined>(e => userStore.getUser(comment.createdUserId)) 
</script>
<style scoped lang="scss">
.comment {}
</style>