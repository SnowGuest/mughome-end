<template>
    <component :is="self ? userSelf : userDetail" />
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';
import userDetail from './detail.vue';
import userSelf from './self/index.vue';
import { getUser } from '@/api/user';
const app = useAppStore();
const route = useRoute();
const self = computed(() => {
    if (Array.isArray(route.params.id)) return;
    const self = parseInt(route.params.id) === app.userInfo?.id;
    return self;
});

const user = ref<User>();

</script>
