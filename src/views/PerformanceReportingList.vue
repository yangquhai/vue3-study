<!-- 业绩播报列表 -->
<!-- 选择配件 -->
<template>
    <div role="tablist" class="van-tabbar van-tabbar--fixed flex-c" :style="{ zIndex: 10000 }">
        <div role="tab" class="flex flex-1">
            <van-icon name="arrow-left" class="p-12" size="20" v-show="!!pageDate" @click="changeDay(-1, false)" />

            <van-field v-model="pageDate" @focus="showCale = true" placeholder="日期筛选" input-align="center"
                class="bg-none flex-1" autocomplete="off" readonly>
                <template #button>
                    <i @click="clearDate()" v-show="!!pageDate"
                        class="van-badge__wrapper van-icon van-icon-clear van-field__clear">
                    </i>
                </template>
            </van-field>
            <van-icon name="arrow" class="p-12" size="20" v-show="!!pageDate" @click="changeDay(1, false)" />
            <van-calendar v-model:show="showCale" @confirm="selectDate" :minDate="minDateSelect" :maxDate="maxDateSelect" />
        </div>
    </div>
    <div class="page-content bg-gray" data-type="msgList">

        <van-list @load="getPerfReportList" v-model:loading="isLoading" v-model:error="isError" :finished="loadFinished"
            :immediate-check="false" error-text="请求失败，点击重新加载" finished-text="没有更多了">
            <template v-for="(msgItem, msgIndex) in msgList">

                <div class="flex flex-c m-t-12"><van-tag color="var(--van-gray-5)">{{ msgItem.rq }}</van-tag></div>
                <div class="card">
                    <div class="card-header p-b-0">
                        <b>{{ msgItem.title }}</b>
                    </div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <div v-html="msgItem.fsnr" class="txt-gray"></div>
                            <van-image :src="msgItem.imgUrl" width="100%" fit="cover" class="card m-l-0 m-b-0"
                                @click="previewImg(msgIndex)" :style="{ display: 'block', paddingBottom: '50%' }"
                                show-loading lazy-load>
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                        </div>
                    </div>
                </div>
            </template>
            <template #loading>
                <van-loading class="flex flex-c m-t-32" color="var(--van-primary-color)" />
            </template>
            <template #finished>
                <TheEnd v-if="msgList.length" />
            </template>
            <template #error>
                <small v-if="msgList.length">
                    <van-icon name="replay" size="12" class="m-r-4" />
                    请求失败，点击重新加载
                </small>
            </template>
        </van-list>

        <van-image-preview ref="imgPreviewer" v-model:show="showImgPreview" :images="imgList"
            :start-position="imgPreviewIndex" @change="swipeImgGroupDate" closeable />

        <van-back-top target=".page-content[data-type=msgList]"
            bottom="calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-padding-sm))"
            right="var(--van-padding-sm)" />
        <van-empty v-if="!msgList.length && !isLoading" :image="isFiltering ? 'search' : 'default'"
            :description="isFiltering ? '没有数据' : '暂无数据'" />
    </div>
</template>
<script setup>

import { ref, computed } from 'vue'
import request from '_api'
import { useDebounceFn, useDateFormat } from '@vueuse/core'
import { showToast, showLoadingToast, showFailToast, closeToast } from 'vant'


const isLoading = ref(false)
const loadFinished = ref(false)
const isError = ref(false)
const isFiltering = computed(() => {
    if (!!pageDate.value) {
        return true
    } else {
        return false
    }
})

const showCale = ref(false)

const msgList = ref([]) // 列表数据
const imgList = ref([]) // 图片数据
const pageIndex = ref(0) // 页数
const pageSize = ref(20) // 每次加载的列表项目数
const pageDate = ref('') // 筛选条件：日期

