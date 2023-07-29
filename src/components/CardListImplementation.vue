<!-- 实施单/后续单列表 -->
<template>
    <div class="card" v-for="(cardItem, cardIndex) in cardList" :key="cardItem.number">

        <div class="card-header flex p-0">

            <template v-if="otherFields.style === 'style1'">
                <router-link :to="{
                    name: 'ImplementationDetails',
                    params: { pageType: pageType, orderNumber: cardItem.number }
                }" class="txt-default txt-bold p-12">
                    {{ cardItem.number }}
                    <van-icon name="arrow" class="txt-gray m-l-4" />
                </router-link>

                <small class="p-12 txt-gray">{{ cardItem.date }}&nbsp;{{ cardItem.time }}</small>
            </template>

            <template v-else>
                <CallRecord :phoneNumber="cardItem.tel" :pageType="pageType" :orderNumber="cardItem.number" class="flex-1">
                    <template #default>
                        <span class="flex flex-wrap p-12 txt-c-1">
                            <span class="m-r-8">{{ cardItem.name }}</span>
                            <span class="flex flex-l flex-1">
                                <van-icon name="phone-circle" size="16px" class="m-r-4" />
                                <span>{{ cardItem.tel }}</span>
                            </span>
                        </span>
                    </template>
                </CallRecord>

                <router-link :to="{
                    name: 'ImplementationDetails',
                    params: { pageType: pageType, orderNumber: cardItem.number }
                }" class="flex txt-primary txt-bold p-12">
                    <small class="m-r-4">{{ cardItem.date }}&nbsp;{{ cardItem.time }}</small>
                    <van-icon name="arrow" />
                </router-link>
            </template>
        </div>
        <div class="card-content">
            <template v-if="otherFields.style === 'style1'">
                <van-cell-group class="van-cell-group-1">

                    <van-cell title="客户信息">
                        <template #value>
                            <div>
                                <CallRecord :phoneNumber="cardItem.tel" :pageType="pageType" :orderNumber="cardItem.number">
                                    <template #default>
                                        <span class="flex flex-wrap p-b-4 txt-c-1">
                                            <span class="m-r-8">{{ cardItem.name }}</span>
                                            <span class="flex flex-l flex-1">
                                                <van-icon name="phone-circle" size="16px" class="m-r-4" />
                                                <span>{{ cardItem.tel }}</span>
                                                <van-tag v-if="cardItem.unionstatus === '未电联'"
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
                                <span>{{ cardItem.address }}</span>
                            </div>
                        </template>
                    </van-cell>
                    <van-cell v-for="field in otherFields.customFields" :title="field.name" :value="cardItem[field.key]" />
                </van-cell-group>
            </template>

            <template v-else>
                <div class="flex flex-l flex-t txt-gray p-l-12 p-r-12">
                    <van-icon name="location" size="14" class="m-r-4" />
                    <span>{{ cardItem.address || '无' }}</span>
                </div>
                <div class="p-l-12 p-r-12 m-t-8">
                    <van-tag v-if="cardItem.unionstatus === '未电联'" color="var(--van-primary-color-p15)"
                        text-color="var(--van-primary-color)" class="m-r-4">未电联</van-tag>
                    <van-tag v-else color="var(--van-green-color-p15)" text-color="var(--van-green)"
                        class="m-r-4">已电联</van-tag>
                </div>
                <van-row v-show="otherFields.customFields.col.length" gutter="4" class="m-t-12 m-r-12 m-l-12">
                    <van-col span="8" v-for="colItem in otherFields.customFields.col" class="flex flex-col flex-l">
                        <small class="txt-gray">{{ colItem.name }}</small>
                        <span class="m-t-4 m-b-12">{{ cardItem[colItem.key] }}</span>
                    </van-col>
                </van-row>
                <div class="card m-t-0 bg-blue-p5 txt-c-1">
                    <van-row class="m-12 txt-xs" gutter="4" v-for="cardBlock in otherFields.customFields.card">
                        <van-col span="4" class="txt-gray">{{ cardBlock.name }}</van-col>
                        <van-col span="20">
                            <van-text-ellipsis class="m-l-8" rows="3" :content="cardItem[cardBlock.key]" expand-text="展开"
                                collapse-text="收起" />
                        </van-col>
                    </van-row>
                    <!-- <small class="flex flex-t m-12" v-for="cardBlock in otherFields.customFields.card">
                        <span class="txt-gray">{{ cardBlock.name }}:</span>
                        <van-text-ellipsis class="flex-1 m-l-8" rows="3" :content="cardItem[cardBlock.key]" expand-text="展开"
                            collapse-text="收起" />
                    </small> -->
                </div>
            </template>
        </div>

        <div class="card-footer flex p-0 van-hairline--top" v-if="pageType === '实施单'">

            <CallRecord :phoneNumber="cardItem.tel" :pageType="pageType" :orderNumber="cardItem.number"
                class="flex flex-col flex-1 p-12">
                <template #default>
                    <van-icon name="phone-o" size="20px" class="txt-primary" />
                    <small class="txt-gray m-t-4">联系客户</small>
                </template>
            </CallRecord>

            <OpenNav :address="cardItem.address" :lat="cardItem.lat || '0'" :lng="cardItem.lng || '0'"
                class="flex flex-col flex-1 p-12">
                <van-icon name="guide-o" size="20px" class="txt-primary" />
                <small class="txt-gray m-t-4">打开导航</small>
            </OpenNav>

            <router-link v-if="cardItem.status === '未完成'" :to="{
                name: 'ImplementationProcess',
                params: { orderNumber: cardItem.number, pageStatus: '阶段汇报' }
            }" class="flex flex-col flex-1 p-12">
                <van-icon name="records" size="20px" class="txt-primary" />
                <small class="txt-gray m-t-4">阶段汇报</small>
            </router-link>

            <router-link :to="{
                name: 'ImplementationProcess',
                params: { orderNumber: cardItem.number, pageStatus: '回执交单' }
            }" class="flex flex-col flex-1 p-12">
                <van-icon name="sign" size="20px" class="txt-primary" />
                <small class="txt-gray m-t-4">回执交单</small>
            </router-link>

        </div>

        <div class="card-footer flex flex-r" v-if="pageType === '后续单' && cardItem.status === '未预约'">
            <van-button @click="openPopupAppointment(cardItem.datestart, cardItem.dateend, cardItem.number)" type="primary"
                plain round size="small" class="p-l-24 p-r-24">预&nbsp;约</van-button>
        </div>

    </div>

    <template v-if="pageType === '后续单'">
        <appointment-date v-model:showPopup="showPopupAppointment" v-model:dataAppointment="optionAppointment" />
    </template>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    cardList: {
        // 列表数据，已区分业务状态
        type: Array,
        default: () => []
    },
    pageType: {
        // 页面类型
        type: String,
        required: true
    },
    otherFields: {
        // 列表数据中的自定义显示数据的key，已包含在cardList中
        type: Object,
        default: () => { }
    }
})


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
