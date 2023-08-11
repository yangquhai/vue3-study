import request from '_request'
import axios from 'axios'
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
    colloborationList: './data/list_bill_wap.aspx?Tmethod=',
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
    // 打包上传
    // return request.post(APIFiles.colloborationList, 'getlistbill.gz.initial',params, contentType.FormData)
    return request.post(APIFiles.colloborationList, '/data/list_bill_wap.aspx?Tmethod=getlistbill.gz.initial', params, contentType.FormData)
}

/***-保存数据-***/

export function saveUserInfo(params) {
    // 打包上传
    // return request.post(APIFiles.colloborationList, 'saveformat',params, contentType.FormData)
    return request.post(APIFiles.colloborationList, '/data/list_bill_wap.aspx?Tmethod=saveformat', params, contentType.FormData)
}
/***-拉取数据-***/

export function siftUserInfo(params) {
    // 打包上传
    // return request.post(APIFiles.colloborationList, 'getlist.gz.data',params, contentType.FormData)
    return request.post(APIFiles.colloborationList, '/data/list_bill_wap.aspx?Tmethod=getlist.gz.data', params, contentType.FormData)
}

/***-批量操作审批数据-***/

export function batchOperation(params) {
     // let data = axios({ url: `/anywell_hylingls/data/Aiot_list_bill.aspx?Tmethod=Batch_delivery`, method: 'post', data: params })
     let data =  axios({url: `/api/data/Aiot_list_bill.aspx?Tmethod=Batch_delivery`,method:'post', data:  params})
     return data
}

/***-转单接口一-***/
export function getTransferOrderData(params, FC) {
    // let data = axios({ url: `/anywell_hylingls/ForceCheckScript/FC_${FC}?Tmethod=FormLoad`, method: 'post', data: params })
    let data =  axios({url: `/api/ForceCheckScript/FC_${FC}?Tmethod=FormLoad`,method:'post', data:  params})
    return data
}

/***-转单接口二-***/
export function changeTransferOrderData(params, FC, DT) {
    // let data = axios({ url: `/anywell_hylingls/ForceCheckScript/FC_${FC}?Tmethod=CFCLICK_${DT}`, method: 'post', data: params })
    let data =  axios({ url: `/api/ForceCheckScript/FC_${FC}?Tmethod=CFCLICK_${DT}`,method:'post', data:  params})
    return data
}

export default {
    getImplementationProcess,
    uploadImplImg,
    getPerfReportList,
    getCheckInATakePhotosData,
    uploadCheckInATakePhotosImgs,
    delCheckInATakePhotosImgs,
    confirmCheckInATakePhotosData,
    getUserInfo,
    saveUserInfo,
    siftUserInfo,
    getTransferOrderData,
    changeTransferOrderData,
    batchOperation
}