// 获取配件列表 - 滚动加载
const getPerfReportList = async () => {
    isLoading.value = true
    const params = {
        pageIndex: pageIndex.value,
        pagesize: pageSize.value,
        rq: pageDate.value
    }
    try {
        const res = await request.getPerfReportList(params)
        msgList.value = msgList.value.concat(res.data.msgList) // 滚动加载合并数据
        msgList.value.forEach(imgItem => {
            imgList.value.push(imgItem.imgUrl) // 滚动加载合并图片数据
        })

        if (res.data.msgList.length < pageSize.value) {
            loadFinished.value = true // 加载全部完成
        }
        pageIndex.value++ // 页数+1
        isLoading.value = false
        closeToast()

    } catch (err) {
        console.log(err)
        isError.value = true
        isLoading.value = false
        showImgPreview.value = false
        showFailToast('加载失败，请重试')
    }
}
getPerfReportList()


// 筛选日期
const maxDateSelect = ref(new Date()) // 最大可选日期 - 当天
maxDateSelect.value.setHours(0, 0, 0, 0)
const ONE_DAY_IN_MILLISECONDS = 86400000
const minDateSelect = ref(new Date(maxDateSelect.value.getTime() - (365 * ONE_DAY_IN_MILLISECONDS))) // 最小可选日期 - 默认365天前
// 选择日期
const selectDate = (value) => {
    showCale.value = false
    pageDate.value = useDateFormat(value, 'YYYY-MM-DD').value
    resetData()
}
// 清除日期筛选
const clearDate = () => {
    pageDate.value = ''
    resetData()
}
// 切换日期
const changeDay = (days, forbidClick) => {

    showLoadingToast({
        message: '加载中...',
        forbidClick: forbidClick ? true : forbidClick
    })
    
    const pageDateObj = pageDate.value == '' ? new Date() : new Date(pageDate.value)
    pageDateObj.setHours(0, 0, 0, 0)
    let isChange = false // 是否可以切换日期
    if (days > 0) {
        // 当天往后切不了看明天数据
        if (pageDateObj < maxDateSelect.value) {
            isChange = true
        }
    } else {
        // 365天之前也切不了
        if (pageDateObj > minDateSelect.value) {
            isChange = true
        }
    }

    if (isChange) {
        const currDate = new Date(pageDateObj.getTime() + (days * ONE_DAY_IN_MILLISECONDS))
        pageDate.value = useDateFormat(currDate, 'YYYY-MM-DD').value
        debounceOnChangeDay()
    } else {
        showToast('没有可选日期了')
    }
}


// 预览图片
const showImgPreview = ref(false)
const imgPreviewIndex = ref(0) // 图片索引
const imgPreviewer = ref(null)
const previewImg = (msgIndex) => {
    showImgPreview.value = true
    imgPreviewIndex.value = msgIndex
    // showImagePreview({
    //     images: imgList.value,
    //     startPosition: msgIndex,
    //     closeable: true
    // })
}


// 预览图片在第一或最后一张时的切换日期
const swipeImgGroupDate = (index) => {
    const swipeIndexPrev = imgPreviewIndex.value
    setTimeout(() => {
        imgPreviewIndex.value = index
        if (imgPreviewIndex.value == 0 && swipeIndexPrev == imgList.value.length - 1) {
            changeDay(1)

        }
        if (imgPreviewIndex.value == imgList.value.length - 1 && swipeIndexPrev == 0) {
            changeDay(-1)
        }
    }, 0)
}


// 重置配置数据
const resetData = () => {
    msgList.value = []
    imgList.value = []
    loadFinished.value = false
    pageIndex.value = 0
    getPerfReportList().then(() => {
        imgPreviewIndex.value = 0
        if (msgList.value.length) {
            imgPreviewer.value.swipeTo(imgPreviewIndex.value) // 图片预览切换到第一张
        } else {
            showImgPreview.value = false
        }
    })
}
// 切换日期防抖
const debounceOnChangeDay = useDebounceFn(resetData, 500)

</script>

<style lang="less" scoped>
:deep(.card .van-image__img) {
    position: absolute;
}

.van-tabbar {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .van-cell::after {
        border-bottom: none;
    }

    :deep(.van-field__button) {
        position: absolute;
        right: 0;
    }
}

:deep(.van-field__control::placeholder) {
    color: var(--van-black) !important;
}

.page-content {
    padding-bottom: calc(var(--van-tabbar-height) + constant(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
    padding-bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
}
</style>