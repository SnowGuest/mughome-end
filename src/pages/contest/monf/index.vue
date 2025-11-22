<template>
    <mug-container>
        <div class="container">
            <!-- 顶部横幅 -->
            <div class="hero-banner">
                <div class="banner-content">
                    <h1 class="banner-title">{{ bannerTitle }}</h1>
                    <p class="banner-subtitle">展示你的创意</p>
                    <n-button type="primary" size="large" round class="signup-btn">立即参与</n-button>
                </div>

                <div class="stats-cards">
                    <!-- 参赛队伍 -->
                    <div class="stat-card">
                        <n-icon :component="PeopleIcon" size="24" color="#3B82F6" />
                        <div class="stat-label">参赛队伍</div>
                        <div class="stat-value">{{ monfWorks.length }}</div>
                    </div>

                    <!-- 当前阶段 -->
                    <div class="stat-card stage-card">
                        <div class="stage-badge" :class="currentStage.class">
                            {{ currentStage.name }}
                        </div>
                        <div class="stat-label">{{ currentStage.label }}</div>
                        <div class="stat-value countdown">{{ currentStage.countdown }}</div>
                    </div>

                    <!-- 评分开始倒计时（仅投稿阶段显示） -->
                    <div class="stat-card" v-if="daysUntilScoreStart > 0 && currentStage.class === 'stage-submission'">
                        <n-icon :component="TimeIcon" size="24" color="#10B981" />
                        <div class="stat-label">评分开始</div>
                        <div class="stat-value">{{ daysUntilScoreStart }} 天后</div>
                    </div>
                </div>

                <div class="trophy-icon">
                    <n-icon :component="TrophyIcon" size="120" color="#FFB800" />
                </div>
            </div>

            <!-- 筛选排序 -->
            <n-card class="info-card filter-card">
                <template #header>
                    <div class="card-header">
                        <div class="icon-wrapper purple">
                            <n-icon :component="FilterIcon" size="18" color="#fff" />
                        </div>
                        <span>筛选排序</span>
                    </div>
                </template>
                <div class="filter-tabs">
                    <n-button :type="activeFilter === 'averageScore' ? 'primary' : 'default'" size="small" round
                        @click="activeFilter = 'averageScore'">平均分</n-button>
                    <n-button :type="activeFilter === 'score' ? 'primary' : 'default'" size="small" round
                        @click="activeFilter = 'score'">总分</n-button>
                    <n-button :type="activeFilter === 'rank' ? 'primary' : 'default'" size="small" round
                        @click="activeFilter = 'rank'">排名（平均分）</n-button>
                    <n-button :type="activeFilter === 'createdDate' ? 'primary' : 'default'" size="small" round
                        @click="activeFilter = 'createdDate'">发布日期</n-button>
                </div>
                <div class="filter-sort">
                    <span class="sort-label">排序方向</span>
                    <n-select v-model:value="sortOrder" :options="sortOrderOptions" size="small" class="w-40" />
                </div>
            </n-card>
            <!-- 作品列表 -->
            <n-grid :x-gap="24" :y-gap="24" cols="1 500:2 800:3 1400:4">
                <n-gi v-for="(work, index) in displayedWorks" :key="work.id">
                    <MonfCard :monf="work" :rank="index + 1" :active-field="activeFilter"
                        :dynamic-label="dynamicConfig.label" :dynamic-value="dynamicConfig.value" />
                </n-gi>
            </n-grid>
        </div>
    </mug-container>
</template>

<script setup lang="ts">
import { getMonfList, type MonfsParams } from '@/api/monf';
import MonfCard from './MonfCard.vue';
import mugContainer from "@/components/container/index.vue"
import {
    People as PeopleIcon,
    Cash as CashIcon,
    Calendar as CalendarIcon,
    Trophy as TrophyIcon,
    Time as TimeIcon,
    Filter as FilterIcon,
} from '@vicons/ionicons5';
import { useRoute } from 'vue-router';
import { useUsers } from '@/stores/user';

const route = useRoute()
const monfYear = ref(route.params.year);
const bannerTitle = computed(() => `${monfYear.value}年MONF大赛`)

// 比赛日期配置
const contestDates = {
    submissionEnd: new Date('2024-06-01T00:00:00'), // 截稿日期（投稿结束）
    scoreStart: new Date('2024-06-01T20:00:00'),    // 评分开始
    scoreEnd: new Date('2024-07-07T20:00:00'),       // 评分结束
};

// 计算天数差
const calculateDays = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// 倒计时数据
const daysUntilSubmissionEnd = computed(() => calculateDays(contestDates.submissionEnd));
const daysUntilScoreStart = computed(() => calculateDays(contestDates.scoreStart));
const daysUntilScoreEnd = computed(() => calculateDays(contestDates.scoreEnd));

// 当前阶段
const currentStage = computed(() => {
    const now = new Date();

    if (now < contestDates.submissionEnd) {
        // 投稿阶段
        return {
            name: '投稿阶段',
            label: '距离截稿',
            countdown: `${daysUntilSubmissionEnd.value} 天`,
            class: 'stage-submission'
        };
    } else if (now < contestDates.scoreEnd) {
        // 评分阶段
        return {
            name: '评分阶段',
            label: '距离结束',
            countdown: `${daysUntilScoreEnd.value} 天`,
            class: 'stage-scoring'
        };
    } else {
        // 已结束
        return {
            name: '已结束',
            label: '比赛状态',
            countdown: '已完结',
            class: 'stage-ended'
        };
    }
});

