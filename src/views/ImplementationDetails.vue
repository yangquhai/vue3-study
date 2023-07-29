<!-- 二级 - 实施单详情 -->
<template>
    <div v-if="!!cardInfo.number">

        <div role="tablist" class="van-tabbar van-tabbar--fixed van-hairline--top-bottom van-safe-area-bottom flex-r">
            <div role="tab" class="flex">
                <template v-if="pageType === '实施单'">
                    <van-button :disabled="cardInfo.status === '已完成'" :to="{
                        name: 'ImplementationProcess',
                        params: { orderNumber: cardInfo.number, pageStatus: '阶段汇报' }
                    }" type="default" plain round size="small" class="m-r-12 p-l-16 p-r-16">阶段汇报</van-button>
                    <van-button :to="{
                        name: 'ImplementationProcess',
                        params: { orderNumber: cardInfo.number, pageStatus: '回执交单' }
                    }" type="primary" round size="small" class="m-r-12 p-l-16 p-r-16">回执交单</van-button>
                </template>
                <template v-else>
                    <van-button @click="openPopupAppointment(cardInfo.datestart, cardInfo.dateend, cardInfo.number)"
                        :disabled="cardInfo.status === '已完成'" type="primary" round size="small"
                        class="m-r-12 p-l-16 p-r-16">预约客户</van-button>
                    <appointment-date v-model:showPopup="showPopupAppointment"
                        v-model:dataAppointment="optionAppointment" />
                </template>
            </div>
        </div>

        <div class="page-content">
            <div class="card">
                <div class="card-header"><b>客户信息</b></div>
                <div class="card-content">
                    <van-cell-group class="van-cell-group-1">
                        <div class="card-content-inner p-t-8">
                            <div>
                                <CallRecord :phoneNumber="cardInfo.tel" :pageType="pageType" :orderNumber="orderNumber">
                                    <template #default>
                                        <span class="flex flex-wrap p-b-4 txt-c-1">
                                            <span class="m-r-8 txt-lg m-b-4">{{ cardInfo.name }}</span>
                                            <span class="flex flex-l flex-1">
                                                <van-icon name="phone-circle" size="16px" class="m-r-4" />
                                                <span>{{ cardInfo.tel }}</span>
                                                <van-tag v-if="cardInfo.unionstatus === '未电联'"
                                                    color="var(--van-primary-color-p15)"
                                                    text-color="var(--van-primary-color)" class="m-l-8">未电联</van-tag>
                                                <van-tag v-else color="var(--van-green-color-p15)"
                                                    text-color="var(--van-green)" class="m-l-8">已电联</van-tag>
                                            </span>
                                        </span>
                                    </template>
                                </CallRecord>

                            </div>
                            <div class="flex flex-l flex-t txt-gray">
                                <van-icon name="location" size="16px" class="m-r-4" />
                                <span>{{ cardInfo.address }}</span>
                            </div>
                        </div>
                        <van-cell v-for="field in cardInfoOther" :title="field.name" :value="cardInfo[field.key]" />
                    </van-cell-group>
                </div>

                <div class="card-footer flex p-0">

                    <CallRecord :phoneNumber="cardInfo.tel" :pageType="pageType" :orderNumber="orderNumber"
                        class="flex flex-c flex-1 p-12">
                        <template #default>
                            <van-icon name="phone-o" size="16px" class="txt-primary m-r-4" />
                            <span class="txt-gray">联系客户</span>
                        </template>
                    </CallRecord>
                    <div class="flex flex-c flex-1 p-12">
                        <van-icon name="guide-o" size="16px" class="txt-primary m-r-4" />
                        <span class="txt-gray">打开导航</span>
                    </div>
                </div>

            </div>


            <div class="card">

                <div class="card-header"><b>实施信息</b></div>

                <div class="card-content">
                    <div v-if="productList.length" class="card" v-for="productItem in productList">

                        <div class="card-header">{{ productItem.brand }}</div>
                        <div class="card-content">
                            <van-cell-group class="van-cell-group-1">
                                <van-cell :title="field.key" :value="field.value" v-for="field in productItem.fields" />
                            </van-cell-group>
                        </div>
                    </div>

                    <van-empty v-else description="暂无数据" class="p-t-0 p-b-0" />
                </div>

            </div>
            <van-back-top target=".page-content"
                bottom="calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-padding-sm))"
                right="var(--van-padding-sm)" />
        </div>
    </div>
    <van-empty v-if="!!!cardInfo.number && !isLoading" description="暂无数据" />

    <van-loading v-if="isLoading" class="flex flex-c m-t-32" color="var(--van-primary-color)" />
</template>

<script setup>
import { ref } from 'vue'
import request from '_api'

const props = defineProps({
    pageType: {
        // 页面类型
        type: String,
        required: true
    },
    orderNumber: {
        // 单号
        type: String,
        required: true
    }
})
const isLoading = ref(false)

const cardInfo = ref([]) // 客户的固定信息
const cardInfoOther = ref([]) // 客户的自定义信息
const productList = ref([]) // 客户的产品信息

// 获取页面数据
const getImplementationDetails = async () => {
    isLoading.value = true
    try {
        const res = await request.getImplementationDetails({ type: props.pageType, dh: props.orderNumber })
        cardInfo.value = res.data.listData
        cardInfoOther.value = res.data.zdList
        productList.value = res.data.productList

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
getImplementationDetails()

// 打开预约popup
const showPopupAppointment = ref(false) // 显示预约popup
const optionAppointment = ref({}) // 显示预约popup
const openPopupAppointment = (minDate, maxDate, orderNum) => {
    showPopupAppointment.value = true
    optionAppointment.value.minDateAppointment = new Date(minDate)
    optionAppointment.value.maxDateAppointment = new Date(maxDate)
    optionAppointment.value.orderNumber = orderNum
}
</script>

<style lang="less" scoped>
.page-content {
    padding-bottom: calc(var(--van-tabbar-height) + constant(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
    padding-bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
}

.card-content>.card {
    filter: invert(.025);

    &:first-child {
        margin-top: 0;
    }
}
</style>
