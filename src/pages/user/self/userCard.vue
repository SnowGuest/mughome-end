<template>
    <div class="user-card p-6 flex flex-col items-center justify-center">
        <n-avatar round size="small" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
        <h3 class="mb-1 mt-4 nickName">{{ user.nickName }}</h3>
        <Tag>LV.5</Tag>
        <p class="mb-4 mt-2 activeDay">已活跃1天</p>
        <p class="desu">{{ user.bio }}</p>
    </div>
</template>
<script setup lang="ts">
import Tag from '@/components/tag.vue'
const { user } = defineProps<{ user: User }>()
</script>
<style scoped lang="scss">
.user-card {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
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