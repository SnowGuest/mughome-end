<script setup lang="ts">
import { NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  "common": {
    "primaryColor": "#FF7846FF",
    "primaryColorHover": "#ff9066FF",
    "primaryColorPressed": "#ff6025FF",
    "primaryColorSuppl": "#ff7846FF"
  }
}
</script>

<template>
  <n-config-provider inline-theme-disabled abstract :theme-overrides="themeOverrides">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
