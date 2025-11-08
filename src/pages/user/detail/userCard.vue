<template>
    <div class="user-card p-6 flex flex-col items-center justify-center">
        <n-avatar round size="large" :src="user.avatarUrl" />
        <h3 class="mb-1 mt-4 nickName">{{ user.nickName }}</h3>
        <!-- <Tag>LV.5</Tag> -->
        <p class="mb-4 mt-2 activeDay">已连续签到{{ user.continuousPunchCount }}天</p>
        <p class="desu mb-4">{{ user.bio }}</p>
        <n-button block type="primary" v-if="!(user.relations?.isSubscribed)" @click="handleFollow(true)">关注</n-button>
        <n-button block v-else @click="handleFollow(false)">取消关注</n-button>
    </div>
</template>
<script setup lang="ts">
import { followUserApi, getUser, unfollowUserApi } from '@/api/user';

// import Tag from '@/components/tag.vue'
const user = defineModel<User>("user", { required: true })
const handleFollow = async (isFollow: boolean) => {
    console.log('关注')
    if (isFollow) {
        await followUserApi(user.value.id)
    } else {
        await unfollowUserApi(user.value.id)
    }
    const result = await getUser(user.value.id);
    if (result) {
        user.value = result.data
    }
}
</script>
<style scoped lang="less">
.user-card {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;

    border-radius: 8px;
    min-width: 280px;
}

.nickName {
    color: #000000;
    font-size: 18px;
    font-weight: 700;
}

.desu {
    color: #4B5563;
    font-size: 14px;
    font-weight: 400;
}

.activeDay {
    color: #6B7280;
    font-size: 14px;
    font-weight: 400;
}
</style>