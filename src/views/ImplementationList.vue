<!-- 一级 - 实施单/后续单 -->
<template>
    <van-tabs v-model:active="tabActive" ref="targetEl">
        <template v-for="(tabType, tabIndex) in tabsType">
            <van-tab :title="`${tabType} ${cardListData[tabIndex].length}`">
                <div class="page-content" :data-type="`tab${tabIndex}`">
                    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
                        <CardListImplementation :cardList="cardListData[tabIndex]" :pageType="pageType"
                            :otherFields="cardListOther" />
                        <van-empty v-if="!cardListData[tabIndex].length && !isLoading"
                            :image="isSearching ? 'search' : 'default'" :description="isSearching ? '无搜索结果' : '暂无数据'" />
                        <van-loading v-if="isLoading" class="flex flex-c m-t-32" color="var(--van-primary-color)" />
                        <van-back-top v-if="isVisible && tabActive === tabIndex"
                            :target="`.page-content[data-type=tab${tabIndex}]`"
                            bottom="calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-padding-sm))"
                            right="var(--van-padding-sm)" />
                    </van-pull-refresh>
                </div>
            </van-tab>
        </template>
    </van-tabs>
    <van-search v-model="searchValue" :disabled="!cardListOrign.length" placeholder="搜索客户姓名、地址或手机号"
        @update:modelValue="debouncedOnSearch" />
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import request from '_api'
import { useReloadImplListStore } from '_stores/reloadImplList'
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
    pageType: {
        type: String,
        required: true
    }
})


const tabActive = ref(0)
const isLoading = ref(false)
const searchValue = ref('')
const isSearching = computed(() => {
    return !!searchValue.value
})
// 根据pageContent是否看见，控制返回顶部按钮是否可见
const targetEl = ref(null)
const isVisible = ref(false)

const { isActive, pause, resume } = useIntersectionObserver(
    targetEl,
    ([{ isIntersecting }]) => {
        isVisible.value = isIntersecting
    }
)


const tabsType = props.pageType === '实施单' ? ['未完成', '已完成'] : ['未预约', '已预约'] // 单的两种状态，根据两种状态来处理数据

const cardListOrign = ref([]) // 客户的固定信息源数据
const cardList = ref([]) // 客户的固定信息
const cardListOther = ref([]) // 客户的自定义信息
const cardListData = computed(() => {
    if (cardList.value) {
        let cData = []
        tabsType.forEach(type => {
            cData.push(cardList.value.filter(item => { return item.status === type }))
        });
        return cData
    }
})

// 获取页面数据
const getImplementationList = async () => {
    isLoading.value = true
    try {
        const res = await request.getImplementationList({ type: props.pageType })
        cardList.value = res.data.listData
        cardListOrign.value = res.data.listData
        cardListOther.value = {
            style: res.data.style || '',
            customFields: res.data.zdList
        }

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
getImplementationList()

// 下拉刷新页面数据
const onRefresh = () => {
    searchValue.value = ''
    getImplementationList()
}

// 监听 实施详情 状态的变化以刷新列表数据
const store = useReloadImplListStore()
watchEffect(() => {
    if (store.shouldReload.reload && store.shouldReload.type === props.pageType) {
        onRefresh()
    }
})


// 搜索
const onSearch = (keyword) => {
    cardList.value = cardListOrign.value
    if (keyword.trim() === '') {
        cardList.value = cardListOrign.value
    } else {
        // 将关键字拆分成数组
        const searchKeywords = keyword.trim().split(' ') // 以空格分隔的多个关键字
        const searchKeys = ['address', 'name', 'tel'] // 要搜索的键名
        for (let keyword of searchKeywords) {
            cardList.value = cardList.value.filter(item => {
                for (let key of searchKeys) {
                    if (item[key].includes(keyword)) {
                        return true
                    }
                }
                return false
            })
        }
    }
}
// 搜索防抖
const debouncedOnSearch = useDebounceFn(onSearch, 300)

</script>

<style lang="less" scoped>
:deep(.van-tabs__wrap) {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100vw;
}

:deep(.van-tabs__content) {
    height: 100vh;
}

.van-search {
    position: fixed;
    top: var(--van-tabs-line-height);
    z-index: 2;
    width: 100vw;
}

.page-content {
    padding-top: calc(var(--van-tabs-line-height) + var(--van-search-input-height) + 20px);
    padding-bottom: calc(var(--van-tabbar-height) + constant(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
    padding-bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
}
</style>
