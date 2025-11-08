<template>
    <div class="p-6 container">
        <n-spin :show="loading">
            <div v-if="users.length === 0 && !loading" class="text-center text-gray-500">暂无用户</div>
            <n-grid :x-gap="20" :y-gap="20" cols="4">
                <n-grid-item v-for="u in users" :key="u.id">
                    <n-card size="small" @click="openUser(u)">
                        <div class="flex items-start cursor-pointer">
                            <n-avatar :src="u.avatarUrl" :size="56" />
                            <div class="ml-3 flex-1">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium">{{ u.nickName }}</div>
                                        <div class="text-sm text-gray-500">{{ u.bio || '这人很懒，什么也没留下' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 text-right">
                                    <n-button size="small" :secondary="!u.relations?.isSubscribed"
                                        :disabled="followLoading[u.id]" @click="toggleFollow(u)">
                                        {{ u.relations?.isSubscribed ? '已关注' : '关注' }}
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </n-card>
                </n-grid-item>
            </n-grid>
        </n-spin>
        <div class="mt-6 flex justify-center">
            <n-pagination :page="page" :page-count="Math.ceil(total / pageSize)" :page-size="pageSize"
                @update:page="handlePageChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import { searchUserAPI, followUserApi, unfollowUserApi } from '@/api/user'



const users = ref<User[]>([])
const loading = ref(false)
const followLoading = reactive<Record<string | number, boolean>>({})
const page = ref(1)
const pageSize = 10
const total = ref(0)
const message = useMessage()
// 接收父组件传入的 keyword
const { keyword = "" } = defineProps<{ keyword?: string }>()


const performSearch = async (kw?: string) => {
    if (!kw || !kw.trim()) {
        users.value = []
        return
    }
    loading.value = true
    try {
        const res = await searchUserAPI(kw.trim(), page.value, pageSize)
        console.log(res, 'w1s1')
        // 兼容后端返回 data 为 { users: [], total: number } 或 直接数组
        const d = (res?.data as any)
        if (Array.isArray(d)) {
            users.value = d
            total.value = d.length
        } else {
            users.value = d.users || d.data || []
            total.value = d.total || (users.value?.length || 0)
        }
    } catch (e: any) {
        message.error(e?.message || '搜索失败')
    } finally {
        loading.value = false
    }
}

// 使用 watchEffect 直接响应 prop 的变化（route-driven）
import { watchEffect } from 'vue'

watch(() => keyword, () => {
    page.value = 1
    performSearch(keyword)
})

performSearch(keyword)

const handlePageChange = (p: number) => {
    page.value = p
    performSearch(keyword)
}
import { useRouter } from 'vue-router'
const router = useRouter()

const openUser = (u: User) => {
    const resolved = router.resolve({ name: 'user', params: { id: u.id } })
    const url = resolved.href
    window.open(url, '_blank')
}
const toggleFollow = async (u: User) => {
    const id = u.id
    followLoading[id] = true
    try {
        if (u.relations?.isSubscribed) {
            await unfollowUserApi(id)
            u.relations.isSubscribed = false
            message.success('已取消关注')
        } else {
            await followUserApi(id)
            if (u.relations !== undefined) u.relations.isSubscribed = true
            message.success('关注成功')
        }
    } catch (e: any) {
        message.error(e?.message || '操作失败')
    } finally {
        followLoading[id] = false
    }
}
</script>

<style scoped>
.container {
    max-width: 1280px;
    margin: 0 auto
}
</style>
