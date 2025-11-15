<template>
    <div class="category-navigation">
        <div class="header">
            <h2 class="title">论坛分区导航</h2>
        </div>

        <div class="category-list">
            <div v-for="[id, categorie] in categoriesStore.categories" :key="id" class="category-item"
                @mouseenter="handleMouseEnter(id, categorie)" @mouseleave="handleMouseLeave(id)">
                <div class="category-main" @click="handleCategoryClick(categorie)">
                    <div class="left-content">
                        <div class="icon-wrapper" :class="categorie.icon" :style="{ color: categorie.color }"></div>
                        <span class="category-name">{{ categorie.name }}</span>
                    </div>

                    <div class="right-content">
                        <span v-if="categorie.isHot" class="tag hot-tag">热门</span>
                        <span v-if="categorie.isRecommended" class="tag recommend-tag">推荐</span>
                        <i v-if="categorie.children && categorie.children.length > 0" class="arrow"
                            :class="{ expanded: expandedIds.has(id) }">▼</i>
                        <i v-else class="arrow-right">›</i>
                    </div>
                </div>

                <transition name="expand">
                    <div v-if="categorie.children && categorie.children.length > 0 && expandedIds.has(id)"
                        class="children-list">
                        <div v-for="child in categorie.children" :key="child.id" class="child-item"
                            @click.stop="handleClick(child.id)">
                            <div class="icon-wrapper" :class="child.icon" :style="{ color: child.color }"></div>
                            <span class="child-name">{{ child.name }}</span>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCategories } from '@/stores/categories';
import { useRouter } from 'vue-router';
import { getCategories } from '@/api/categorie';

const categoriesStore = useCategories();
const router = useRouter();
const expandedIds = ref<Set<number>>(new Set());
const loading = ref(false);

const handleClick = (id: Categorie['id']) => {
    router.push(`/categorie/${id}`);
};

const handleMouseEnter = (id: number, categorie: Categorie) => {
    if (categorie.children && categorie.children.length > 0) {
        expandedIds.value.add(id);
    }
};

const handleMouseLeave = (id: number) => {
    expandedIds.value.delete(id);
};

const handleCategoryClick = (categorie: Categorie) => {
    // 点击时跳转到分类页面
    handleClick(categorie.id);
};

const fetchCategories = async () => {
    loading.value = true;
    try {
        const res = await getCategories();
        const categories = res.data.categories || [];
        categoriesStore.setCategories(categories);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('获取分区失败', e);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchCategories);
</script>

<style scoped lang="less">
.category-navigation {
    .header {
        margin-bottom: 16px;

        .title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0;
        }
    }

    .category-list {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .category-item {
            background: #faf5f0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s;

            &:hover {
                background: #f5ede3;
            }

            .category-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                cursor: pointer;

                .left-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;

                    .icon-wrapper {
                        font-size: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                    }

                    .category-name {
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                    }
                }

                .right-content {
                    display: flex;
                    align-items: center;
                    gap: 6px;

                    .tag {
                        font-size: 11px;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-weight: 500;
                    }

                    .hot-tag {
                        color: #ff6b35;
                        background: #fff3ed;
                    }

                    .recommend-tag {
                        color: #ff6b35;
                        background: #fff3ed;
                    }

                    .arrow {
                        font-size: 10px;
                        color: #999;
                        transition: transform 0.3s;
                        font-style: normal;

                        &.expanded {
                            transform: rotate(180deg);
                        }
                    }

                    .arrow-right {
                        font-size: 18px;
                        color: #999;
                        font-style: normal;
                        font-weight: 300;
                    }
                }
            }

            .children-list {
                padding: 0 16px 8px 16px;
                display: flex;
                flex-direction: column;
                gap: 4px;

                .child-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    padding-left: 38px;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: background 0.2s;

                    &:hover {
                        background: rgba(255, 255, 255, 0.5);
                    }

                    .icon-wrapper {
                        font-size: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 20px;
                        height: 20px;
                    }

                    .child-name {
                        font-size: 13px;
                        color: #666;
                    }
                }
            }
        }
    }
}

// 展开动画
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>