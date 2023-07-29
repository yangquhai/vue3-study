<!-- 选择配件 -->
<template>
    <van-popup v-model:show="_showPopup" @closed="resetData" @opened="getAccsList" :style="{ width: '80%', height: '100%' }"
        position="right" z-index="2001">
        <form action="/">
            <van-search class="van-hairline--bottom" v-model="searchValue" :disabled="!accsList.length" placeholder="搜索配件"
                @search="debouncedOnSearch" />
        </form>

        <div class="van-list__bottom van-safe-area-bottom van-hairline--top">
            <van-button @click="_showPopup = false" type="primary" round block>返&emsp;回</van-button>
        </div>
        <div class="page-content bg-gray" data-type="accsList">

            <van-list @load="getAccsList" v-model:loading="isLoading" v-model:error="isError" :finished="loadFinished"
                :immediate-check="false" error-text="请求失败，点击重新加载" finished-text="没有更多了">
                <div @click="selectAccsItem(accsItem)" class="card flex p-12 van-haptics-feedback"
                    v-for="accsItem in accsList" :key="accsItem.id">
                    <van-tag color="var(--van-gray-3)" text-color="var(--text-color-1)" class="card-tag">
                        {{ accsItem.brand }}
                    </van-tag>
                    <van-icon
                        :name="_accsListSelected.some(item => { return item.id === accsItem.id }) ? 'checked' : 'circle'"
                        class=" txt-c-1 m-t-12 m-r-12" size="20" />
                    <div class="flex-1 van-ellipsis m-r-12">
                        <div class="m-t-12 txt-c-1 txt-bold van-ellipsis">{{ accsItem.name }}</div>
                        <div class="m-t-4">
                            <small class="txt-gray m-r-8">{{ accsItem.type }}</small>
                        </div>
                    </div>
                    <div class="card m-0 flex flex-col p-8 bg-gray">
                        <b class="txt-lg m-b-4">{{ accsItem.kcs || 0 }}</b>
                        <small class="txt-gray">库存</small>
                    </div>
                </div>
                <template #loading>
                    <van-loading class="flex flex-c m-t-32" color="var(--van-primary-color)" />
                </template>
                <template #finished>
                    <small v-if="accsList.length">
                        <van-icon name="weapp-nav" size="12" class="m-r-4" color="var(--van-gray-4)" />
                        到 底 了
                        <van-icon name="weapp-nav" size="12" class="m-l-4" color="var(--van-gray-4)" />
                    </small>
                </template>
                <template #error>
                    <small v-if="accsList.length">
                        <van-icon name="replay" size="12" class="m-r-4" />
                        请求失败，点击重新加载
                    </small>
                </template>
            </van-list>

            <van-back-top v-if="_showPopup" target=".page-content[data-type=accsList]" z-index="2002"
                bottom="calc(60px + env(safe-area-inset-bottom) + var(--van-padding-sm))" right="var(--van-padding-sm)" />
            <van-empty v-if="!accsList.length && !isLoading" :image="isSearching ? 'search' : 'default'"
                :description="isSearching ? '无搜索结果' : '暂无数据'" />
        </div>

    </van-popup>

    <van-popup v-model:show="showPopupConfirm" position="bottom" :safe-area-inset-bottom="true" z-index="2003" round>
        <div class="van-calendar__header">
            <div class="van-calendar__header-title">选择配件</div>
        </div>
        <van-cell-group>
            <van-cell title="配件信息">
                <template #value>

                    <div class="flex-1 van-ellipsis">
                        <div class="van-ellipsis">
                            <van-tag color="var(--van-gray-3)" text-color="var(--text-color-1)">
                                {{ accsItemData.brand }}
                            </van-tag>
                            <span class="txt-c-1 txt-bold m-l-8">{{ accsItemData.name }}</span>
                        </div>
                        <div class="m-t-4">
                            <small class="txt-gray">{{ accsItemData.type }}</small>
                        </div>
                    </div>
                </template>
            </van-cell>
            <van-field name="stepper" label="使用数量" input-align="right">
                <template #input>
                    <div class="flex flex-col flex-b">
                        <van-stepper v-model="accsItemData.quantity" :max="accsItemData.kcs" />
                        <small class="txt-red m-t-4">（库存：{{ accsItemData.kcs }}）</small>
                    </div>
                </template>
            </van-field>
        </van-cell-group>
        <div class="m-12 m-t-32">
            <van-button @click="throttledOnConfirmSelected" type="primary" round block>确&emsp;定</van-button>
        </div>
    </van-popup>
