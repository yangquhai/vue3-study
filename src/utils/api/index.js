import request from '_request'
import { useRoute } from 'vue-router'

let route = null
function getCommonParam() {
    if (!route) {
        route = useRoute()
    }
    const commonParam = {
        // tszid: route.params.tszid // 后端所需的全局参数
    }
    return commonParam
}

const APIFiles = {
    colloboration: './data/FormService_xt.aspx?Tmethod=',
    colloborationList:'./data/list_bill_wap.aspx?Tmethod=',
    oneClientOneGroup: './data/FormService_ykyq.aspx?Tmethod=',
}

const contentType = {
    FormData: { 'Content-Type': 'multipart/form-data' }
}

/***-业绩播报列表页面***/
// 获取绩播报列表数据
export function getPerfReportList(params) {
    return request.post(APIFiles.colloboration, 'xtGetYjbbList', params, contentType.FormData)
}



/***-签到拍照-***/
// 获取签到拍照页面数据
export function getCheckInATakePhotosData(params) {
    return request.post(APIFiles.oneClientOneGroup, 'getCheckInATakePhotosData', params, contentType.FormData)
}
// 上传实施单处理拍照图片
export function uploadCheckInATakePhotosImgs(params) {
    return request.post(APIFiles.oneClientOneGroup, 'generalUploadImg', params, contentType.FormData)
}
// 删除实施单处理拍照图片
export function delCheckInATakePhotosImgs(params) {
    return request.post(APIFiles.oneClientOneGroup, 'delCheckInATakePhotos', params, contentType.FormData)
}
// 获取签到拍照页面数据
export function confirmCheckInATakePhotosData(params) {
    return request.post(APIFiles.oneClientOneGroup, 'confirmCheckInATakePhotosData', params, contentType.FormData)
}




/***-实施单处理页面-***/
// 获取实施单处理数据
export function getImplementationProcess(params) {
    return request.post('getExecutionDisposalInfo', { ...getCommonParam(), ...params })
}
// 上传实施单处理拍照图片
export function uploadImplImg(params) {
    const comParams = getCommonParam()
    for (const key in comParams) {
        params.append(key, comParams[key])
    }
    return request.post('uploadImg', params)
}



/***-通用接口-***/
// 记录拨打电话的操作
export function recordPhoneCall(params) {
    return request.post('saveCallRecords', { ...getCommonParam(), ...params })
}

/***-获取卡片信息以及下拉框数据-***/

export function getUserInfo(params) {
    return request.post(APIFiles.colloborationList, '/data/list_bill_wap.aspx?Tmethod=getlistbill.gz.initial', params, contentType.FormData)
}

export default {
    getImplementationProcess,
    uploadImplImg,
    getPerfReportList,
    getCheckInATakePhotosData,
    uploadCheckInATakePhotosImgs,
    delCheckInATakePhotosImgs,
    confirmCheckInATakePhotosData,
    getUserInfo
}