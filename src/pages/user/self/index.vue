<template>
    <Container background="#FAFAFA">
        <div class="flex p-6 container">
            <div class="flex flex-col">
                <UserCard :user="user" v-if="user" />
                <userMenu class="mt-4" v-if="user" :user="user" />
            </div>
            <div class="w-0 flex-1 flex flex-col ml-8">
                <UserBase />
                <UserStatistics class="mt-4" />
            </div>
        </div>
    </Container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import UserCard from './userCard.vue'
import userMenu from './userMenu.vue'
import UserBase from './userBase.vue'
import UserStatistics from './userStatistics.vue'
const app = useAppStore()
const user = computed(() => app.userInfo)
</script>

<style scoped lang="scss">
.container {
    max-width: 1280px;
    margin: 0 auto;
}
</style>