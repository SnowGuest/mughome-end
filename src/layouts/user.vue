<template>
    <template v-if="signin">
        <n-dropdown :options="userOptions" @select="handleSelect">
            <router-link :to="`/user/${userInfo.id}`" custom>
                <template #default="{ navigate }">
                    <div class="flex items-center cursor-pointer" @click="navigate">
                        <n-avatar round :size="32" :src="userInfo.avatarUrl" class="mr-2" />
                        <span class="mr-2">{{ userInfo.nickName }}</span>
                    </div>
                </template>
            </router-link>
        </n-dropdown>
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
const { userInfo, loginOut, signin } = storeToRefs(useAppStore())

const userOptions: DropdownOption[] = [
    {
        label: '退出登录',
        key: 'logout',
        // icon: () => h(NIcon, null, { default: () => '退出' })
    }
]

const handleSelect = (key: string) => {
    if (key === 'logout') {
        loginOut()
    }
}
</script>

<style scoped lang="scss">
.link-reset {
    text-decoration: none;
    color: inherit;
}
</style>
