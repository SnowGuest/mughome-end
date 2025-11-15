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
                        
                        <!-- 空状态 -->
                        <n-empty v-if="!firstLoading && !loading && postlist.size === 0" 
                          :description="keyword ? '没有找到相关帖子' : '请输入关键词搜索'" 
                          class="empty-state">
                          <template #extra v-if="!keyword">
                            <n-text depth="3" style="font-size: 14px;">在上方搜索框输入关键词开始搜索</n-text>
                          </template>
                        </n-empty>
                    </div>
                    <div v-if="loading && !firstLoading" class="loading-footer flex items-center justify-center">
                        <n-spin size="small" class='mr-2' />
                        加载中...
                    </div>
                </n-grid-item>
                <n-grid-item span="0 m:1 l:1">
                    <div class="flex flex-col right-container">
                        <n-card title="搜索筛选">
                            <div>时间范围</div>
                            <n-space vertical size="small">
                                <n-button :type="sortField === 'createdDate' ? 'primary' : 'default'" block
                                    @click="handleCheck('createdDate')">最新发布</n-button>
                                <n-button :type="sortField === 'likeCount' ? 'primary' : 'default'" block
                                    @click="handleCheck('likeCount')">最多点赞</n-button>
                            </n-space>

                            <n-divider />

                            <div>排序方式</div>
                            <n-grid cols="2" x-gap="12" y-gap="12">
                                <n-grid-item>
                                    <n-button :type="sortOrder === 'desc' ? 'primary' : 'default'" block
                                        @click="selectOrder('desc')">倒序</n-button>
                                </n-grid-item>
                                <n-grid-item>
                                    <n-button :type="sortOrder === 'asc' ? 'primary' : 'default'" block
                                        @click="selectOrder('asc')">升序</n-button>
                                </n-grid-item>
                            </n-grid>
                        </n-card>
                    </div>
                </n-grid-item>
            </n-grid>
        </div>
    </n-infinite-scroll>

</template>
<script setup lang="ts">
import { getPosts, type PostsParams } from '@/api/post';
import Post from '@/components/post/index.vue';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';
import { useRoute } from 'vue-router';
import { watchEffect, toRef } from 'vue';
const postlist = ref<Map<Post["id"], Post>>(new Map());
const userStore = useUsers();
const categoriesStore = useCategories();
const page = ref(1);
const pageSize = 10;
const firstLoading = ref(true)
const loading = ref(false);
// 接收父组件传入的 keyword（由上层路由驱动）
const { keyword = "" } = defineProps<{ keyword?: string }>()

// 当父组件传入的 keyword 变化时重置分页并刷新列表
watch(() => keyword, () => {
    page.value = 1
    postlist.value.clear()
    firstLoading.value = true
    loading.value = true
    if (!keyword || !keyword.trim()) {
        // 关键词为空时直接清空并停止
        firstLoading.value = false
        loading.value = false
        return
    }
    init()
})
const sortField = ref<PostsParams["sortField"]>("createdDate");
const sortOrder = ref<'desc' | 'asc'>('desc');
async function init() {
    try {
        const result = await getPosts({
            page: page.value,
            pageSize,
            sortField: sortField.value,
            sortType: sortOrder.value,
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
function selectOrder(value: 'desc' | 'asc') {
    sortOrder.value = value;
    page.value = 1;
    postlist.value.clear();
    firstLoading.value = true;
    init();
}
init();

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

.empty-state {
    margin-top: 60px;
    margin-bottom: 60px;
}
</style>
