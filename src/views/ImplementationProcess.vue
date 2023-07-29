<!-- 二级 - 实施单处理 -->
<template>
    <div v-if="!!paymentInfo.fields">
        <van-steps :active="implStatusCurr" v-if="pageStatus === '回执交单'">
            <van-step>实施处理</van-step>
            <van-step>确认验收</van-step>
            <van-step>验收完成</van-step>
        </van-steps>
        <div class="page-content van-safe-area-bottom">
            <!-- 支付信息 v-if="pageStatus === '回执交单'"-->
            <div class="card" >

                <div class="card-header flex">
                    <b>{{ paymentInfo.title }}</b>
                    <van-tag v-if="paymentInfo.paystatus === '未支付'" color="var(--van-primary-color-p15)"
                        text-color="var(--van-primary-color)" class="m-l-8">未支付</van-tag>
                    <van-tag v-else color="var(--van-green-color-p15)" text-color="var(--van-green)"
                        class="m-l-8">已支付</van-tag>
                </div>

                <div class="card-content">
                    <van-form @submit="onPaymentSubmit" :readonly="paymentInfo.paystatus === '已支付'">
                        <van-cell-group>
                            <van-field v-for="formItem in paymentAmountArr" v-model="formItem.value" :key="formItem.id"
                                :label="formItem.key" :placeholder="`请填写${formItem.key}`" input-align="right"
                                error-message-align="right" :rules="[{ required: true, message: `请填写${formItem.key}` }]"
                                :formatter="formatAmount(formItem)" type="number" clearable required />
                            <van-cell>
                                <template #value>
                                    <div class="flex flex-r">
                                        <small>合计</small>
                                        <span class="txt-default txt-bold m-l-8">{{ paymentAmount }}</span>
                                    </div>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-form>
                </div>

                <div class="card-footer p-0" v-if="paymentInfo.paystatus === '未支付'">
                    <div class="van-haptics-feedback p-12 flex flex-c txt-red"
                        :class="{ 'txt-green': paymentAmount !== '0元' }" @click="getReceiveMoneyCode">
                        <template v-if="paymentAmount !== '0元'">
                            <van-icon class="m-r-4" name="scan" size="16" />
                            <span>打开收款码</span>
                        </template>
                        <template v-else>
                            <span>收款不得为0元</span>
                        </template>
                    </div>
                    <van-popup v-model:show="showPopupReceiveMoney" @closed="getPaymentStatus" round
                        :style="{ width: '70vmin', minHeight: '70vmin' }">

                        <div class="bg-gray txt-green p-12">
                            <span class="flex flex-l">
                                <van-icon class="m-r-4" name="scan" size="16" />扫码支付
                            </span>
                        </div>

                        <!-- <van-empty v-show="!isLoading && !!!recvMnyCodeURL" image="error" description="加载失败，请重试">
                            <van-button @click="getReceiveMoneyCode" round type="primary" size="small"
                                class="bottom-button p-l-32 p-r-32">重新加载</van-button>
                        </van-empty> -->

                        <div class="p-32">
                            <small class="flex flex-c m-b-12 txt-gray">需支付{{ paymentAmount }}，以实际支付为准</small>
                            <van-image :src="recvMnyCodeURL" width="calc(70vmin - 32px * 2)"
                                height="calc(70vmin - 32px * 2)" fit="cover" show-loading>
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                        </div>

                        <div v-if="recvMnyCodeURL === '.'" class="van-hairline--top flex flex-c p-12">
                            <van-button @click="getReceiveMoneyCode" round type="primary" size="small"
                                class="bottom-button p-l-32 p-r-32">重新加载</van-button>
                            <!-- <template v-else>
                                <small class="txt-blue flex flex-l m-r-24">
                                    <van-icon class="m-r-4" name="alipay" size="16" />支付宝
                                </small>
                                <small class="txt-green flex flex-l">
                                    <van-icon class="m-r-4" name="wechat-pay" size="16" />微信支付
                                </small>
                            </template> -->
                        </div>
                    </van-popup>
                </div>

            </div>

            <!-- 处理状态 -->
            <div class="card">

                <div class="card-header"><b>{{ feedbackInfo.title || '处理反馈' }}</b></div>

                <div class="card-content">
                    <van-cell-group>
                        <van-field v-if="implStatus === '实施处理'" v-model="feedbackType" name="feebackPicker" label="处理状态"
                            input-align="right" error-message-align="right"
                            :rules="[{ required: true, message: '请选择处理状态' }]" placeholder="请选择处理状态"
                            @click="showFeedbackPicker = true" is-link readonly required />
                        <van-field v-else v-model="feedbackType" label="处理状态" input-align="right"
                            error-message-align="right" :rules="[{ required: true, message: '请选择处理状态' }]"
                            placeholder="请选择处理状态" readonly required />

                        <van-popup v-model:show="showFeedbackPicker" round position="bottom">
                            <van-picker :columns="columnsFeedbackOptions" @confirm="onConfirmFeedbackType"
                                @cancel="showFeedbackPicker = false" />
                        </van-popup>
                        <van-field v-for="formItem in feedbackInfo.fields" v-model="formItem.value" :key="formItem.id"
                            :label="formItem.key" :placeholder="`填写${formItem.key}`" :readonly="implStatus !== '实施处理'"
                            rows="2" type="textarea" maxlength="300" input-align="right" show-word-limit autosize />
                    </van-cell-group>
                </div>

            </div>

            <!-- 拍照上传 -->
            <div class="card">

                <div class="card-header flex p-0">
                    <b class="p-12">拍照上传</b>
                    <van-icon v-show="!!fileList.length && implStatus === '实施处理'" @click="showPopupTypeSelect = true"
                        name="photograph" size="20" class="p-12 txt-primary" />

                    <van-popup v-model:show="showPopupTypeSelect" round :style="{ width: '80vmin' }">

                        <div class="bg-gray txt-primary p-12">
                            <span class="flex flex-l">
                                <van-icon class="m-r-4" name="label-o" size="16" />选择类别
                            </span>
                        </div>

                        <van-grid clickable column-num="3" :style="{ overflow: 'auto', height: '80vmin' }">
                            <van-grid-item v-for="(typeItem, typeIndex) in typeList" :key="typeIndex"
                                @click="addImplImgGroup(typeItem.type)">
                                <template #default>
                                    <div class="tag-select"
                                        :class="{ 'selected': fileList.some(cardItem => { return cardItem.type === typeItem.type }) }">
                                        <span class="m-l-4 m-r-4 van-multi-ellipsis--l2">{{ typeItem.type }}</span>
                                        <span class="selected-icon"><van-icon name="success" size="12" /></span>
                                    </div>
                                </template>
                            </van-grid-item>
                        </van-grid>

                    </van-popup>
                </div>

                <div class="card-content">
                    <div class="card" v-for="fileItem in fileList">

                        <div class="card-header flex p-0">
                            <span class="p-12">{{ fileItem.type }}</span>
                            <van-icon v-show="implStatus === '实施处理'" @click="delImgCard(fileItem.type)" name="delete-o"
                                size="20" class="p-12" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-inner p-t-0 p-b-0">
                                <van-uploader v-model="fileItem.srclist" :show-upload="implStatus === '实施处理'"
                                    :deletable="implStatus === '实施处理'"
                                    :after-read="($event, $event2) => uploadImplImg($event, $event2, fileItem.type)"
                                    :preview-options="{ closeable: true }" :max-count="12" multiple
                                    preview-size="1.86rem" />
                            </div>
                        </div>

                        <div class="card-footer p-0">

                            <van-field v-model="fileItem.remark" :key="fileItem.id" :readonly="implStatus !== '实施处理'"
                                placeholder="填写备注" rows="1" type="textarea" maxlength="300" left-icon="chat-o"
                                class="p-l-12 p-r-12" autosize />

                        </div>
                    </div>

                    <van-empty v-show="!!!fileList.length" image-size="30%" class="p-0" />
                </div>
                <div v-show="!!!fileList.length" class="van-haptics-feedback p-12 txt-primary flex flex-c"
                    @click="showPopupTypeSelect = true">
                    <van-icon class="m-r-4" name="photograph" size="16" />
                    <span>拍照上传</span>
                </div>

            </div>

            <!-- 序列号 -->
            <div class="card">

                <div class="card-header flex p-0">
                    <b class="p-12">序列号</b>

                    <van-icon v-show="!!snList.length && implStatus === '实施处理'" @click="addSNCode" name="add" size="20"
                        class="p-12 txt-primary" />
                </div>

                <div class="card-content">
                    <van-cell-group v-show="!!snList.length">

                        <van-swipe-cell v-for="(snItem, snIndex) in snList" :key="snIndex"
                            :disabled="implStatus !== '实施处理'">

                            <van-field v-model.trim="snItem.number" placeholder="扫描/输入 产品序列号" clearable
                                :readonly="implStatus !== '实施处理'">
                                <template #right-icon>
                                    <van-icon v-show="implStatus === '实施处理'" @click="scanSNCode(snIndex)" name="scan"
                                        color="var(--van-primary-color-p60)" size="20" />
                                </template>
                            </van-field>
                            <template #right>
                                <van-button @click="delSNCode(snIndex)" square text="删除" type="danger"
                                    class="delete-button" />
                            </template>
                        </van-swipe-cell>

                    </van-cell-group>

                    <van-empty v-show="!!!snList.length" image-size="30%" class="p-0" />
                </div>
                <div v-show="!!!snList.length" class="van-haptics-feedback p-12 txt-primary flex flex-c" @click="addSNCode">
                    <van-icon class="m-r-4" name="add" size="16" />
                    <span>添加序列号</span>
                </div>

            </div>


            <!-- 使用配件 -->
            <div class="card">

                <div class="card-header flex p-0">
                    <b class="p-12">
                        使用配件
                        <small class="txt-gray m-l-8" v-show="!!accsList.length">(共{{ accsItemCount }}件)</small>
                    </b>

                    <SelectAccessories v-model:accsListSelected="accsList" :orderNumber="orderNumber"
                        v-model:showPopup="showPopupAccs" />
                    <van-icon v-show="!!accsList.length && implStatus === '实施处理'" @click="showPopupAccs = true" name="add"
                        size="20" class="p-12 txt-primary" />
                </div>

                <div class="card-content">

                    <template v-for="asscItem in accsList" :key="asscItem.id">

                        <div v-if="!asscItem.id" class="flex p-l-12 p-b-12">
                            <div class="card m-0 bg-gray flex flex-1 p-12">
                                <van-tag color="var(--van-gray-3)" text-color="var(--text-color-1)" class="card-tag">
                                    {{ asscItem.brand }}
                                </van-tag>
                                <div class="flex-1 van-ellipsis m-r-12">
                                    <div class="m-t-12 txt-c-1 txt-bold van-ellipsis">{{ asscItem.name }}</div>
                                </div>
                                <div class="card m-0 flex flex-col p-8 bg-white">
                                    <b class="txt-lg m-b-4">{{ asscItem.quantity || 0 }}</b>
                                    <small class="txt-gray">数量</small>
                                </div>

                            </div>
                            <van-icon @click="delAccsCard(asscItem.id, asscItem.name)" name="delete-o" size="20"
                                class="p-12" />
                        </div>

                        <div v-else class="flex">
                            <div class="flex flex-1 flex-t van-ellipsis van-hairline--top">
                                <div class="flex-1 van-ellipsis p-12">
                                    <div class="m-b-4 txt-c-1 txt-bold van-ellipsis">{{ asscItem.name }}</div>
                                    <small class="txt-gray">{{ asscItem.brand }}</small>
                                </div>
                                <div v-if="implStatus === '实施处理'" class="flex flex-col flex-b">
                                    <small @click="delAccsCard(asscItem.id, asscItem.name)" class="txt-gray p-12">-删除</small>
                                    <van-stepper @change="throttleOnChangeAccsCard(asscItem)" class="p-12"
                                        v-model="asscItem.quantity" button-size="20" />
                                </div>
                                <div v-else class="p-12">
                                    <span class="txt-gray">x {{ asscItem.quantity }} {{ asscItem.unit }}</span>
                                </div>

                            </div>
                        </div>
                    </template>

                    <van-empty v-show="!!!accsList.length" image-size="30%" class="p-0" />
                </div>
                <div v-show="!!!accsList.length" class="van-haptics-feedback p-12 txt-primary flex flex-c"
                    @click="showPopupAccs = true">
                    <van-icon class="m-r-4" name="add" size="16" />
                    <span>添加配件</span>
                </div>

            </div>


            <!-- 客户验收确认 -->
            <div class="card" v-if="pageStatus === '回执交单'">

                <div class="card-header">
                    <b>客户验收确认</b>
                </div>

                <div class="card-content">
                    <div class="card-content-inner p-t-0">
                        <div class="square-container card m-0 brd-dash p-b-40p"
                            @click="showPopupSmoothSignature = !!!imgSignature">
                            <div class="square-content">

                                <van-image :src="imgSignature" fit="cover" show-loading>
                                    <template v-slot:loading>
                                        <div class="flex">
                                            <van-icon class="m-r-8 txt-primary" name="edit" size="16" />
                                            手写签名
                                        </div>
                                    </template>
                                </van-image>
                            </div>
                        </div>
                        <van-popup v-model:show="showPopupSmoothSignature" :style="{ height: '100%' }" position="bottom"
                            :safe-area-inset-bottom="true">
                            <SmoothSignature v-model:showPopup="showPopupSmoothSignature" @getSignature="getSignatureImg" />
                        </van-popup>
                    </div>
                </div>

            </div>


            <div class="m-12 m-t-32" v-show="implStatus !== '已完成'">
                <div class="flex" v-if="pageStatus === '回执交单'">

                    <van-button v-show="implStatus === '实施处理'" @click="saveImplData" type="primary" block
                        round>下一步</van-button>

                    <van-col span="8" class="p-r-12" v-show="implStatus === '实施确认'">
                        <van-button @click="implStatus = '实施处理'" type="default" block round>上一步</van-button>
                    </van-col>

                    <van-button v-show="implStatus === '实施确认'" @click="confirmImplCompl" type="primary" block
                        round>确认完成</van-button>

                </div>
                <van-button v-else @click="saveImplData" type="primary" block round>保&emsp;存</van-button>
            </div>

            <van-back-top target=".page-content"
                bottom="calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-padding-sm))"
                right="var(--van-padding-sm)" />
        </div>
    </div>
    <van-empty v-if="!!!paymentInfo && !isLoading" description="暂无数据" />

    <van-loading v-if="isLoading" class="flex flex-c m-t-32" color="var(--van-primary-color)" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import request from '_api'
