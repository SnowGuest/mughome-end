<template>
  <div class="post-footer flex items-center">
    <n-space align="center">
      <n-button text>
        <template #icon><n-icon :component="HeartOutline" size="18" /></template>
        <span class="text-sm">{{ post.likeCount }}赞</span>
      </n-button>
      <n-button text>
        <template #icon><n-icon :component="ChatbubbleOutline" size="16" /></template>
        <span class="text-sm">
          {{ post.commentCount }}评论
        </span>
      </n-button>
    </n-space>
    <span class="ml-auto text-xs">发布于 {{ post.createdDate }}</span>
  </div>
</template>

<script setup lang="ts">
import { NTag, NButton, NIcon } from 'naive-ui'
import { HeartOutline, ChatbubbleOutline, ShareSocialOutline, BookmarkOutline } from '@vicons/ionicons5'


const { post } = defineProps<{
  post: Post
}>()

</script>

<style scoped lang="scss">
.post-footer {
  margin-top: 8px;
}
</style>
