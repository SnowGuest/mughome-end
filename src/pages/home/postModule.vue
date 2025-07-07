<template>
    <n-tabs type="segment" animated @update:value="handleCheck" class="w-50 mt-4">
        <n-tab-pane name="createdData" tab="最新"></n-tab-pane>
        <n-tab-pane name="likeCount" tab="热门"></n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { type PostsParams } from '@/api/post';
const emit = defineEmits<{
    (e: 'check', value: PostsParams["sortField"]): void
}>()
function handleCheck(value: PostsParams["sortField"]) {
    emit('check', value)
}
</script>

<style scoped lang="scss"></style>