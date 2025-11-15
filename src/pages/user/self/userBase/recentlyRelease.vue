<template>
    <div class="release-container p-6">
        <h2 class="mb-3">最近发布</h2>
        <div v-if="firstLoading">
            <n-skeleton text style="width: 50%" />
            <n-skeleton text style="width: 60%" />
            <n-skeleton text :repeat="3" />
            <n-skeleton text style="width: 60%" />
        </div>
        <Post v-for="[id, post] in postlist" :key="id" :post="post" :user="userStore.getUser(post.createdUserId)" edit-post />
        
        <!-- 空状态 -->
        <n-empty v-if="!firstLoading && !loading && postlist.size === 0" 
          description="还没有发布过帖子" 
          class="empty-state" 
          size="small" />
    </div>
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
const firstLoading = ref(true)
const loading = ref(false);
async function init() {
    try {
        const result = await getPosts({
            page: 1,
            pageSize: 10,
            postUserId: user.id,
            sortField: "createdDate",
            sortType: "desc"
        });
        userStore.setUsers(result.data.includes.users)
        categoriesStore.setCategories(result.data.includes.categories)
        result.data.post.forEach(post => {
            postlist.value.set(post.id, post)
        })
        firstLoading.value = false;
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
    margin-top: 40px;
    margin-bottom: 40px;
}
</style>