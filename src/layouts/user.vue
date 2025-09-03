<template>
    <template v-if="signin">
        <n-space>
            <router-link to="/created" custom>
                <template #default="{ navigate }">
                    <n-button quaternary type="primary" @click="navigate">发个帖子</n-button>
                </template>
            </router-link>
            <n-dropdown :options="userOptions" @select="handleSelect">
                <router-link :to="`/user/${userInfo.id}`" custom v-if="userInfo">
                    <template #default="{ navigate }">
                        <div class="flex items-center cursor-pointer" @click="navigate">
                            <n-avatar round :size="32" :src="userInfo.avatarUrl" class="mr-2" />
                            <span class="mr-2">{{ userInfo.nickName }}</span>
                        </div>
                    </template>
                </router-link>
            </n-dropdown>
        </n-space>
    </template>
    <template v-else>
        <n-button quaternary type="primary" class="mr-2">
            <router-link to="/login" class="link-reset">
                登录
            </router-link>
        </n-button>
        <n-button type="primary">
            <router-link to="/register" class="link-reset">
                注册
            </router-link>
        </n-button>
    </template>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { storeToRefs } from "pinia"
const appStore = useAppStore()
const { userInfo, signin } = storeToRefs(appStore)

const userOptions: DropdownOption[] = [
    {
        label: '退出登录',
        key: 'logout',
        // icon: () => h(NIcon, null, { default: () => '退出' })
    }
]

const handleSelect = (key: string) => {
    if (key === 'logout') {
        appStore.loginOut()
    }
}
</script>

<style scoped lang="scss">
.link-reset {
    text-decoration: none;
    color: inherit;
}
</style>
