<template>
    <div class="flex statistics">
        <div class="statistic">
            <img class="icon" src="../images/post.svg" alt="">
            <span class="count">{{ Math.round(animatedPostCount) }}</span>
            <span class="text">发帖数</span>
        </div>
        <div class="statistic">
            <img class="icon" src="../images/like.svg" alt="">
            <span class="count">{{ Math.round(animatedLikeCount) }}</span>
            <span class="text">获赞数</span>
        </div>
        <div class="statistic">
            <img class="icon" src="../images/like.svg" alt="">

            <span class="count">{{ Math.round(animatedVisitCount) }}</span>
            <span class="text">访问数</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTransition } from '@vueuse/core'

const postCount = ref(0)
const likeCount = ref(0)
const visitCount = ref(0)

// 让动画目标值和实际值一致即可
const animatedPostCount = useTransition(postCount, { duration: 1000 })
const animatedLikeCount = useTransition(likeCount, { duration: 1000 })
const animatedVisitCount = useTransition(visitCount, { duration: 1000 })
// 你可以根据实际数据动态设置 postCount.value 和 likeCount.value

</script>
<style scoped lang="scss">
.statistics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 16px;
}

.statistic {
    height: 156px;
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.icon {
    width: 32px;
    height: 32px;
    margin-bottom: 16px;
}

.count {
    color: #000000;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
}

.text {
    color: #6B7280;
    font-size: 16px;
    font-weight: 400;

}
</style>