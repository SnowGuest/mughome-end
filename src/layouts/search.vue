<template>
    <div class="relative search">
        <input class="searchInput" @keydown.enter="handleSearch" v-model="searchInput" type="text" placeholder="搜索帖子、用户、或标签">
        <div class="absolute search-icon" @click="handleSearch">
            <i class="i-basil:search-solid "></i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
const message = useMessage();
const route = useRoute();

const searchInput = ref(route.query.q as string || '');
const router = useRouter();
const handleSearch = () => {
    if(searchInput.value.trim() === '') {
        message.error('请输入搜索内容');
        return;
    }
    router.push('/search?q=' + searchInput.value);
}
</script>
<style lang="less" scoped>
.search-icon {
    cursor: pointer;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    display: flex;
}

.search {
    height: 36px;
    width: 576px;
}

.searchInput {
    background-color: #F9FAFB;
    border-radius: 100px;
    margin: 0 auto;
    padding: 0 40px 0 14px;
    border: none;
    outline: none;
    font-size: 14px;
    height: 100%;
    width: 100%;

    &::placeholder {
        color: #9CA3AF;
    }
}
</style>
