<template>
    <Container background="#FAFAFA">
        <div class="flex p-6 container">
            <div class="flex flex-col " v-if="user">
                <UserCard v-model:user="user" v-if="user" />
                <UserBio :user="user" class="mt-4" />
            </div>
            <div class="right-container ml-4 flex-1 p-6 flex flex-col">
                <h2 class="title mb-4">全部帖子</h2>
                <UserStatistics class="mb-4" :user="user" v-if="user" />
                <PostList :user="user" v-if="user" />
            </div>
        </div>
    </Container>
</template>

<script setup lang="ts">
import UserCard from './userCard.vue'
import UserBio from './userBio.vue'
import PostList from './postList.vue'
import UserStatistics from './userStatistics.vue'
import { getUser } from '@/api/user';
import { useRoute } from 'vue-router';
const route = useRoute();
const user = ref<User>();
async function init() {
    const result = await getUser(parseInt(route.params.id as string))
    user.value = result.data
}
init()
</script>

<style scoped lang="less">
.container {
    max-width: 1280px;
    margin: 0 auto;
}

.right-container {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;
}
</style>