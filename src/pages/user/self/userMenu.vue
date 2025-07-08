<template>
    <div class="user-card ">
        <n-menu :options="menuOptions" />
    </div>
</template>
<script setup lang="ts">
const { user } = defineProps<{ user: User }>()
import { h } from "vue"
import { NIcon } from "naive-ui"
import { User, AlignBoxTopLeft, Security, NotificationNew } from "@vicons/carbon"
function renderIcon(component: Component) {
    return () => h(NIcon, {
        component
    })
}
const menuOptions = [
    {
        label: '基本信息',
        key: 'user-base',
        icon: renderIcon(User)
    },
    {
        label: '帖子管理',
        key: 'post-manage',
        icon: renderIcon(AlignBoxTopLeft)
    },
    {
        label: '账号安全',
        key: 'account-security',
        icon: renderIcon(Security)
    },
    {
        label: '通知设置',
        key: 'notification-settings',
        icon: renderIcon(NotificationNew)
    }
]
</script>
<style scoped lang="scss">
.user-card {
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);

    border-radius: 8px;
    min-width: 280px;
}
</style>