<template>
    <Container background="#FAFAFA">
        <div class="flex p-6 container">
            <div class="flex flex-col ">
                <UserCard :user="user" v-if="user" />
                <userMenu class="mt-4" v-if="user" :user="user" v-model:menuKey="menuKey" />
            </div>
            <keep-alive v-if="user">
                <component :is="comp" :user="user" />
            </keep-alive>
        </div>
    </Container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import UserCard from './userCard.vue'
import userMenu from './userMenu.vue'
import UserBase from './userBase/index.vue'
import PostManage from './postManage/index.vue'
const kv = {
    'user-base': UserBase,
    'post-manage': PostManage,
}
const comp = computed(() => menuKey.value in kv ? kv[menuKey.value as keyof typeof kv] : null)
const app = useAppStore()
const menuKey = ref('user-base')
const user = computed(() => app.userInfo)

</script>

<style scoped lang="scss">
.container {
    max-width: 1280px;
    margin: 0 auto;
}
</style>