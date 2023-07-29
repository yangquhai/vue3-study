<!-- 拨打电话并记录 -->
<template>
    <a :href="'tel:' + phoneNumber" @click="throttledOnCall">
        <slot />
    </a>
</template>
  
<script setup>
import { ref } from 'vue'
import request from '_api'
import { useThrottleFn } from '@vueuse/core'

const props = defineProps({
    phoneNumber: {
        type: String,
        required: true
    },
    pageType: {
        type: String,
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    }
})

// 记录拨打电话的操作
const recordPhoneCall = () => {
    try {
        request.recordPhoneCall({ type: props.pageType, dh: props.orderNumber })
    } catch (err) {
        console.log(err)
    }
}
// 拨打电话防抖
const throttledOnCall = useThrottleFn(recordPhoneCall, 10000)
</script>