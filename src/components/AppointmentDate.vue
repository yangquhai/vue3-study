<!-- 后续单 - 预约 -->
<template>
    <van-calendar title="选择上门日期" v-model:show="_showPopup" :defaultDate="null" :formatter="formatterAppointment"
        :style="{ height: '90vh' }" :minDate="dataAppointment.minDateAppointment" :maxDate="dataAppointment.maxDateAppointment" @select="selectDate">

        <template #footer>
            <div class="van-hairline--surround card m-l-0 m-r-0 m-b-24">
                <van-cell-group>
                    <van-field v-model="timeSlot" is-link readonly label="时间段" placeholder="选择时间段"
                        @click="showPickerTimeSlot = true" />
                </van-cell-group>
            </div>
            <van-button @click="confirmPopupAppointment" type="primary" round block class="m-b-12">确认预约</van-button>
        </template>
    </van-calendar>

    <van-popup v-model:show="showPickerTimeSlot" round position="bottom">
        <van-picker :columns="columnsTimeSlots" @cancel="showPickerTimeSlot = false" @confirm="onConfirmPickerTimeSlot" />
    </van-popup>
</template>

<script setup>
import { ref } from 'vue'
import request from '_api'
import { useReloadImplListStore } from '_stores/reloadImplList'
import { useThrottleFn, useDateFormat, useVModel } from '@vueuse/core'
import { showConfirmDialog, showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'

const props = defineProps({
    showPopup: {
        // 单号
        type: Boolean,
        default: () => false
    },
    dataAppointment: {
        // 日期配置数据
        type: Object,
        required: true,
        default: () => {}
    }
})

const emits = defineEmits(['update:showPopup'])
const _showPopup = useVModel(props, 'showPopup', emits)

// 日历自定义
let dateAppointment = null // 选择的预约日期
const minDateAppointment = ref(new Date()) // 最小可预约日期
const ONE_DAY_IN_MILLISECONDS = 86400000
const maxDateAppointment = ref(new Date(new Date().getTime() + (5 * ONE_DAY_IN_MILLISECONDS))) // 最大可预约日期 - 默认5天内

const formatterAppointment = (day) => {
    if (day.type === 'selected') {
        day.bottomInfo = '安排上门'
    }
    return day
}
const selectDate = (date) => {
    dateAppointment = date
    showPickerTimeSlot.value = true
}

// 时间段
const timeSlot = ref('全天')
const columnsTimeSlots = [
    { text: '全天', value: '全天' },
    { text: '下午', value: '下午' },
    { text: '上午', value: '上午' }
]
const showPickerTimeSlot = ref(false) // 显示时间段picker
const onConfirmPickerTimeSlot = ({ selectedOptions }) => {
    // 确认选择时间段
    showPickerTimeSlot.value = false
    timeSlot.value = selectedOptions[0].text
}

// 确认预约
const confirmPopupAppointment = () => {
    if (dateAppointment) {
        // 已选择日期
        const dateFormatted = useDateFormat(dateAppointment, 'YYYY-MM-DD')
        const dateFormattedCN = useDateFormat(dateAppointment, 'MM月DD号')
    console.log('显示时间段picker',dateFormattedCN,dateFormatted)

        const msgContent = `您预约上门的时间为<b class="txt-primary">${dateFormattedCN.value} ${timeSlot.value}</b><p class="m-t-4">提交后将不能修改，确认继续吗？</p>`
        showConfirmDialog({
            title: '预约信息',
            allowHtml: true,
            message: msgContent
        }).then(() => {
            // 点击确认
            throttledOnConfirmPopupAppointment(dateFormatted.value, timeSlot.value)
        }).catch(() => {
            // on cancel
        })
    } else {
        showToast('请选择日期')
    }
}

// 监听 实施详情 状态的变化以刷新列表数据
const store = useReloadImplListStore()
const onConfirmPopupAppointment = async (date, timeSlot) => {

    showLoadingToast({
        message: '加载中...',
        forbidClick: true
    })
    try {
        const res = await request.confirmAppointment({ date: date, time: timeSlot, dh: props.dataAppointment.orderNumber })
        showSuccessToast(res.message || '预约成功')
        _showPopup.value = false
        store.setShouldReloadImplList('后续单', true)

    } catch (err) {
        showFailToast('预约失败')
        console.log(err)
    }
}
// 确认预约防抖
const throttledOnConfirmPopupAppointment = useThrottleFn(onConfirmPopupAppointment, 1000)

</script>
