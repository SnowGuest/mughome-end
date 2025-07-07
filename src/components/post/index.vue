<template>
    <router-link :to="`/post/${post.id}`" custom>
        <template #default="{ navigate }">
            <article class="post-card flex p-4" @click="navigate">
                <div class="flex flex-col flex-1">
                    <PostHeader v-if="user" :user="user" :post="post" />
                    <h3 class="title mb-2 mt-3 font-bold">{{ post.title }}</h3>
                    <p class="desu">{{ post.introduction }}</p>
                    <PostFooter :post="post" class="mt-auto" />
                </div>
                <div class="relative header-img-view ml-6" v-if="post.headerImage">
                    <n-image class="absolute header-img " object-fit="cover" width="240" :src="post.headerImage"
                        preview-disabled lazy />
                </div>
            </article>
        </template>
    </router-link>
</template>
<script setup lang="ts">
import PostFooter from './postFooter.vue';
import PostHeader from './postHeader.vue';
const { post, user } = defineProps<{
    post: Post
    user?: User
    categories?: Categorie
}>()
</script>
<style scoped lang="scss">
.desu {
    color: #4B5563;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.post-card {
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: #F9FAFC;
    }

    .title {
        font-size: 18px;
        color: #000000;
    }
}

.header-img-view {
    width: 260px;
}

.header-img {
    border-radius: 8px;
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%);
}
</style>
