<template>
    <n-scrollbar class="flex-1 scroll" :style="{ background }">
        <slot />
    </n-scrollbar>
</template>
<script setup lang="ts">
const { background } = defineProps<{ background?: string }>()
</script>
<style scoped lang="scss">
.scroll {
    height: var(--page-view-height);
}
</style>
