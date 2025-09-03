<template>
    <div class="user-other p-6">
        <PostHeader :user="user" />
        <n-button class="mt-4 mb-4" round block type="primary" v-if="!user.relations?.isSubscribed">关注</n-button>
        <n-button class="mt-4 mb-4" round block type="info" v-else>已关注</n-button>
        <n-space justify="space-between">
            <div>
                <span>{{ user.postCount }}</span>
                <span>帖子</span>
            </div>
            <n-divider vertical />
            <div>
                <span>{{ user.followerCount }}</span>
                <span>粉丝</span>
            </div>

        </n-space>

    </div>
</template>
<script setup lang="ts">
import PostHeader from '@/components/post/postHeader.vue';

const { user } = defineProps<{
    user: User;
}>();

</script>
<style scoped lang="less">
.user-other {
    margin-top: 16px;
    background: #F9FAFB;
    border-radius: 8px;
}
</style>