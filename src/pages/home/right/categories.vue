<template>
    <div class="hot-categories">
        <h2 class="title">热门分区</h2>
        <n-grid :x-gap="12" :y-gap="24" :cols="2">
            <n-grid-item v-for="[id, categorie] in categoriesStore.categories" :key="id">
                <div class="category-card flex flex-col items-center justify-center p-4">
                    <div class="icon-placeholder" :class="categorie.icon" :style="{ color: categorie.color }"></div>
                    <div class="category-title mt-2">{{ categorie.name }}</div>
                </div>
            </n-grid-item>
        </n-grid>
    </div>
</template>

<script setup lang="ts">
import { useCategories } from '@/stores/categories';
const categoriesStore = useCategories();
</script>

<style scoped lang="scss">
.hot-categories {
    .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 24px;
    }

    .categories-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px 32px;
    }

    .category-card {
        background: #fafbfc;
        border-radius: 8px;
        transition: box-shadow 0.2s;
        width: 118px;
        height: 100px;
        &:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .icon-placeholder{
            font-size: 24px;
        }

        .category-title {
            font-size: 14px;
            color: #222;
            font-weight: 500;
            
        }
    }
}
</style>