<template>
    <div class="search-page">
        <div class="container pt-6 pb-6 pl-4 pr-4">
            <n-tabs v-model:value="activeTab" type="line" size="large" animated>
                <n-tab-pane name="posts" tab="帖子">
                    <PostTab :keyword="keyword" />
                </n-tab-pane>
                <n-tab-pane name="users" tab="用户">
                    <div class="user-content">
                        <User :keyword="keyword" />
                    </div>
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import PostTab from './post.vue';
import User from './user.vue';
import { useRoute } from 'vue-router';

const activeTab = ref('posts');
const route = useRoute();
const keyword = computed(() => (route.query.q as string) || '');
</script>

<style scoped lang="scss">
.search-page {
    flex: 1;
    height: 0;
    overflow-y: auto;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
}

.user-content {
    padding: 60px 0;
}
</style>