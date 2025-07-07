<template>
    <div class="relative search">
        <div class="absolute search-icon">
            <i class="i-basil:search-solid "></i>
        </div>
        <input class="searchInput" type="text" placeholder="搜索帖子、用户、或标签">
    </div>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
.search-icon {
    left: 10px;
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
    padding: 0 40px;
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
