import { defineStore } from 'pinia'
// 刷新实施和后续列表的数据
export const useReloadImplListStore = defineStore('reloadImplList', {
    state: () => ({
        shouldReload: {
            type: null,
            reload: false
        },
    }),
    actions: {
        setShouldReloadImplList(type, value) {
            this.shouldReload = {
                type: type,
                reload: value
            }
        },
    }
})