import { useDebounceFn } from '@vueuse/core'
import { showConfirmDialog, showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'

const props = defineProps({
    orderNumber: {
        // 单号
        type: String,
        required: true
    },
    pageStatus: {
        // 页面状态：阶段汇报、回执交单
        type: String,
        required: true
    }
})

const isLoading = ref(false)

// 实施状态控制：已完成、未完成（未完成：实施处理、实施确认）
const stepActive = ref(0)
const implStatus = ref('实施处理')
const implStatusCurr = computed(() => {
    switch (implStatus.value) {
        case '实施处理':
            stepActive.value = 0
            break

        case '实施确认':
            stepActive.value = 1
            break

        default:
            stepActive.value = 2
            break
    }
    return stepActive.value
})



// 支付信息
const paymentInfo = ref({})
const paymentAmountArr = ref([])
const paymentAmount = computed(() => {
    // 合计
    if (paymentAmountArr.value) {
        const count = paymentAmountArr.value.reduce((sum, field) => {
            return sum + parseFloat(field.value || 0)
        }, 0)
        return count + '元'
    }
})

const onPaymentSubmit = (values) => {
    console.log('submit', values)
}

// 收款
const recvMnyCodeURL = ref('')
// 格式化输入的金额
const formatAmount = (item) => {

    const decimalCount = (item.value.toString().split('.')[1] || '').length

    const amount = item.value
    if (decimalCount > 2) {
        item.value = parseFloat(amount).toFixed(2)
    }
}

const showPopupReceiveMoney = ref(false)
// 获取收款码
const getReceiveMoneyCode = async () => {
    if (paymentAmount.value === '0元') {
        showToast('收款不得为0元')
        return
    }
    showPopupReceiveMoney.value = true
    recvMnyCodeURL.value = ''
    const params = {
        dh: props.orderNumber,
        collectiondata: paymentAmountArr.value
    }
    try {
        const res = await request.getReceiveMoneyCode(params)
        recvMnyCodeURL.value = res.data.ewmurl || '.'
        if (recvMnyCodeURL.value === '.') {
            showToast('收款码加载失败')
        }
    } catch (err) {
        showToast('收款码加载失败')
        console.log(err)
    }
}
// 获取支付状态
const getPaymentStatus = async () => {
    try {
        const res = await request.getPaymentStatus({ dh: props.orderNumber })
        paymentInfo.value.paystatus = res.data.state
    } catch (err) {
        console.log(err)
    }
}


// 反馈信息
const feedbackInfo = ref({})
const showFeedbackPicker = ref(false)
const feedbackType = ref('') // 反馈类型
const columnsFeedbackOptions = ref([]) // 反馈类型选项

const onConfirmFeedbackType = ({ selectedOptions }) => {
    feedbackType.value = selectedOptions[0]?.text
    showFeedbackPicker.value = false
}



// 拍照上传
const showPopupTypeSelect = ref(false)
const typeList = ref([])
const fileList = ref([]) // 拍照的图片组

// 新增图片组
const addImplImgGroup = (type) => {
    const hasImgGroup = fileList.value.some(cardItem => { return cardItem.type === type })
    if (hasImgGroup) {
        showToast('该类别已存在')
        return
    } else {
        fileList.value.unshift({
            remark: '',
            type: type,
            srclist: []
        })
        showPopupTypeSelect.value = false
    }
}

// 上传拍照图片
const uploadImplImg = async (files, detail, imgType) => {

    console.log(files, detail, imgType)
    let formData = new FormData()
    formData.append('dh', props.orderNumber)
    formData.append('imgtype', imgType)
    // 获取所需上传的文件数据
    if (files.length) {
        files.forEach(file => {
            file.status = 'uploading'
            file.message = '上传中...'
            formData.append('img', file.file)
        })
    } else {
        files.status = 'uploading'
        files.message = '上传中...'

        formData.append('img', files.file)
    }

    try {
        const res = await request.uploadImplImg(formData)
        const resImg = res.data.imgList
        showToast(res.message || '上传成功')

        if (files.length) {
            files.forEach(file => {
                file.status = 'done'
            })
        } else {
            files.status = 'done'
        }

        if (files.length) {

            files.forEach((file, index) => {
                file.name = resImg[index].url
            })
        } else {
            files.name = resImg[0].url
            console.log(files.file)
        }
    } catch (err) {
        console.log(err)

        if (files.length) {
            files.forEach(file => {
                file.status = 'failed'
                files.message = '上传失败'
            })
        } else {
            files.status = 'failed'
            files.message = '上传失败'
        }
    }
}

// 删除拍照图片
const delImplImg = async (url, type) => {
    const params = {
        dh: props.orderNumber,
        imgtype: type,
        server_filename: url.url
    }
    try {
        const res = await request.delImplImg(params)
        // 根据url, type匹配执行删除
        for (let i = 0; i < fileList.value.length; i++) {
            if (fileList.value[i].type === type) {
                const srclist = fileList.value[i].srclist
                const index = srclist.findIndex((item) => item === url)
                if (index !== -1) {
                    srclist.splice(index, 1)
                    break // 如果只需要删除第一个匹配项，可以注释掉此行
                }
            }
        }
        showToast(res.message || '删除成功')
    } catch (err) {
        console.log(err)
    }
}

// 删除拍照图片组
const delImgCard = (imgType) => {

    const beforeClose = (action) =>
        new Promise((resolve) => {
            if (action === 'confirm') {
                request.delImgCard({ dh: props.orderNumber, imgtype: imgType })
                    .then((res) => {
                        fileList.value = fileList.value.filter(item => item.type !== imgType)
                        showToast(res.message || '删除成功')
                        resolve(true)
                    })
                    .catch(err => {
                        console.error(err)
                        // 发生错误时也拦截取消操作
                        resolve(false)
                    })
            } else {
                // 拦截取消操作
                resolve(true)
            }
        })

    showConfirmDialog({
        title: `删除提示`,
        message: `确认删除<b class="txt-primary">${imgType}</b>的图片吗？`,
        allowHtml: true,
        beforeClose,
    }).catch(() => {
        // on cancel
    })
}



// 序列号
const snList = ref([]) // 序列号列表
const snItemIndex = ref('') // 扫码结果
// 扫码，区分iOS和安卓
const scanSNCode = (index) => {
    snItemIndex.value = index
    if (
        navigator.userAgent.indexOf('wxwork') < 0 &&
        navigator.userAgent.indexOf('DingTalk') < 0
    ) {
        let Mobile
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            Mobile = 'IOS'
            callIOS('ScanToH5')
        } else if (/(Android)/i.test(navigator.userAgent)) {
            Mobile = 'Android'
            callAndroid('')
        }
    }
}
const ScanToH5Handler = {
    rebackData: function (res) {
        // res是扫描结果
        if (snList.value.some(item => item.number === res)) {
            showToast('序列号已存在')
        } else {
            snList.value[snItemIndex.value] = ({ number: res })
            showToast('添加成功')
        }
    }
}
window.ScanToH5Handler = ScanToH5Handler // 原生APP端要求的写法

