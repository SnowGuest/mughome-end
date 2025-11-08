<template>
    <router-link to="/" custom>
        <template #default="{ navigate }">
            <div class="flex text items-center cursor-pointer" @click="navigate">
                <img src="@/assets/images/logo.png" width="32" height="32" class="mr-2" />
                MugHome-音柚窝
            </div>
        </template>

    </router-link>
</template>
<script setup lang="ts">

</script>
<style scoped lang="less">
.text {
    font-size: 16px;
    font-weight: normal;
}
</style>