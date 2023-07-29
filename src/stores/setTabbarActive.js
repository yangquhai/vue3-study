import { defineStore } from 'pinia'
// 记录一级页面tabbar的当前索引标识
export const useSetTabbarActiveStore = defineStore('setTabbarActive', {
    state: () => ({
        currentTab: 0
    }),
    actions: {
        setCurrentTab(index) {
            this.currentTab = index
        }      
    }
})