<template>
    <van-config-provider theme="light">
        <router-view></router-view>
    </van-config-provider>
</template>
  
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App'
})
</script>