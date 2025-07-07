<template>
    <div class="flex login-container">
        <n-grid cols="2" item-responsive responsive="screen">
            <n-grid-item span="0 m:1 l:1">
                <div class="leftImg flex flex-col justify-end p-16">
                    <span class="text-9 mb-4 font-bold">音游爱好者的聚集地</span>
                    <span class="text-5">分享快乐,记录生活</span>
                </div>
            </n-grid-item>
            <n-grid-item span="2 m:1 l:1">
                <div class="flex flex-col justify-center  loginRender">
                    <RightOther />
                    <Login />
                </div>
            </n-grid-item>
        </n-grid>
    </div>
</template>
<script setup lang="ts">
import Login from './login.vue';
import RightOther from './rightOther.vue';

</script>
<style scoped lang="scss">
.login-container {
    width: 100%;
    height: 100%;
    flex: 1;
}

.leftImg {
    height: 100%;
    flex: 1;
    background-image: url('./images/bg2.png');
    background-size: cover;
    background-position: center;
    color: #ffffff;
}

.loginRender {
    padding: 64px 80px;
    flex: 1;
    height: 100%;
}

.title {
    font-weight: bolder;
}
</style>
