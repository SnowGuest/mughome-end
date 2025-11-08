<template>
  <Container background="#fff">
    <div class="p-6 container">
      <h2 class="title mb-4">分区</h2>
      <n-grid cols="4" item-responsive responsive="screen" :x-gap="24">
        <n-grid-item span="1 m:1 l:1">
          <n-card>
            <div class="side-list">
              <n-spin :show="loading">
                <n-list>
                  <n-list-item v-for="p in parents" :key="p.id" :class="{active: p.id === selectedParentId}"
                    @click="selectParent(p)">
                    <div class="flex items-center justify-between w-full">
                      <div>{{ p.name }}</div>
                      <div class="text-sm text-gray-400">{{ (p as any).children?.length || 0 }}</div>
                    </div>
                  </n-list-item>
                </n-list>
              </n-spin>
            </div>
          </n-card>
        </n-grid-item>

        <n-grid-item span="3 m:3 l:3">
          <n-card>
            <div class="children-grid">
              <n-spin :show="loading">
                <div v-if="!loading && selectedChildren.length === 0" class="empty">暂无子分区</div>
                <n-grid :x-gap="16" :y-gap="16" cols="3">
                  <n-grid-item v-for="c in selectedChildren" :key="c.id">
                    <n-card size="small" bordered hoverable @click="openCategory(c.id)">
                      <div class="child-card">
                        <div class="name">{{ c.name }}</div>
                        <div class="desc text-sm text-gray-500">{{ c.description || '' }}</div>
                      </div>
                    </n-card>
                  </n-grid-item>
                </n-grid>
              </n-spin>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Container from '@/components/container/index.vue'
import { getCategories } from '@/api/categorie'
import { useRouter } from 'vue-router'

const loading = ref(false)
const categories = ref<Categorie[]>([])
const selectedParentId = ref<number | null>(null)
const router = useRouter()

const parents = computed(() => categories.value.filter(c => (c as any).children && (c as any).children.length > 0))
const selectedChildren = computed(() => {
  if (selectedParentId.value === null) return []
  const p = categories.value.find(c => c.id === selectedParentId.value)
  return (p && (p as any).children) || []
})

const fetch = async () => {
  loading.value = true
  try {
    const res = await getCategories()
    categories.value = res.data.categories || []
    // 默认选择第一个父类
    const first = categories.value.find(c => (c as any).children && (c as any).children.length > 0)
    selectedParentId.value = first ? first.id : (categories.value[0] && categories.value[0].id) || null
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('获取分区失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetch)

const selectParent = (p: Categorie) => {
  selectedParentId.value = p.id
}

const openCategory = (id: number | string) => {
  router.push(`/category/${id}`)
}
</script>

<style scoped lang="less">
.container { max-width: 1280px; margin: 0 auto }
.title { font-size: 20px; font-weight: 700; color: #212121 }
.side-list { min-height: 320px }
.side-list :deep(.n-list-item) { cursor: pointer; padding: 12px }
.side-list :deep(.n-list-item.active) { background: #f5f7fb; font-weight: 600 }
.children-grid { min-height: 320px }
.child-card .name { font-weight: 600; margin-bottom: 6px }
.child-card .desc { color: #6b7280 }
.empty { text-align: center; color: #9ca3af; padding: 32px 0 }
</style>
