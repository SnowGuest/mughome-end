<template>
  <div class="post-body">
    <div v-html="content" class="content-html"></div>
    <div v-if="images && images.length" class="image-grid">
      <n-image
        v-for="(image, index) in images"
        :key="index"
        :src="image.src"
        :alt="image.alt || 'post image'"
        class="post-image"
        object-fit="cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage } from 'naive-ui'

interface Image {
  src: string
  alt?: string
}

defineProps({
  content: {
    type: String,
    required: true,
    default: '',
  },
  images: {
    type: Array as () => Image[],
    default: () => [],
  },
})
</script>

<style scoped lang="less">
.post-body {
  padding: 16px;
  background-color: #fff;
}

.content-html {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
  white-space: pre-wrap; // 保留换行和空格

  :deep(p) {
    margin-bottom: 1em;
  }
  :deep(h1, h2, h3, h4, h5, h6) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }
  :deep(ul, ol) {
    margin-left: 20px;
    margin-bottom: 1em;
  }
  :deep(li) {
    margin-bottom: 0.5em;
  }
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.post-image {
  width: 100%;
  height: auto;
  max-height: 300px; // 限制图片最大高度
  border-radius: 8px;
  overflow: hidden; // 确保圆角生效
}
</style> 