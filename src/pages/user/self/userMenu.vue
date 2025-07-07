<template>
    <div class="user-card p-6 flex flex-col items-center justify-center">
    
    </div>
</template>
<script setup lang="ts">
// import Tag from '@/components/tag.vue'
const { user } = defineProps<{ user: User }>()
</script>
<style scoped lang="scss">
.user-card {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;
    min-width: 280px;
}

</style>