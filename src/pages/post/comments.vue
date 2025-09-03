<template>
    <div class="comments">
        <h1 class="text-xl font-bold">评论</h1>
        <Teleport to="#comment-list" :disabled="!showFooterComment" defer>
            <div class="flex flex-col  pl-2 pr-2 " :class="{ 'comment-sticky': showFooterComment }">
                <n-popover trigger="hover" display-directive="show">
                    <template #trigger>
                        <n-button quaternary class="mb-1 mr-auto">😊</n-button>
                    </template>
                    <template #default>
                        <div ref="emojiParentElement"></div>
                    </template>
                </n-popover>
                <div class="comment-list">
                    <n-input :loading="loading" :disabled="loading" v-model:value="comment" type="textarea"
                        placeholder="写下你的评论" @keyup.enter="handleComment">
                        <template #prefix v-if="reBackComment && reBackCommentUser">
                            <n-tag :disabled="loading" type="primary" size="small" closable
                                @close="reBackComment = undefined" class="ml-1">回复: {{ reBackCommentUser.name }}</n-tag>
                        </template>
                    </n-input>
                </div>
                <div class="flex flex-end mt-3 mb-3 ml-auto">
                    <n-button :loading="loading" :disabled="loading" class="w-60" type="primary"
                        @click="handleComment">评论</n-button>
                </div>
            </div>
        </teleport>
        <div class="h-1" ref="commentStickyElement"></div>
        <div class="pl-2 pr-2 flex flex-col" id="comment-list">
            <template v-for="[id, comment] in comments" :key="id">
                <Comment :comment="comment" v-if="!comment.isHidden" :comments="comments" />
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import Comment from './comment.vue';
import { Picker } from 'emoji-mart'
import emojiData from '@emoji-mart/data'
import { useUsers } from '@/stores/user';
import { postComment } from '@/api/post';
const user = useUsers();

const { comments, post } = defineProps<{
    comments: Map<PostComment["id"], PostComment>;
    post: Post
}>();
const emojiElement = new Picker({
    data: emojiData,
    onEmojiSelect(value: any) {
        comment.value = comment.value + value.native
    }
})
const showFooterComment = ref(false)
const emojiParentElement = ref<HTMLDivElement>();
watch(emojiParentElement, (newVal) => {
    if (newVal) {
        emojiParentElement.value?.append(emojiElement as unknown as HTMLDivElement)
    }
}, {
    once: true
})

const comment = ref<string>("");
const message = useMessage();
const loading = ref(false);
const emit = defineEmits<{
    (e: "commentSuccess", comment: PostComment, topCommentId?: PostComment["id"]): void
}>();
const userStore = useUsers();
async function handleComment() {
    try {
        loading.value = true
        const result = await postComment(post.id, comment.value, reBackComment.value?.id)
        if (result.code === 0) {
            message.success("评论成功")
            comment.value = ""
            userStore.setUsers(result.data.includes.users)
            emit("commentSuccess", result.data.comment, reBackComment.value?.id)
            reBackComment.value = undefined
        }
    } catch (e) {
        console.log(e)
    } finally {
        loading.value = false
    }
}
const commentStickyElement = ref<HTMLDivElement>()
let observer: IntersectionObserver;
function sticky() {
    observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        showFooterComment.value = entry.intersectionRatio < 1

    }, { threshold: [1] });
    observer.observe(commentStickyElement.value!);
}
onMounted(() => {
    if (commentStickyElement.value) {
        sticky();
    }
})

const reBackComment = ref<PostComment>()
const reBackCommentUser = computed(() => {
    return reBackComment.value ? user.getUser(reBackComment.value.createdUserId) : null
})
provide("comment-list", {
    rebackComment: (comment: PostComment) => {
        reBackComment.value = comment
    }
})
</script>
<style scoped lang="less">
.comment-sticky {
    position: sticky;
    bottom: 0;
    background-color: #ffffff;
    z-index: 10;
    box-shadow: -4px 0 12px -6px rgba(0, 0, 0, 0.08);
}
</style>