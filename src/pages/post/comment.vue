<template>
    <div v-if="user" class="comment pt-3 pb-3">
        <n-avatar round :size="36" class="mr-3 flex-shrink-0" style="grid-area: avatar;" :src="user.avatarUrl" />
        <div class="flex flex-col flex-1 min-w-0" style="grid-area: content;">
            <div class="user-info mb-2">
                <span class="nickname">{{ user.nickName }}</span>
                <span class="time text-xs text-gray-400 ml-2">{{ formatTime(comment.createdDate) }}</span>
            </div>
            <n-performant-ellipsis class="desu" line-clamp="12" :tooltip="false" expand-trigger="click">
                <div class="comment-content mb-1" v-html="DOMPurify.sanitize(comment.content)"></div>
            </n-performant-ellipsis>
            <n-space size="small">
                <n-button quaternary :loading="likeLoading" size="small" @click="likeComment">
                    <template #icon><n-icon :component="comment.relations?.isLiked ? Heart : HeartOutline" size="16"
                            :color="comment.relations?.isLiked ? 'red' : ''" /></template>
                    <span class="text-xs">{{ comment.likeCount || 0 }}赞</span>
                </n-button>
                <n-button quaternary size="small" @click="rebackComment">
                    <template #icon><n-icon :component="ChatbubbleOutline" size="16" /></template>
                    <span class="text-xs">回复</span>
                </n-button>
            </n-space>
        </div>
        <div :style="{ gridArea: 'sub-comment' }" v-if="comment.relations?.subCommentIds">
            <SubComment v-for="comment in subComments" :key="comment.id" :comment="comment" :commentsMap="comments" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUsers } from '@/stores/user';
import { computed } from "vue"
import DOMPurify from 'dompurify';
import { HeartOutline, ChatbubbleOutline, Heart } from '@vicons/ionicons5'
import dayjs from 'dayjs'
import SubComment from './subComment.vue';
import { postCommentLike } from '@/api/post';
const { comment, comments } = defineProps<{
    comment: PostComment;
    comments: Map<PostComment["id"], PostComment>
}>();

const subComments = computed(() => {
    return comment.relations?.subCommentIds?.map(id => comments.get(id)).filter(e => e) as PostComment[];
})
const userStore = useUsers()
const user = computed<User | undefined>(e => userStore.getUser(comment.createdUserId))

const formatTime = (timestamp: string | number) => {
    return dayjs(timestamp).fromNow();
}
const commentList = inject<{
    rebackComment: (comment: PostComment) => void
}>("comment-list");
const rebackComment = () => {
    console.log(commentList, '???')
    commentList?.rebackComment(comment)
}
const likeLoading = ref(false)
const message = useMessage()
const likeComment = async () => {
    try {
        likeLoading.value = true
        if (!comment.relations) comment.relations = { isLiked: false }
        const result = await postCommentLike(comment.id, comment.relations.isLiked);
        if (result.code === 0) {
            if (comment.relations.isLiked) {
                comment.relations.isLiked = false
                message.success("取消点赞")
                comment.likeCount--
            } else {
                comment.relations.isLiked = true
                message.success("点赞成功")
                comment.likeCount++
            }
        }
    } catch (error) {
        console.error(error)
    } finally {
        likeLoading.value = false
    }
}
</script>
<style scoped lang="less">
.comment {
    border-bottom: 1px solid #f0f0f0;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "avatar content"
        "avatar sub-comment";

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