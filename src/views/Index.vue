<template>
    <keep-alive><implementation-list v-if="active === 0" :pageType="tabbarTitles[0]" /></keep-alive>
    <keep-alive><implementation-list v-if="active === 1" :pageType="tabbarTitles[1]" /></keep-alive>
    <van-tabbar v-model="active" @change="onChangeTabbar">
        <van-tabbar-item v-for="(item, itemIndex) in tabbarTitles"
            :icon="active === itemIndex ? tabbarIcons[itemIndex] : `${tabbarIcons[itemIndex]}-o`">
            {{ item }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
import { useSetTabbarActiveStore } from '_stores/setTabbarActive'
import ImplementationList from './ImplementationList.vue'

const store = useSetTabbarActiveStore() // 控制路由返回当前页后的tabbar状态和之前一致
const active = ref(store.currentTab)
const tabbarTitles = ['实施单', '后续单']
const tabbarIcons = ['wap-home', 'todo-list']

const onChangeTabbar = (index) => {
    document.title = tabbarTitles[index]
    store.setCurrentTab(index)
}

</script>
