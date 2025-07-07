<template>
    <n-scrollbar class="flex-1 scroll">
        <slot />
    </n-scrollbar>
</template>
<style scoped lang="scss">
.scroll {
    height: var(--page-view-height);
}
</style>
