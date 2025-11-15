<template>
    <div v-if="loading">
        <n-skeleton text style="width: 50%" />
        <n-skeleton text style="width: 60%" />
        <n-skeleton text :repeat="3" />
        <n-skeleton text style="width: 60%" />
    </div>
    <Post v-for="[id, post] in postlist" :key="id" :post="post" :user="userStore.getUser(post.createdUserId)"
        editPost />
    
    <!-- 空状态 -->
    <n-empty v-if="!loading && postlist.size === 0" 
      description="暂无帖子" 
      class="empty-state" />
    
    <n-pagination v-if="total > 0" show-size-picker :page-sizes="[10, 20, 30, 40]" v-model:page="page" v-model:page-size="pageSize"
        :item-count="total" class="ml-auto mr-auto mt-4" @update-page="init" />
</template>
<script setup lang="ts">
import Post from '../../components/post.vue';
import { type PostsParams, getPosts } from '@/api/post';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';
const { user } = defineProps<{
    user: User
}>();
const postlist = ref<Map<Post["id"], Post>>(new Map());
const userStore = useUsers();
const categoriesStore = useCategories();
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false);
async function init() {
    try {
        loading.value = true;
        postlist.value.clear();
        const result = await getPosts({
            page: page.value,
            pageSize: pageSize.value,
            postUserId: user.id,
            sortField: "createdDate",
            sortType: "desc"
        });
        userStore.setUsers(result.data.includes.users)
        categoriesStore.setCategories(result.data.includes.categories)
        result.data.post.forEach(post => {
            postlist.value.set(post.id, post)
        })
        console.log(result.data.totalPostCount)
        total.value = result.data.totalPostCount
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false;
    }
}
init()
</script>
<style scoped lang="less">
.release-container {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;
}

.empty-state {
    margin-top: 60px;
    margin-bottom: 60px;
}
</style>