<template>
    <div class="mug-container">
        <header class="mug-header flex items-center">
            <Logo class="mr-auto" />
            <Search class="mr-auto" />
            <User />
        </header>
    </div>
</template>

<script setup lang="ts">
import Search from '@/layouts/search.vue';
import User from './user.vue';
import Logo from './logo.vue';

</script>

<style lang="scss" scoped>
.mug-container {
    width: 100%;
    border-bottom: 1px solid #F3F4F6;

    .mug-header {
        // width: var(--min-width);
        margin: 0 auto;
        height: var(--mug-header-height);
        padding: 0 16px;
        display: flex;
    }
}
</style>