const callIOS = (cmd) => {
    const tempurl = 'tkhbm=&tid='
    const url = `protocol://${cmd}+&Tscan=1+${tempurl}`
    document.location = url
}

const callAndroid = (furl) => {
    android.call_android_ToH5(furl)
}

// 添加序列号
const addSNCode = () => {
    snList.value.unshift({ number: '' })
}

// 删除序列号
const delSNCode = (snIndex) => {
    snList.value.splice(snIndex, 1)
    showToast('删除成功')
}





// 选择配件
const showPopupAccs = ref(false)
const accsList = ref([]) // 配件列表

// 删除配件
const delAccsCard = async (accsID, accsName) => {

    const beforeClose = (action) =>
        new Promise((resolve) => {
            if (action === 'confirm') {
                request.delAccsItem({ dh: props.orderNumber, id: accsID })
                    .then((res) => {
                        accsList.value = accsList.value.filter(item => item.id !== accsID)
                        showToast(res.message || '移除成功')
                        resolve(true)
                    })
                    .catch(err => {
                        console.error(err)
                        // 发生错误时也拦截取消操作
                        resolve(false)
                    })
            } else {
                // 拦截取消操作
                resolve(true)
            }
        })

    showConfirmDialog({
        title: `删除提示`,
        message: `确认移除<b class="txt-primary">${accsName}</b>这个配件吗？`,
        allowHtml: true,
        beforeClose,
    }).catch(() => {
        // on cancel
    })
}

