<template>
    <div class="comments">
        <h1 class="text-xl font-bold">评论</h1>
        <div class="comment-list">
            <n-input v-model:value="comment" type="textarea" placeholder="写下你的评论" />
        </div>
        <n-popover trigger="hover" display-directive="show">
            <template #trigger>
                <n-button>悬浮</n-button>
            </template>
            <template #default>
                <div ref="emojiParentElement"></div>
            </template>
        </n-popover>
        <div class="flex flex-end">
            <n-button type="primary" @click="handleComment">评论</n-button>
        </div>
        <Comment v-for="[id, comment] in comments" :key="id" :comment="comment" />
    </div>
</template>
<script setup lang="ts">
import Comment from './comment.vue';
import { Picker } from 'emoji-mart'
import emojiData from '@emoji-mart/data'
const emojiElement = new Picker({
    data: emojiData,
    onEmojiSelect(value: any) {
        comment.value = comment.value + value.native
    }
})
const emojiParentElement = ref<HTMLDivElement>();
watch(emojiParentElement, (newVal) => {
    if (newVal) {
        emojiParentElement.value?.append(emojiElement as unknown as HTMLDivElement)
    }
}, {
    once: true
})

const comment = ref("");
const { comments } = defineProps<{
    comments: Map<PostComment["id"], PostComment>;
}>()
function handleComment() {
    console.log(comment.value)
}
</script>
<style scoped lang="scss"></style>