// 排序配置
const activeFilter = ref<'averageScore' | 'score' | 'rank' | 'createdDate'>('averageScore');
const sortOrder = ref<'down' | 'up'>('down');
const sortOrderOptions = [
    { label: '降序', value: 'down' },
    { label: '升序', value: 'up' },
];

// 动态列配置（根据 activeFilter 显示不同内容）
const dynamicConfig = computed(() => {
    const configs = {
        averageScore: { label: '平均分', value: 'averageScore' },
        score: { label: '总分', value: 'score' },
        rank: { label: '排名', value: 'rank' },
        createdDate: { label: '发布日期', value: 'createdDate' },
    };
    return configs[activeFilter.value];
});

// 原始数据
const monfWorks = ref<Monf[]>([]);

// 显示的作品列表（排序后）
const displayedWorks = ref<Monf[]>([]);

// 排序函数
const sortWorks = (sortBy: 'averageScore' | 'score' | 'rank' | 'createdDate', order: 'down' | 'up') => {
    const works = [...monfWorks.value];

    works.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (sortBy) {
            case 'averageScore':
                valueA = Number(a.averageScore) || 0;
                valueB = Number(b.averageScore) || 0;
                break;
            case 'score':
                valueA = Number(a.score) || 0;
                valueB = Number(b.score) || 0;
                break;
            case 'rank':
                // 排名：数字越小越靠前
                valueA = Number(a.rank) || 999999;
                valueB = Number(b.rank) || 999999;
                // 降序：显示排名靠前的（数字小的）
                if (order === 'down') {
                    return valueA - valueB;
                } else {
                    return valueB - valueA;
                }
            case 'createdDate':
                valueA = new Date(a.createdDate).getTime();
                valueB = new Date(b.createdDate).getTime();
                break;
            default:
                return 0;
        }

        // 降序：大到小，升序：小到大
        if (order === 'down') {
            return valueB - valueA;
        } else {
            return valueA - valueB;
        }
    });

    displayedWorks.value = works;
};

// 监听排序条件变化
watch([activeFilter, sortOrder], ([newFilter, newOrder]) => {
    sortWorks(newFilter, newOrder);
}, { immediate: true });

// 监听原始数据变化，重新排序
watch(monfWorks, () => {
    sortWorks(activeFilter.value, sortOrder.value);
}, { deep: true });

const userStore = useUsers();
const loading = ref(false);

async function loadMonfs() {
    loading.value = true;
    const result = await getMonfList({
        session: route.params.time as MonfsParams["session"],
    });
    userStore.setUsers(result.data.includes.users);
    monfWorks.value = result.data.works.map(e => ({
        ...e,
        score: `${Number(e.chartScoreTotal) + Number(e.musicScoreTotal)}`,
        averageScore: (Number(e.chartScoreAvg) + Number(e.musicScoreAvg)).toFixed(2)
    }));
    await nextTick();
    loading.value = false;
}

loadMonfs();


</script>

<style scoped lang="less">
.monf-page {
    min-height: 100vh;
    padding: 0;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px 40px;
}

// 顶部横幅
.hero-banner {
    position: relative;
    padding: 60px 40px;
    margin-bottom: 32px;
    overflow: hidden;
    background: linear-gradient(168.69008deg, rgba(59, 130, 246, 0.10) 15%, rgba(79, 70, 229, 0.10) 85%);
    box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.10), 0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 0px 0px 0px rgba(0, 0, 0, 0.00), 0px 0px 0px 0px rgba(0, 0, 0, 0.00);
    border: 1px solid #BFDBFE;
    border-radius: 16px;

    .banner-content {
        max-width: 600px;

        .banner-title {
            font-size: 36px;
            font-weight: 700;
            color: #1F2937;
            margin: 0 0 8px 0;
        }

        .banner-subtitle {
            font-size: 16px;
            color: #6B7280;
            margin: 0 0 24px 0;
        }

        .signup-btn {
            padding: 0 32px;
            height: 44px;
        }
    }

    .stats-cards {
        display: flex;
        gap: 16px;
        margin-top: 32px;
        flex-wrap: wrap;

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            min-width: 160px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            .stat-label {
                font-size: 13px;
                color: #9CA3AF;
                margin: 8px 0 4px;
            }

            .stat-value {
                font-size: 20px;
                font-weight: 700;
                color: #111827;

                &.countdown {
                    color: #3B82F6;
                }
            }

            &.stage-card {
                position: relative;
                padding-top: 16px;

                .stage-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;

                    &.stage-submission {
                        background: #DBEAFE;
                        color: #3B82F6;
                    }

                    &.stage-scoring {
                        background: #D1FAE5;
                        color: #10B981;
                    }

                    &.stage-ended {
                        background: #F3F4F6;
                        color: #6B7280;
                    }
                }
            }
        }
    }

    .trophy-icon {
        position: absolute;
        right: 80px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.3;

        @media (max-width: 768px) {
            display: none;
        }
    }
}

// 筛选排序卡片
.filter-card {
    margin-bottom: 32px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.10), 0px 4px 6px -1px rgba(0, 0, 0, 0.10);
    border: 1px solid #E2E8F0;
    border-radius: 16px;

    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 15px;

        .icon-wrapper {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            &.purple {
                background: #8B5CF6;
            }
        }
    }

    .filter-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }

    .filter-sort {
        display: flex;
        align-items: center;
        gap: 12px;

        .sort-label {
            font-size: 13px;
            color: #6B7280;
            white-space: nowrap;
        }
    }
}
</style>
