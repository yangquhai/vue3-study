<!-- 打开导航 -->
<template>
    <span @click="openNav">
        <slot />
    </span>
</template>
  
<script setup>
import { getSystemAndBrowser } from '_helpers'
import { showConfirmDialog, showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'

const props = defineProps({
    address: {
        type: String
    },
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    }
})

const { os, browser } = getSystemAndBrowser()
// 根据经纬度打开导航
const openNav = () => {
    try {
        if (os === 'iOS') {
            document.location = `protocol://openLocation+&Tscan=1+${props.lat},${props.lng}`

        } else if (os === 'Android') {
            android.openLocation(props.address, props.lng, props.lat)

        } else {
            showToast('请手动打开导航')
        }
    } catch (error) {
        showToast('请手动打开导航')
    }
}
</script>