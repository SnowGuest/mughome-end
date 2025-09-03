<template>
  <div class="post-footer flex items-center">
    <n-space align="center">
      <n-button quaternary :loading="likeLoading" @click.stop="postLike">
        <template #icon><n-icon :component="post.relations?.isLiked ? Heart : HeartOutline" size="18" :color="post.relations?.isLiked ? 'red' : ''" /></template>
        <span class="text-sm">{{ post.likeCount }}赞</span>
      </n-button>
      <n-button quaternary>
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
import { HeartOutline, ChatbubbleOutline, ShareSocialOutline, BookmarkOutline, Heart } from '@vicons/ionicons5'
import { postLikeAPI } from '@/api/post';


const { post } = defineProps<{
  post: Post
}>()
const message = useMessage()
const likeLoading = ref(false)
const postLike = async () => {
  try {
    likeLoading.value = true
    const result = await postLikeAPI(post.id, post.relations?.isLiked)
    if (result.code === 0) {
      if (post.relations?.isLiked) {
        message.success("取消点赞")
        post.likeCount--
        post.relations.isLiked = false
      } else {
        message.success("点赞成功")
        post.likeCount++
        post.relations.isLiked = true
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
.post-footer {
  margin-top: 8px;
}
</style>
