<template>
  <div class="flex items-center">
    <n-avatar round :size="40" :src="user.avatarUrl" class="mr-3" />
    <div class="flex flex-col">
      <span class="author-name">{{ user.nickName }}</span>
      <span class="author-dscu">{{ user.bio }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar } from 'naive-ui'

const { user } = defineProps<{
  user: User
}>();

</script>

<style scoped lang="scss">
.author-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.author-dscu{
  color: #666;
  font-size: 12px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
