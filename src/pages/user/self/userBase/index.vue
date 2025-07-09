<template>
    <div class="w-0 flex-1 flex flex-col pl-3 pr-3">
        <UserBase />
        <UserStatistics class="mt-4" :user="user" v-if="user" />
        <RecentlyRelease class="mt-4" :user="user" v-if="user" />
    </div>
</template>
<script setup lang="ts">
const { user } = defineProps<{
    user: User
}>()
import UserBase from './userBase.vue'
import UserStatistics from './userStatistics.vue'
import RecentlyRelease from './recentlyRelease.vue'
</script>