<template>
    <div class="user-card p-6 flex flex-col ">
        <div class="flex items-center title mb-3">
            <img class="mr-2" src="../images/userBio.svg" alt="" width="16" height="16">
            个人介绍
        </div>
        <p class="content">{{ user.bio || "这个人什么都没写哦" }}</p>
    </div>
</template>
<script setup lang="ts">
import { followUserApi, getUser, unfollowUserApi } from '@/api/user';

// import Tag from '@/components/tag.vue'
const { user } = defineProps<{ user: User }>()

</script>
<style scoped lang="less">
.user-card {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;

    border-radius: 8px;
    min-width: 280px;
}

.title {
    color: #111827;
    font-size: 16px;
    font-weight: 400
}

.content {
    color: #4B5563;
    font-size: 14px;
    font-weight: 400;

}
</style>