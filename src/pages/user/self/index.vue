<template>
    <Container>
        <div class="flex">
            <div>
                <UserCard :user="user" v-if="user" />
                
            </div>
        </div>
    </Container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import UserCard from './userCard.vue'
const app = useAppStore()
const user = computed(() => app.userInfo)
</script>