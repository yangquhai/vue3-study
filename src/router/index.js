import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/Index.vue'
import NotFound from '../views/NotFound.vue'
import ImplementationList from '../views/ImplementationList.vue'
import ImplementationDetails from '../views/ImplementationDetails.vue'
import ImplementationProcess from '../views/ImplementationProcess.vue'
import PerformanceReportingList from '../views/PerformanceReportingList.vue'
import CheckInAndTakePhotos from '../views/CheckInAndTakePhotos.vue'
import WapList from '../views/WapList.vue'

const title = '亿建通协同'
const routes = [
    {
        path: '/:tszid/',
        name: 'Index',
        component: Index,
        meta: {
            title: title
        }
    }, {
        // 404 页面
        path: '/404',
        name: 'NotFound',
        component: NotFound
    }, {
        // 通配符路由，匹配所有未匹配的路由到 404 页面
        path: '/:catchAll(.*)',
        redirect: '/404'
    }, {
        path: '/implementation-list',
        name: 'ImplementationList',
        component: ImplementationList,
        meta: {
            title: '实施单'
        }
    }, {
        path: '/implementation-details/:tszid/pageType/:pageType/orderNumber/:orderNumber/',
        name: 'ImplementationDetails',
        component: ImplementationDetails,
        meta: {
            title: '实施单信息'
        },
        props: route => ({
            pageType: route.params.pageType,
            orderNumber: route.params.orderNumber
        }),
        beforeEnter: (to, from, next) => {
            document.title = to.params.pageType + '信息' // 根据页面状态设置标题
            next()
        }
    }, {
        path: '/implementation-process/:tszid/orderNumber/:orderNumber/pageStatus/:pageStatus/',
        name: 'ImplementationProcess',
        component: ImplementationProcess,
        meta: {
            title: '实施单处理'
        },
        props: route => ({
            orderNumber: route.params.orderNumber,
            pageStatus: route.params.pageStatus || '回执交单'
        }),
        beforeEnter: (to, from, next) => {
            document.title = to.params.pageStatus // 根据页面状态设置标题
            next()
        }
    }, {
        path: '/performance-reporting-list/',
        name: 'PerformanceReportingList',
        component: PerformanceReportingList,
        meta: {
            title: '业绩播报列表'
        }
    }, {
        path: '/check-in-and-take-photos/:settingID/orderNumber/:orderNumber/clientNumber/:clientNumber/type/:type/detailsType/:detailsType/statusType/:statusType/',
        name: 'CheckInAndTakePhotos',
        component: CheckInAndTakePhotos,
        meta: {
            title: '签到拍照'
        },
        props: route => ({
            settingID: route.params.settingID,
            orderNumber: route.params.orderNumber,
            clientNumber: route.params.clientNumber,
            type: route.params.type,
            detailsType: route.params.detailsType,
            statusType: route.params.statusType
        }),
    },
    {
        path: '/wap-list/Tformnamecn/:Tformnamecn/Turl/:Turl/Ttablename/:Ttablename/Tsystem_lcmc/:Tsystem_lcmc/',
        // ?Ttablename=bxd_main&Turl=bxd.aspx&Tformnamecn=Tformnamecn&Tsystem_lcmc=4366&Tsystem_lcmc=/
        name: 'WapList',
        component: WapList,
        meta: {
            title: '意向客户跟踪列表'
        },
        props: route => ({
            Tformnamecn: route.params.Tformnamecn,
            Turl: route.params.Turl,
            Ttablename: route.params.Ttablename,
            Tsystem_lcmc: route.params.Tsystem_lcmc,
        }),
        // beforeEnter: (to, from, next) => {
        //     document.title = to.params.Ttablename  // 根据页面状态设置标题
        //     next()
        // }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // 更新页面标题
    document.title = to.meta.title || title
    next()
})

export default router
