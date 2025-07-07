<template>
    <div v-if="user" class="comment flex pt-3 pb-3">
        <n-avatar round :size="36" class="mr-3 flex-shrink-0" :src="user.avatarUrl" />
        <div class="flex flex-col flex-1 min-w-0">
            <div class="user-info mb-2">
                <span class="nickname">{{ user.nickName }}</span>
                <span class="time text-xs text-gray-400 ml-2">{{ formatTime(comment.createdDate) }}</span>
            </div>
            <div class="comment-content mb-3" v-html="DOMPurify.sanitize(comment.content)"></div>
            <n-space size="small">
                <n-button quaternary size="small">
                    <template #icon><n-icon :component="HeartOutline" size="16" /></template>
                    <span class="text-xs">{{ comment.likeCount || 0 }}赞</span>
                </n-button>
                <n-button quaternary size="small">
                    <template #icon><n-icon :component="ChatbubbleOutline" size="16" /></template>
                    <span class="text-xs">回复</span>
                </n-button>
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

const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
}
</script>
<style scoped lang="scss">
.comment {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    .user-info {
        display: flex;
        align-items: center;

        .nickname {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            line-height: 1.4;
        }

        .time {
            font-size: 12px;
            color: #999;
        }
    }

    .comment-content {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        word-wrap: break-word;
        overflow-wrap: break-word;

        :deep(p) {
            margin: 0;
        }

        :deep(a) {
            color: #1890ff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }


}
</style>