<template>
    <n-infinite-scroll class="container-scroll" :distance="10" @load="handleLoad">
        <div class="container pt-6 pb-6 pl-4 pr-4">
            <n-page-header title="帖子详情" @back="handleBack">
                <template #header>
                    <n-breadcrumb v-if="!firstLoading">
                        <n-breadcrumb-item v-for="item in breadcrumb">{{ item.label }}</n-breadcrumb-item>
                    </n-breadcrumb>
                </template>
            </n-page-header>
            <n-grid cols="4" item-responsive responsive="screen" :x-gap="16">
                <n-grid-item span="4 m:3 l:3">
                    <div v-if="firstLoading" class="mt-4">
                        <n-skeleton text style="width: 50%" />
                        <n-skeleton text style="width: 60%" />
                        <n-skeleton text :repeat="3" />
                        <n-skeleton text style="width: 60%" />
                    </div>
                    <article v-else-if="post && user" class="mt-4">
                        <h1 class="title">{{ post.title }}</h1>
                        <PostHeader :user="user" />
                        <MdPreview :id="id" :modelValue="DOMPurify.sanitize(post.content)" />
                        <Comments :comments="commentList" :post="post" @commentSuccess="handleCommentSuccess" />
                    </article>
                </n-grid-item>
                <n-grid-item span="0 m:1 l:1">
                    <div class="flex flex-col sticky top-0">
                        <UserOther class="mb-4" :user="user" v-if="user" />
                        <MdCatalog :editorId="id" :scrollElement="scrollElement" v-if="scrollElement" />
                    </div>
                </n-grid-item>
            </n-grid>
        </div>
    </n-infinite-scroll>
</template>
<script setup lang="ts">
import { getPost } from '@/api/post';
import DOMPurify from 'dompurify';
import PostHeader from '@/components/post/postHeader.vue';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';
import UserOther from './userOther.vue';
import Comments from './comments.vue';
const id = "preview"
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const router = useRouter();
const route = useRoute();
const postId = ref<string>(route.params.postId as string || "");
const firstLoading = ref(true);
const post = ref<Post>();
const userStore = useUsers();
const categoriesStore = useCategories();
const user = computed(() => post.value?.id && userStore.getUser(post.value.createdUserId));
const breadcrumb = computed(() => {
    const list = [
        {
            label: '首页',
            to: '/'
        }
    ]
    post.value?.relations.categoryIds.forEach(e => {
        list.push({
            label: categoriesStore.getCategorie(e)?.name || "",
            to: `/category/${e}`
        })
    })

    return list;
})
const page = ref(1);
const pageSize = 10;
function handleBack() {
    router.back();
}
function handleLoad() {
    console.log("触发")
}
const commentList = ref<Map<PostComment["id"], PostComment>>(new Map());

async function init() {
    try {
        const result = await getPost(postId.value);
        post.value = result.data.post;
        userStore.setUsers(result.data.includes.users)
        categoriesStore.setCategories(result.data.includes.categories);
        const comments = result.data.includes.comments
        const subCommentIds = comments.map(e => e.relations && e.relations.subCommentIds && e.relations.subCommentIds).flat();

        comments.forEach(e => {
            if (subCommentIds.includes(e.id)) {
                e.isHidden = true
            }
            commentList.value.set(e.id, e);
        })
    } catch (error) {
        console.log(error)
    } finally {
        firstLoading.value = false;
    }
}
init()
const scrollElement = ref<HTMLElement>();
onMounted(() => {
    scrollElement.value = document.querySelector(".container-scroll > .n-scrollbar-container") as HTMLElement;
})
function handleCommentSuccess(comment: PostComment, topCommentId?: PostComment["id"]) {
    if (topCommentId) {
        const topComment = commentList.value.get(topCommentId);
        comment.isHidden = true;
        commentList.value.set(comment.id, comment);
        if (topComment) {
            if (!topComment.relations) topComment.relations = { subCommentIds: [] };
            if (!topComment.relations.subCommentIds) topComment.relations.subCommentIds = [];
            topComment.relations.subCommentIds.push(comment.id);
            return
        }
    }
    console.log(comment, '评论成功')
    let newCommentList = Array.from(commentList.value)
    newCommentList.unshift([comment.id, comment]);
    const newCommentListMap = new Map(newCommentList);
    commentList.value = newCommentListMap

}
</script>
<style scoped lang="scss">
.container-scroll {
    :deep(.n-scrollbar-container) {
        position: relative;
    }
}

.container-scroll {
    flex: 1;
    height: 0;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #18181B;
    margin-bottom: 16px;
}
</style>