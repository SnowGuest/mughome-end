<template>
    <div class="mb-12 flex items-center">
        <img src="@/assets/images/logo.png" class="mr-2" width="32" height="32" alt="" />
        <span class="text-5 font-bold">音柚窝</span>
    </div>
    <div class="flex flex-col moblie mb-12">
        <span class="text-6 mb-2">音游爱好者的聚集地</span>
        <span class="text-4 color">分享快乐,记录生活</span>
    </div>
    <div class="flex flex-col pc mb-9">
        <h1 class="title text-8 mb-2">账号登录</h1>
        <p class="desc text-4">欢迎回来！请登录您的账号</p>
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
@media screen and (max-width: 1024px) {
    .moblie {
        display: flex;
    }
    .pc{
        display: none;
    }
}
@media screen and (min-width: 1024px) {
    .pc {
        display: flex;
    }
    .moblie {
        display: none;
    }
}
</style>
