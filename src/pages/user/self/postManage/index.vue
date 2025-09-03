<template>
    <div class="flex flex-col w-100% ml-3 mr-3">
        <h2 class="top-container p-6">帖子管理({{ user.postCount }})</h2>
        <div class="top-container p-6 mb-3 mt-3 flex-1">
            <n-tabs v-model:value="tab" type="line">
                <n-tab-pane name="all" tab="全部帖子">
                    <div class="flex flex-col">
                        <RecentlyRelease :user="user" />
                    </div>
                </n-tab-pane>
                <n-tab-pane name="draft" tab="草稿箱">
                    <div class="flex h-40">
                        <n-empty description="尚未开发" class="m-auto" />
                    </div>
                </n-tab-pane>
            </n-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import RecentlyRelease from './recentlyRelease.vue'
const { user } = defineProps<{
    user: User
}>();
const tab = ref("all")
</script>
<style scoped lang="less">
.top-container {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;

}
</style>
