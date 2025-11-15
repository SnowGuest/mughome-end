<template>
  <n-infinite-scroll class="categorie-page" :distance="10" @load="handleLoadMore">
    <div class="container  pb-6 pl-4 pr-4">
      <!-- 顶部分区标题和标签 -->

      <!-- 主内容区域 -->
      <n-grid cols="4" item-responsive responsive="screen" :x-gap="24">
        <!-- 左侧帖子列表 -->
        <n-grid-item span="4 m:3 l:3">
          <div class="sticky top-0 z-10 bg-white p-4">
            <h1 class="categorie-title">{{ categorie?.name || '加载中...' }}</h1>
            <div class="tags-section mt-4">
              <n-space>
                <n-button :type="activeTag === 'hot' ? 'primary' : 'default'" round size="small"
                  @click="handleTagClick('hot')">
                  热门
                </n-button>
                <n-button :type="activeTag === 'latest' ? 'primary' : 'default'" round size="small"
                  @click="handleTagClick('latest')">
                  最新
                </n-button>
                <n-button :type="activeTag === 'recommend' ? 'primary' : 'default'" round size="small"
                  @click="handleTagClick('recommend')">
                  推荐
                </n-button>
              </n-space>
            </div>
          </div>
          <div class="post-list">
            <!-- 加载骨架屏 -->
            <div v-if="firstLoading">
              <n-skeleton text style="width: 50%" />
              <n-skeleton text style="width: 60%" />
              <n-skeleton text :repeat="3" />
              <n-skeleton text style="width: 60%" />
            </div>

            <!-- 帖子列表 -->
            <Post v-for="[id, post] in postlist" :key="id" :post="post" :editPost="false"
              :user="userStore.getUser(post.createdUserId)" />

            <!-- 加载更多提示 -->
            <div v-if="loading && !firstLoading" class="loading-footer flex items-center justify-center">
              <n-spin size="small" class="mr-2" />
              加载中...
            </div>
          </div>
        </n-grid-item>

        <!-- 右侧边栏 -->
        <n-grid-item span="0 m:1 l:1">
          <div class="sidebar">
            <!-- 分区信息卡片 -->
            <n-card size="small" class="mb-4">
              <div class="categorie-info">
                <div class="info-header flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="icon-wrapper" :class="categorie?.icon" :style="{ color: categorie?.color }"></div>
                    <span class="info-name ml-2">{{ categorie?.name }}</span>
                  </div>
                </div>
                <div class="info-desc text-sm text-gray-500 mb-3">
                  {{ categorie?.description || '分区暂无描述' }}
                </div>
                <n-button type="primary" block @click="handleCreatePost">
                  发帖
                </n-button>
              </div>
            </n-card>

            <!-- 分区数据 -->
            <!-- <n-card size="small" title="分区数据" class="mb-4">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ categorie?.todayPostCount ?? 0 }}</div>
                  <div class="stat-label">今日发帖</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ formatCount(categorie?.postCount) }}</div>
                  <div class="stat-label">总帖子</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ formatCount(categorie?.activeUsers) }}</div>
                  <div class="stat-label">活跃用户</div>
                </div>
              </div>
            </n-card> -->
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </n-infinite-scroll>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Post from '@/components/post/index.vue';
import { getPosts, type PostsParams } from '@/api/post';
import { useCategories } from '@/stores/categories';
import { useUsers } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const categoriesStore = useCategories();
const userStore = useUsers();
const categorieId = computed(() => Number(route.params.id));
const categorie = computed(() => categoriesStore.getCategorie(categorieId.value));
const activeTag = ref<'hot' | 'latest' | 'recommend'>('hot');
const loading = ref(false);
const firstLoading = ref(true);

// 帖子列表相关
const postlist = ref<Map<Post["id"], Post>>(new Map());
const page = ref(1);
const pageSize = 10;
const sortField = ref<PostsParams["sortField"]>("createdDate");
const sortOrder = ref<'desc' | 'asc'>('desc');

// 模拟热门标签数据
const hotTags = ref(['技术分享', '新手教程', '音游推荐', '硬件设备', '比赛资讯', '经验分享']);

const handleTagClick = (tag: 'hot' | 'latest' | 'recommend') => {
  activeTag.value = tag;
  // 重置列表并重新加载
  page.value = 1;
  postlist.value.clear();
  firstLoading.value = true;
  fetchPosts();
};

// 根据 activeTag 更新排序规则
watch(activeTag, (newTag) => {
  if (newTag === 'hot') {
    sortField.value = 'likeCount';
    sortOrder.value = 'desc';
  } else if (newTag === 'latest') {
    sortField.value = 'createdDate';
    sortOrder.value = 'desc';
  } else if (newTag === 'recommend') {
    sortField.value = 'likeCount';
    sortOrder.value = 'desc';
  }
});

const handleCreatePost = () => {
  router.push(`/post/create?categorieId=${categorieId.value}`);
};

const formatCount = (count: number | undefined) => {
  if (!count) return 0;
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count;
};

// 获取帖子列表
const fetchPosts = async () => {
  loading.value = true;
  try {
    const params: PostsParams = {
      page: page.value,
      pageSize,
      sortField: sortField.value,
      sortType: sortOrder.value,
      categoryId: categorieId.value,
    };

    const result = await getPosts(params);
    userStore.setUsers(result.data.includes.users);
    categoriesStore.setCategories(result.data.includes.categories);
    result.data.post.forEach(post => {
      postlist.value.set(post.id, post);
    });
    firstLoading.value = false;
  } catch (error) {
    console.error('获取帖子列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 加载更多
const handleLoadMore = () => {
  if (!loading.value) {
    loading.value = true;
    page.value++;
    fetchPosts();
  }
};


// 初始化加载帖子
fetchPosts();



</script>

<style scoped lang="less">
.categorie-page {
  min-height: 100vh;
  flex: 1;
  height: 0;
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.header-section {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 16px 0;
  margin: -16px 0 24px 0;
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;

  &.is-sticky {
    border-bottom-color: #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }



  .tags-section {
    :deep(.n-button) {
      padding: 0 16px;
    }
  }
}

.categorie-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.sidebar {
  position: sticky;
  top: 24px;

  .categorie-info {
    .info-header {
      .icon-wrapper {
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      }

      .info-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }

    .info-desc {
      line-height: 1.6;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    text-align: center;

    .stat-item {
      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: #ff6b35;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .hot-tags {
    :deep(.n-tag) {
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.ml-2 {
  margin-left: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.post-list {
  display: flex;
  flex-direction: column;
}

.loading-footer {
  font-size: 14px;
  color: #999;
  padding: 16px 0;
}
</style>
