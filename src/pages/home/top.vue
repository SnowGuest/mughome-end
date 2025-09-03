<template>
    <n-carousel show-arrow autoplay loop class="banner-container">
        <a class="flex items-center justify-center banner" v-for="image in images" :href="image.linkUrl" target="_blank">
            <img :src="image.imageUrl" :alt="image.description" class="banner-img" />
        </a>
    </n-carousel>
</template>
<script setup lang="ts">
import { getBanners } from '@/api/pages';
const images = ref<Banner[]>([])
async function init() {
    const result = await getBanners()
    images.value = result.data.banners
}
init()
</script>
<style scoped lang="less">
.banner {
    width: 100%;
    height: 280px;
}

.banner-img {
    object-fit: cover;
    height: 100%;
}
.banner-container{
    width: 100%;
    height: 280px;
}
</style>
