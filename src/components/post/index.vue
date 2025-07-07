<template>
    <router-link :to="`/post/${post.id}`" custom>
        <template #default="{ navigate }">
            <article class="post-card flex flex-col p-4" @click="navigate">
                <PostHeader v-if="user" :user="user" :post="post" />
                <h3 class="title mb-2 mt-3 font-bold">{{ post.title }}</h3>
                <div class="flex">
                    <div class="flex flex-col flex-1 mr-2">
                        <n-performant-ellipsis class="desu" line-clamp="3" :tooltip="false">
                            {{ post.introduction }}
                        </n-performant-ellipsis>
                        <Tag class="mt-auto" :post="post" />
                    </div>
                    <div class="relative header-img-view ml-auto" v-if="post.headerImage">
                        <n-image class="absolute header-img " object-fit="cover" :width="imageWidth" :src="post.headerImage"
                            preview-disabled lazy />
                    </div>
                </div>
                <PostFooter :post="post" class="mt-auto" />

            </article>
        </template>
    </router-link>
</template>
<script setup lang="ts">
import PostFooter from './postFooter.vue';
import PostHeader from './postHeader.vue';
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 600px)');
const imageWidth = computed(() => isMobile.value ? 108 : 180);

const { post, user } = defineProps<{
    post: Post
    user?: User
    categories?: Categorie
}>()
</script>
<style scoped lang="scss">
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.header-img-view {
    min-width: 180px;
    width: 180px;
    min-height: 90px;
    height: 100%;
}

@media (max-width: 600px) {
    .header-img-view {
        min-width: 108px;
        width: 108px;

        height: 72px;
    }
}


.header-img {
    border-radius: 8px;
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -50%);
}
</style>
