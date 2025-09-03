<template>
    <n-space class="pt-2">
        <n-tag v-for="tag in categories" :key="tag.id" size="small" :bordered="false" class="mr-2 mb-2">{{ tag.name
        }}</n-tag>
    </n-space>

</template>
<script setup lang="ts">
import { useCategories } from '@/stores/categories';
const categoriesStore = useCategories();
const { post } = defineProps<{
    post: Post
}>()
const categories = computed(() => {
    return post.relations.categoryIds.map(e => categoriesStore.getCategorie(e)).filter(e => e !== undefined && e !== null)
})
</script>
<style scoped lang="less"></style>