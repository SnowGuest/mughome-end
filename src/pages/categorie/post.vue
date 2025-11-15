<template>
    <n-infinite-scroll class="container-scroll" :distance="10" @load="handleLoad">
        <div class="container pt-6 pb-6 pl-4 pr-4">
            <n-grid cols="4" item-responsive responsive="screen">
                <n-grid-item span="4 m:3 l:3">
                    <div class="flex flex-col ">
                        <div v-if="firstLoading">
                            <n-skeleton text style="width: 50%" />
                            <n-skeleton text style="width: 60%" />
                            <n-skeleton text :repeat="3" />
                            <n-skeleton text style="width: 60%" />
                        </div>
                        <Post v-for="[id, post] in postlist" :key="id" :post="post" :editPost="false"
                            :user="userStore.getUser(post.createdUserId)" />
                    </div>
                    <div v-if="loading && !firstLoading" class="loading-footer flex items-center justify-center">
                        <n-spin size="small" class='mr-2' />
                        加载中...
                    </div>
                </n-grid-item>
                <n-grid-item span="0 m:1 l:1">
          
                </n-grid-item>
            </n-grid>
        </div>
    </n-infinite-scroll>

</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { getPosts, type PostsParams } from '@/api/post';
import Post from '@/components/post/index.vue';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';

const postlist = ref<Map<Post["id"], Post>>(new Map());
const userStore = useUsers();
const categoriesStore = useCategories();
const page = ref(1);
const pageSize = 10;
const firstLoading = ref(true)
const loading = ref(false);

// 接收父组件传入的参数
const props = defineProps<{ 
    categorieId?: string | number;
    activeTag?: 'hot' | 'latest' | 'recommend';
}>()

const sortField = ref<PostsParams["sortField"]>("createdDate");
const sortOrder = ref<'desc' | 'asc'>('desc');

// 根据 activeTag 更新排序
watch(() => props.activeTag, (newTag) => {
    if (newTag === 'hot') {
        sortField.value = 'likeCount';
        sortOrder.value = 'desc';
    } else if (newTag === 'latest') {
        sortField.value = 'createdDate';
        sortOrder.value = 'desc';
    } else if (newTag === 'recommend') {
        sortField.value = 'likeCount';
        sortOrder.value = 'desc';
    }
    // 重置并重新加载
    page.value = 1;
    postlist.value.clear();
    firstLoading.value = true;
    init();
}, { immediate: true });

// 当 categorieId 变化时重新加载
watch(() => props.categorieId, () => {
    page.value = 1;
    postlist.value.clear();
    firstLoading.value = true;
    init();
});
async function init() {
    try {
        const params: PostsParams = {
            page: page.value,
            pageSize,
            sortField: sortField.value,
            sortType: sortOrder.value,
        };
        
        // 如果有 categorieId，添加到参数中
        if (props.categorieId) {
            params.categorieId = props.categorieId;
        }
        
        const result = await getPosts(params);
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
function selectOrder(value: 'desc' | 'asc') {
    sortOrder.value = value;
    page.value = 1;
    postlist.value.clear();
    firstLoading.value = true;
    init();
}

</script>

<style scoped lang="less">
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

/* 使用 Naive UI 默认样式，无自定义覆盖 */
</style>