// 修改配件数量
const changeAccsCard = async (accsItem) => {
    isLoading.value = true
    console.log(accsItem)
    const params = {
        dh: props.orderNumber,
        quantity: accsItem.quantity,
        id: accsItem.id,
    }
    try {
        const res = await request.addAccsItem(params)
        showToast(res.message || '修改完成')

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
const accsItemCount = computed(() => {
    // 配件明细数量合计
    if (accsList.value) {
        const count = accsList.value.reduce((sum, accsItem) => {
            return sum + parseFloat(accsItem.quantity || 0)
        }, 0)
        return count
    }
})

const throttleOnChangeAccsCard = useDebounceFn(changeAccsCard, 1000) // 步进器操作节流



// 客户手写签名
const showPopupSmoothSignature = ref(false)
const imgSignature = ref(null)
// 获取客户签名的图片
function base64toFile(base64String, filename, mimeType) {
    const arr = base64String.split(',')
    const mime = mimeType || (arr[0].match(/:(.*?);/) || [])[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}
// 保存客户签名
const getSignatureImg = async (img) => {
    showLoadingToast({
        message: '正在确认...',
        forbidClick: true
    })
    // Base64字符串转换为文件对象
    const base64String = img
    const filename = 'signature.png'
    const mimeType = 'image/png'
    const file = base64toFile(base64String, filename, mimeType)
    console.log(file)


    let formData = new FormData()
    formData.append('dh', props.orderNumber)
    // 获取所需上传的文件数据
    formData.append('img', file)

    try {
        const res = await request.confirmSignature(formData)
        imgSignature.value = img
        showSuccessToast(res.message || '客户签名完成')

    } catch (err) {
        showFailToast('客户签名失败，请重试')
        console.log(err)
    }
}


// 获取页面数据
const getImplementationProcess = async () => {
    isLoading.value = true
    try {
        const res = await request.getImplementationProcess({ dh: props.orderNumber })
        paymentInfo.value = res.data.collection
        paymentAmountArr.value = reactive(res.data.collection.fields)
        feedbackInfo.value = res.data.feedback
        feedbackType.value = res.data.feedback.processingstatus
        columnsFeedbackOptions.value = res.data.statusData.map(item => {
            // 转换处理状态选项为picker的columns形式
            return {
                text: item.content,
                value: item.id
            }
        })

        typeList.value = res.data.typeData
        fileList.value = res.data.imgList
        fileList.value = res.data.imgList.map(item => {
            // 转换图片列表数据为图片上传组件所需形式
            return {
                remark: item.remark,
                type: item.type,
                srclist: item.srclist.map(url => {
                    return {
                        url: url,
                        beforeDelete: (url) => {
                            delImplImg(url, item.type)
                        }
                    }
                })
            }
        })
        snList.value = res.data.serialNumberData
        accsList.value = res.data.partsData
        imgSignature.value = res.data.signData
        implStatus.value = res.data.state === '未完成' ? '实施处理' : '实施确认'

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
getImplementationProcess()


// 保存页面数据
const saveImplData = async () => {
    showLoadingToast({
        message: '正在保存...',
        forbidClick: true
    })
    snList.value = snList.value.filter(item => item.number.trim() !== '') // 移除空序列号

    // 移除图片数据的srclist
    const imgInfo = []
    for (let i = 0; i < fileList.value.length; i++) {
        imgInfo[i] = {
            remark: fileList.value[i].remark,
            type: fileList.value[i].type
        }
    }

    const params = {
        dh: props.orderNumber,
        imgList: imgInfo,
        collection: paymentAmountArr.value,
        feedback: {
            fields: feedbackInfo.value.fields,
            processingstatus: feedbackType.value
        },
        serialNumberData: snList.value
    }

    try {
        const res = await request.saveImplData(params)
        if (props.pageStatus === '回执交单') {
            implStatus.value = '实施确认'
        }

        showSuccessToast(res.message || '保存成功')

    } catch (err) {
        showFailToast('保存失败，请重试')
        console.log(err)
    }
}

// 验收确认完成
const confirmImplCompl = async () => {
    if (!!!imgSignature.value) {
        showToast('请让客户确认签名')
        return
    } else if (paymentInfo.value.paystatus === '未支付') {
        showToast('请让客户确认并付款')
        return
    }
    const beforeClose = (action) =>
        new Promise((resolve) => {
            if (action === 'confirm') {

                request.confirmImplCompl({ dh: props.orderNumber })
                    .then((res) => {
                        implStatus.value = '已完成'
                        showSuccessToast(res.message || '实施已成功')
                        resolve(true)
                    })
                    .catch(err => {
                        showFailToast('确认失败，请重试')
                        console.log(err)
                        // 发生错误时也拦截取消操作
                        resolve(false)
                    })

            } else {
                // 拦截取消操作
                resolve(true)
            }
        })

    showConfirmDialog({
        title: `完成提示`,
        message: `完成后将不可修改，是否确认已完成？`,
        allowHtml: true,
        beforeClose,
    }).catch(() => {
        // on cancel
    })

}
</script>

<style lang="less" scoped>
.card-content>.card {
    filter: invert(.025);

    &:first-child {
        margin-top: 0;
    }
}

// :deep(.van-uploader) {

//     width: 100%;

//     .van-uploader__wrapper {
//         flex-flow: row;
//         // justify-content: start;
//         overflow-x: auto;
//         padding-bottom: 0;
//         padding-right: 1.75rem;
//         box-sizing: border-box;
//     }

//     .van-uploader__preview {
//         margin: 0 var(--van-padding-xs) 0 0;
//     }

//     .van-uploader__upload {
//         position: absolute;
//         right: 0;
//         margin: 0;
//         background: transparent;

//         &::before {
//             content: "";
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background: var(--van-gray-color-p60);
//             backdrop-filter: blur(10px);
//         }

//         .van-uploader__upload-icon {
//             color: var(--van-gray-6);
//         }
//     }
// }
:deep(.van-uploader__wrapper) {

    .van-uploader__upload,
    .van-uploader__preview:nth-child(4n) {
        margin-right: 0;
    }

    .van-uploader__preview,
    .van-uploader__upload {
        border-radius: var(--van-radius-md);
        overflow: hidden;
    }
}

.van-steps+.page-content {
    padding-top: 60px;
}

.van-grid-item {
    height: 1.25rem;
}

.tag-select {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    text-align: center;
    word-break: break-all;

    .selected-icon {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 0 var(--van-padding-base)var(--van-padding-base);
        display: inline-block;
        color: var(--van-white);
        background-color: var(--van-primary-color);
        border-radius: 0 0 0 2em;
        opacity: 0;
        transform: scale(.7);
        transform-origin: top right;
    }

    &.selected {
        color: var(--van-primary-color);
        font-weight: 700;

        .selected-icon {
            opacity: 1;
        }
    }
}

.card-tag {
    position: absolute;
    top: 0;
    left: 0;
}

.brd-dash {
    border: 1px dashed var(--van-gray-4);
}

.p-b-40p {
    padding-bottom: 40%;
}
</style>