</template>
<script setup>

import { ref, computed, onMounted } from 'vue'
import request from '_api'
import { useDebounceFn, useVModel, useThrottleFn } from '@vueuse/core'
import { showToast } from 'vant'

const props = defineProps({
    accsListSelected: {
        // 已选择的配件
        type: Array,
        default: () => []
    },
    orderNumber: {
        // 单号
        type: String,
        required: true
    },
    showPopup: {
        type: Boolean,
        default: () => false
    }
})

const isLoading = ref(false)
const loadFinished = ref(false)
const isError = ref(false)

const emits = defineEmits(['update:accsListSelected', 'update:showPopup'])
const _accsListSelected = useVModel(props, 'accsListSelected', emits)
const _showPopup = useVModel(props, 'showPopup', emits)

const searchValue = ref('')
const isSearching = computed(() => {
    return !!searchValue.value
})

const accsList = ref([]) // 配件列表数据
const pageIndex = ref(1) // 页数
const pageSize = ref(20) // 每次加载的列表项目数
// 获取配件列表 - 滚动加载
const getAccsList = async () => {
    isLoading.value = true
    const params = {
        dh: props.orderNumber,
        pageIndex: pageIndex.value,
        pagesize: pageSize.value,
        search: searchValue.value.trim()
    }
    try {
        const res = await request.getAccsList(params)
        accsList.value = accsList.value.concat(res.data.partsData) // 滚动加载合并数据

        if (res.data.partsData.length < pageSize.value) {
            loadFinished.value = true // 加载全部完成
        }
        pageIndex.value++ // 页数+1
        isLoading.value = false

    } catch (err) {
        console.log(err)
        isError.value = true
        isLoading.value = false
    }
}

// 选择配件
const showPopupConfirm = ref(false)
const accsItemData = ref({}) // 选择配件的数据
// 1.选中某个配件，弹出编辑确认框
const selectAccsItem = (accsItem) => {
    const isSelected = _accsListSelected.value.some(item => { return item.id === accsItem.id })
    if (isSelected) {
        showToast('配件已存在')
        return
    }
    accsItemData.value = Object.assign({}, accsItem)
    accsItemData.value.quantity = 1
    showPopupConfirm.value = true
}
// 2.确认选择
const confirmSelected = async () => {

    isLoading.value = true
    const params = {
        dh: props.orderNumber,
        quantity: accsItemData.value.quantity,
        id: accsItemData.value.id,
    }
    try {
        const res = await request.addAccsItem(params)
        _accsListSelected.value.unshift(accsItemData.value)
        showPopupConfirm.value = false
        _showPopup.value = false
        showToast(res.message || '选择完成')

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
// 确认选择防抖
const throttledOnConfirmSelected = useThrottleFn(confirmSelected, 1000)

// 重置配置数据
const resetData = () => {
    accsList.value = []
    loadFinished.value = false
    pageIndex.value = 1
}

// 搜索
const onSearch = (keyword) => {
    resetData()
    getAccsList()
}
// 搜索防抖
const debouncedOnSearch = useDebounceFn(onSearch, 300)

</script>

<style lang="less" scoped>
.van-search {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100%;
}

.card-tag {
    position: absolute;
    top: 0;
    left: 0;
}

.van-list__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    padding: var(--van-padding-xs) var(--van-padding-md);
    padding-bottom: calc(var(--van-padding-xs) + constant(safe-area-inset-bottom));
    padding-bottom: calc(var(--van-padding-xs) + env(safe-area-inset-bottom));
    background-color: var(--van-background-2);
}

.page-content {
    padding-top: calc(var(--van-search-input-height) + 20px);
    padding-bottom: calc(60px + constant(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
    padding-bottom: calc(60px + env(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
}
</style>