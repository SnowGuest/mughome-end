<template>
    <div class="monf-card flex flex-col h-full">
        <!-- 右上角排名徽标 -->
        <div class="rank-badge" :class="{ 'active': rank <= 10 }">
            {{ rank }}
        </div>

        <!-- 标题 -->
        <h3 class="song-name">{{ monf.songName }}</h3>

        <!-- 副标题 -->
        <p class="team-name">{{ monf.teamName }}</p>

        <!-- 成员标签 -->
        <div class="members-tags">
            队员：
            <n-tag v-for="(member, index) in monf.members" :key="index" :bordered="false" round size="small"
                :color="getTagColor(index)">
                {{ member.memberName }}
            </n-tag>
        </div>

        <!-- 底部信息 -->
        <div class="info-section" :class="{ 'has-dynamic': dynamicValue !== 'score' }">
            <!-- 总分 -->
            <div class="info-column info-score" :class="{ 'active': activeField === 'score' }">
                <div class="label">总分</div>
                <div class="score">{{ monf.score }}</div>
            </div>

            <!-- 动态列（如果是总分则不显示，避免重复） -->
            <div v-if="dynamicValue !== 'score'" class="info-column info-score"
                :class="{ 'active': activeField === dynamicValue }">
                <div class="label">{{ dynamicLabel }}</div>
                <div class="dynamic-value">{{ getDynamicValue() }}</div>
            </div>

            <!-- 提交时间 -->
            <div class="info-column info-time" :class="{ 'active': activeField === 'createdDate' }">
                <div class="label">提交时间</div>
                <div class="time">{{ formatTime(monf.createdDate) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    monf: Monf;
    rank: number;
    activeField?: 'averageScore' | 'score' | 'rank' | 'createdDate';
    dynamicLabel?: string;
    dynamicValue?: string;
}>();

const isHovered = ref(false);

// 计算排名数字
const rankNumber = computed(() => {
    const num = typeof props.rank === 'string' ? parseInt(props.rank) : props.rank;
    return isNaN(num) ? 0 : num;
});

// 标签颜色配置
const tagColors = [
    { color: '#3B82F6', borderColor: '#3B82F6' },  // 蓝色
    { color: '#06B6D4', borderColor: '#06B6D4' },  // 青色
    { color: '#A855F7', borderColor: '#A855F7' },  // 紫色
    { color: '#F97316', borderColor: '#F97316' },  // 橙色
    { color: '#EC4899', borderColor: '#EC4899' },  // 粉色
];

const getTagColor = (index: number) => {
    const colorConfig = tagColors[index % tagColors.length];
    return {
        color: '#fff',
        borderColor: colorConfig.borderColor,
        textColor: colorConfig.color,
    };
};

// 格式化时间
const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 获取动态值
const getDynamicValue = () => {
    if (!props.dynamicValue) return '';
    const value = props.monf[props.dynamicValue as keyof Monf];
    return value !== undefined ? value : '';
};
</script>

<style scoped lang="less">
.monf-card {
    height: 100%;
    position: relative;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover,
    &.is-hover {
        background: #FFFFFF;
        box-shadow: 0px 4px 6px -4px rgba(147, 197, 253, 0.10), 0px 10px 15px -3px rgba(147, 197, 253, 0.10), 0px 0px 0px 2px rgba(96, 165, 250, 0.20), 0px 0px 0px 0px #FFFFFF;
        border: 1px solid #E2E8F0;
        transform: translateY(-2px);
    }
}

.rank-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F3F4F6;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
    z-index: 10;
    transition: all 0.3s ease;
    width: 35px;
    height: 35px;

    &.active {
        background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
        color: white;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
}

.song-name {
    color: #1E293B;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    margin: 0 0 8px 0;
    padding-right: 50px;
}

.team-name {
    color: #64748B;
    font-size: 16px;
    font-weight: 400;
    margin: 0 0 16px 0;
}

.members-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    :deep(.n-tag) {
        padding: 4px 12px;
        font-size: 13px;
        border-width: 1.5px;
    }
}

.info-section {
    display: grid;
    grid-template-columns: 1fr 2fr; // 默认两列：总分 + 提交时间
    border-top: 1px solid #E2E8F0;
    gap: 16px;
    align-items: flex-end;
    padding-top: 20px;
    margin-top: auto;

    &.has-dynamic {
        grid-template-columns: 1fr 1fr 2fr; // 三列：总分 + 动态列 + 提交时间
    }

    .info-column {
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: all 0.3s ease;
        padding: 8px;
        border-radius: 8px;
        height: 88px;

        &.active {
            background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
            transform: scale(1.05);

            .label {
                color: #3B82F6;
                font-weight: 600;
            }

            .score,
            .time {
                color: #3B82F6;
                font-weight: 700;
            }
        }

        .label {
            color: #64748B;
            font-size: 12px;
            font-weight: 400;
        }
    }

    .info-average,
    .info-score {
        .score {
            font-size: 22px;
            font-weight: 700;
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;

            &.average-score {
                font-size: 20px;
            }
        }
    }

    // 中列：动态列
    .info-dynamic {
        text-align: center;


    }

    .dynamic-value {
        font-size: 20px;
        font-weight: 600;
        color: #111827;
    }

    // 右列：提交时间
    .info-time {
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        .time {
            color: #475569;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
        }
    }
}
</style>
