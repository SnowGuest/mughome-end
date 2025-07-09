<template>
    <n-infinite-scroll class="container-scroll" :distance="10" @load="handleLoad">
        <div class="container pt-6 pb-6 pl-4 pr-4">
            <n-grid cols="4" item-responsive responsive="screen">
                <n-grid-item span="4 m:3 l:3">
                    <div class="flex flex-col ">
                        <Top />
                        <postModule @check="handleCheck" />
                        <div v-if="firstLoading">
                            <n-skeleton text style="width: 50%" />
                            <n-skeleton text style="width: 60%" />
                            <n-skeleton text :repeat="3" />
                            <n-skeleton text style="width: 60%" />
                        </div>
                        <Post v-for="[id, post] in postlist" :key="id" :post="post"
                            :user="userStore.getUser(post.createdUserId)" />
                    </div>
                    <div v-if="loading && !firstLoading" class="loading-footer flex items-center justify-center">
                        <n-spin size="small" class='mr-2' />
                        加载中...
                    </div>
                </n-grid-item>
                <n-grid-item span="0 m:1 l:1">
                    <div class="flex flex-col right-container">
                        <Categories />
                    </div>
                </n-grid-item>
            </n-grid>

        </div>
    </n-infinite-scroll>

</template>
<script setup lang="ts">
import { getPosts, type PostsParams } from '@/api/post';
import Post from '@/components/post/index.vue';
import Top from './top.vue';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';
import Categories from './right/categories.vue';
import postModule from './postModule.vue';
const postlist = ref<Map<Post["id"], Post>>(new Map());
const userStore = useUsers();
const categoriesStore = useCategories();
const page = ref(1);
const pageSize = 10;
const firstLoading = ref(true)
const loading = ref(false);
const sortField = ref<PostsParams["sortField"]>("createdDate");
async function init() {
    try {
        const result = await getPosts({
            page: page.value,
            pageSize,
            sortField: sortField.value,
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
function handleLoad() {
    if (!loading.value) {
        loading.value = true;
        page.value++;
        init();
    }

}
function handleCheck(value: PostsParams["sortField"]) {
    sortField.value = value;
    page.value = 1;
    postlist.value.clear();
    firstLoading.value = true
    init();
}
init()
</script>

<style scoped lang="scss">
.container-scroll {
    flex: 1;
    height: 0;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
}

.right-container {
    position: sticky;
    top: 24px;
    padding-left: 24px;
}

.loading-footer {
    font-size: 14px;
    color: #999;
}
</style>
