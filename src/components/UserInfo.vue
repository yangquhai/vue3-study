<!-- 用于card信息的渲染 -->
<template>
    <div class="page-content" ref="scrollRef">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div v-for="(item, index) in props.userInfoDataList.data" class="card" @click="goSystem(index)">
                <div>
                    <div class="card-header flex">
                        <div class="checked flex">
                            <div class="checkBorder"
                                :style="{ 'border': (chooseList.includes(item.rn) ? 'solid 1px #ffffff' : 'solid 1px rgba(226, 226, 226, 1)') }"
                                @click.stop="checked(item.rn, item.SYSTEM_ID, item.SYSTEM_LCMC, item.SYSTEM_LCMXMC_ORG)">
                                <van-icon v-show="chooseList.includes(item.rn)" name="success" />
                            </div>
                            <div class="name m-l-8">
                                {{ KHMC[index] }}
                            </div>
                        </div>

                        <small class="options">
                            <!-- <a href="WAPYXKHGZB.ASPX?Tsystem_id=64DSSJTB"></a>   -->
                            {{ SYSTEM_LCMXMC[index] }}
                            <van-icon name="arrow" />
                        </small>
                    </div>
                    <van-divider />
                    <div class="card-content">
                        <div class="card-content1 m-t-8 p-l-12 p-r-12">
                            <div class="address flex-l" v-if="SHDD[index]">
                                <i class="van-badge__wrapper van-icon van-icon-location m-r-4 txt-gray"></i>
                                <small class="addressed">{{ SHDD[index] }}</small>
                            </div>
                            <div class="centerList flex  m-t-8 ">

                                <div class="taglist flex flex-l">
                                    <div class="buyOptions m-r-4 m-b-4" v-for="(item) in BQ[index]">
                                        <van-tag color="#fff2e9" text-color="#fd9148" size="large" v-if="item">
                                            {{ item }}
                                        </van-tag>
                                    </div>
                                </div>
                                <div class="phone" @click.stop="callOut(LXDH[index])" v-if="LXDH[index]">
                                    <!-- <img src="../assets/phone.svg" alt=""> -->
                                    <van-icon name="phone" class="txt-gray" />
                                    <small>{{ LXDH[index] }}</small>
                                </div>
                            </div>
                        </div>
                        <small class="card-content2">
                            <div class="van-row m-t-12 m-r-12 m-l-12">
                                <div class="title van-col van-col--8 flex flex-col" v-for="(item) in ZDY[index]">
                                    <div class="titleDetails" v-if="item.value">{{ item.title }}</div>
                                    <div class="datas m-t-4 m-b-12" v-if="item.value">{{ item.value }}</div>
                                </div>
                            </div>
                        </small>

                        <div class="card-content3 m-t-0 m-l-12 m-r-12" v-if="BZ[index]">
                            <div class="tips m-8">
                                <span> <small style="font-weight:bold;">最后跟进内容:</small> <small>{{ BZ[index] }}</small>
                                </span>
                            </div>
                        </div>
                        <!-- <div class="border m-l-12 m-r-12" v-if="!BZ[index]"></div> -->
                        <van-divider class="m-l-12 m-r-12" v-if="!BZ[index]" />
                    </div>

                    <div class="card-footer">
                        <div class="style1 m-b-12" v-if="buttonNumber == 3">
                            <small class="titleMoney">{{ ZJEText }}</small>
                            <small>￥</small>
                            <span class="moneyDetails">{{ ZJE[index] }}</span>
                        </div>
                        <div class="style3" v-if="buttonNumber == 0">
                            <small class="titleMoney">{{ ZJEText }}</small>
                            <small>￥</small>
                            <span class="moneyDetails3">{{ ZJE[index] }}</span>
                        </div>
                        <div class="getDetails">
                            <div class="style2" v-if="buttonNumber != 3 && buttonNumber != 0">
                                <small class="titleMoney">{{ ZJEText }}</small>
                                <small>￥</small>
                                <span class="moneyDetails">{{ ZJE[index] }}</span>
                            </div>
                            <div class="bottonList">
                                <div v-for="(item2, index2) in AJAX_Url" style="display: flex; justify-content: flex-end;">
                                    <div v-if="AJAX_Url.length < 3">
                                        <button class="userDetails borders m-l-8" @click.stop="goDetails(item2, index)">{{
                                            item2.text1 }}</button>
                                    </div>
                                    <!-- 为了只渲染一次，限制只有index2为零才渲染 -->
                                    <div v-if="AJAX_Url.length > 2 && index2 == 0">
                                        <button class="userDetails borders m-l-8" @click.stop="transferOrder(index)">转
                                            单</button>
                                    </div>
                                    <div v-if="index2 == 0 && KHBM.length">
                                        <button class="userDetails order m-l-8" @click.stop="goKhDetails(index)">
                                            {{ KHBM[index].title }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nomore" v-if="props.userInfoDataList.sum.count">
                <!-- {{ KHBM }} -->
                <span
                    v-if="props.userInfoDataList.sum.count == props.userInfoDataList.data.length || props.userInfoDataList.sum.count < props.userInfoDataList.data.length">没有更多了</span>
                <van-loading v-else size="24px">加载中...</van-loading>
            </div>

            <van-empty v-if="!props.userInfoDataList.sum.count" description="没有数据了" />
        </van-pull-refresh>
        <!-- 用于唤起弹窗，拨打电话 -->
        <van-dialog v-model:show="show" show-cancel-button confirmButtonText="拨打电话" confirmButtonColor='#1890ff'
            :closeOnClickOverlay="true" cancelButtonText="复制" @confirm="callPhone()" @cancel="copy(callPhoneNum)">
            <!-- <p class="callPhone">{{ callPhoneNum }}</p> -->
            <p class="callPhone">18173135078</p>
            <p class="phoneTips">为了保护数据的安全性，本次的操作被系统记录。</p>
        </van-dialog>
        <!-- 用于转单链接 -->
        <van-action-sheet v-model:show="orderFlag" :actions="actions2" @select="onSelect" cancel-text="取消" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import * as dd from 'dingtalk-jsapi';
import request from '_api'
import { showToast, showLoadingToast, closeToast, } from 'vant';

const props = defineProps({
    userInfoDataList: Object,
    isLoad: Boolean,
})

// 解析后端传输的字段，筛选出符合要求的数据,并对数据进行处理
const fieldName = computed(() => {
    let fieldName = props.userInfoDataList.fieldname
    return fieldName
})
watch(() => props.userInfoDataList, (value) => {
    userDataList2.value = value.data
    // console.log(userDataList2.value)
})

// 跳转值system界面
const baseUrl = ref('http://dx.anywellchat.com:8888/ANYWELL_hylingls/')
const goSystem = (index) => {
    // console.log(SYSTEM_URL.value[index], index)
    if (dd.env.platform !== "notInDingTalk") {
        dd.biz.util.openLink({
            // url:"http://oa.gzwebway.com:8888/oa/WAPGZRZ.ASPX?Tsystem_id=RZ756089&IsShowLiePi=1",//要打开链接的地址
            url: `${baseUrl.value}${SYSTEM_URL.value[index]}`,
            onSuccess: function (result) {
                /**/
                console.log(url)
            },
            onFail: function (err) {
                console.log(err)
             }
        })
    }
    if (navigator.userAgent.indexOf("wxwork") <= 0 && navigator.userAgent.indexOf("DingTalk") <= 0) {
        window.location.href = './' + SYSTEM_URL.value[index]
        // window.location.href = (baseUrl.value + 'WAPYXKHGZB.ASPX?tnw=oknew2&Tsystem_id=62DSSJTB')
        // console.log(SYSTEM_URL.value[index])
    }
    // else {
    //     window.location.href = (baseUrl.value + 'WAPYXKHGZB.ASPX?tnw=oknew2&Tsystem_id=62DSSJTB')
    // }
}
const goKhDetails = (index) => {
    // console.log(index,KHBM.value[index])
    if (dd.env.platform !== "notInDingTalk") {
        dd.biz.util.openLink({
            url: `${baseUrl.value} + 'wapCustomerBill.aspx?khbm=' + ${KHBM.value[index].systemId}`,
            // url:'http://oa.gzwebway.com:8888/oa/WAPGZRZ.ASPX?Tsystem_id=RZ756096&IsShowLiePi=1',
            onSuccess: function (result) {
                /**/
            },
            onFail: function (err) { }
        })
    }
    if (navigator.userAgent.indexOf("wxwork") <= 0 && navigator.userAgent.indexOf("DingTalk") <= 0) {
        window.location.href =  './wapCustomerBill.aspx?khbm=' + KHBM.value[index].systemId
    }
    // else {
    //     window.location.href =  'wapCustomerBill.aspx?khbm=' + KHBM.value[index].systemId
    // }
}

// 获取AJAX_Url按钮
const buttonNumber = ref(0)
const AJAX_Url = computed(() => {
    let AJAX_Url = props.userInfoDataList.AJAX_Url
    console.log(AJAX_Url.length, KHBM.value.length)
    if (!KHBM.value.length) {
        buttonNumber.value = AJAX_Url.length
    }
    else {
        buttonNumber.value = AJAX_Url.length + 1
    }
    console.log(buttonNumber.value)
    return AJAX_Url
})

// 客户名称筛选
const KHMC = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '姓名') {
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                    // console.log(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
            // console.log(props.userInfoDataList.data)
        }
    // console.log(KHMC)
    return KHMC
})

// 状态筛选

const SYSTEM_LCMXMC = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '状态') {
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// SYSTEM_URL链接跳转

const SYSTEM_URL = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == 'SYSTEM_URL') {
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 备注筛选
const BZ = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '备注') {
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 联系电话筛选
const LXDH = computed(() => {
    let KHMC = []
    // console.log(111)
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '电话') {
                    if (props.userInfoDataList.data[i][fieldName.value[j].fieldname].length > 11)
                        KHMC.push((props.userInfoDataList.data[i][fieldName.value[j].fieldname].slice(0, 11) + '..'))
                    else
                        KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 销售地址筛选
const SHDD = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '地址') {
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 字段一筛选
const ZDY = computed(() => {
    let KHMC = []
    let sum = 0
    let size = 0
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined) {
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '字段1') {
                    sum++
                    if (fieldName.value[j].lb != '数据:时间框') {
                        // console.log(fieldName.value[j].lb)
                        KHMC.push({ value: props.userInfoDataList.data[i][fieldName.value[j].fieldname], title: fieldName.value[j].text })
                    }
                    else {
                        if (props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                            KHMC.push({ value: props.userInfoDataList.data[i][fieldName.value[j].fieldname].split('T')[0], title: fieldName.value[j].text })
                        else
                            KHMC.push({ value: props.userInfoDataList.data[i][fieldName.value[j].fieldname], title: fieldName.value[j].text })
                    }
                }
            }
            size = sum
            sum = 0
        }
        // console.log(KHMC.length)
        // sliceArr(KHMC,size)
        // console.log(sliceArr(KHMC, size))
    }
    // console.log(sliceArr(KHMC, size))
    return sliceArr(KHMC, size)
})

// 标签筛选
const BQ = computed(() => {
    let KHMC = []
    let KHMC2 = []
    let sum = 0
    let size = 0
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined) {
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '标签') {
                    sum++
                    KHMC.push(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
                }
            }
            size = sum
            sum = 0
        }
        // console.log(sliceArr(KHMC,size))
        // sliceArr(KHMC,size)
        for (let i = 0; i < sliceArr(KHMC, size).length; i++) {
            // console.log(sliceArr(KHMC,size)[i])
            for (let j = 0; j < sliceArr(KHMC, size)[i].length; j++) {
                // console.log(sliceArr(KHMC,size)[i][j])
                if (sliceArr(KHMC, size)[i][j] != "") {
                    if ((typeof sliceArr(KHMC, size)[i][j]) == 'string') {
                        KHMC2.push(sliceArr(KHMC, size)[i][j].split(','))
                    }
                    // KHMC2.push(sliceArr(KHMC, size)[i][j].split(','))
                    // KHMC2.push(sliceArr(KHMC, size)[i][j].split(','))
                }
                //    else{
                //         // console.log(sliceArr(KHMC, size)[i][j])
                //         KHMC2.push(sliceArr(KHMC, size)[i][j])
                //     }
            }
        }
        // console.log(KHMC)
        // console.log(sliceArr(KHMC2,size))
    }
    // console.log(KHMC)
    // console.log(sliceArr(KHMC2, size))
    return sliceArr(KHMC, size)
})
// 总金额筛选
const ZJEText = ref('')
const ZJE = computed(() => {
    let LXDH = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '金额') {
                    ZJEText.value = fieldName.value[j].text
                    if (props.userInfoDataList.data[i][fieldName.value[j].fieldname] < 100000)
                        LXDH.push(Math.trunc(props.userInfoDataList.data[i][fieldName.value[j].fieldname]).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'))
                    else
                        LXDH.push(Number((props.userInfoDataList.value[i].money / 10000)).toFixed(2).toString())
                }
            }
        }
    // console.log(LXDH,ZJEText.value)
    return LXDH
})

// 客户详情按钮筛选
const KHBM = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '客户详情按钮') {
                    KHMC.push({ text: fieldName.value[j].text, title: '客户详情', systemId: props.userInfoDataList.data[i][fieldName.value[j].fieldname] })
                }
            }
        }
    // console.log(KHMC.length)
    return KHMC
})

const userDataList2 = reactive([])
const chooseList = ref([])
const totalMoney = ref([])
// const valueStr = ref([])
const isLoading = ref(false)
const show = ref(false)
const callPhoneNum = ref('')
const onRefresh = () => {
    setTimeout(() => {
        // Toast('刷新成功');
        isLoading.value = false;
    }, 1000);
    emit('onRefresh')
    // console.log(fieldName.value, userDataList2.value.length)
}

// 将数组拆分
const sliceArr = (array, size) => {
    let result = [];
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
        let start = x * size;
        let end = start + size;
        result.push(array.slice(start, end));
    }
    return result;
}
// 调起手机拨打电话操作
const callPhone = () => {
    window.location.href = 'tel://' + callPhoneNum.value
}
// 唤起确认拨打电话弹窗
const callOut = (phoneNum) => {
    // console.log(phoneNum)
    show.value = true
    callPhoneNum.value = phoneNum
}
// 点击复制按钮
const copy = (phoneNum) => {
    console.log(phoneNum)
    let copyInput = document.createElement("input"); // 创建标签
    copyInput.value = phoneNum; // 标签赋值
    document.body.appendChild(copyInput); // 添加标签
    copyInput.select(); // 选取文本框内容
    document.execCommand("copy"); // 调用浏览器复制
    document.body.removeChild(copyInput); // 复制成功后再将构造的标签 移除
}

// 将组件方法暴露给父组件,
const emit = defineEmits(['checked', 'loadMore', 'onRefresh'])
// 转单接口一加载单据的接口
const loadTransferOrderData = async (FC, tformname, tsystem_id, tmaintablename) => {
    let formData = new FormData()
    formData.append('tformname', tformname)
    formData.append('tsystem_id', tsystem_id)
    formData.append('tmaintablename', tmaintablename)
    formData.append('tflag', 1)
    const res = await request.getTransferOrderData(formData, FC)
    return res.data
}

// 转单接口二进行转单
const changeTransferOrderData = async (FC, DT, formdata, tformname, ttablename, tsystem_id, tliuchengmc, TLIUCHENGMXMC) => {
    let formData = new FormData()
    formData.append('formdata', formdata)
    formData.append('tformname', tformname)
    formData.append('ttablename', ttablename)
    formData.append('tsystem_id', tsystem_id)
    formData.append('tliuchengmc', tliuchengmc)
    formData.append('TLIUCHENGMXMC', TLIUCHENGMXMC)
    formData.append('tselecteddatagridsstr', JSON.stringify([]))
    try {
        const res = await request.changeTransferOrderData(formData, FC, DT)
        // console.log(res)
        return res.data
    }
    catch (err) {
        console.log(err)
    }
    // formData.append('tselecteddatagridsstr', [])
}

const actions2 = ref([])
const orderFlag = ref(false)
const transferOrder = (index) => {
    orderFlag.value = true
    // console.log(index)
    transferOrderIndex.value = index
    AJAX_UrlButton(actions2)
}
// 将actions2数组赋值
const AJAX_UrlButton = (actions2) => {
    actions2.value.length = 0
    props.userInfoDataList.AJAX_Url.forEach(function (value, index) {
        // console.log(value,index)
        actions2.value.push({ name: value.text1, tformname: value.name, tmaintablename: value.tablename, dt: value.dt })
    })
    // console.log(userInfoDataList.value.AJAX_Url,actions2.value)
}
const transferOrderIndex = ref('')

// 点击获取转单操作
const onSelect = async (item) => {
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
    });
    // console.log(transferOrderIndex.value,props.userInfoDataList.data[transferOrderIndex.value].SYSTEM_ID)
    console.log(item)
    const data = await loadTransferOrderData(item.tformname, item.tformname, props.userInfoDataList.data[transferOrderIndex.value].SYSTEM_ID, item.tmaintablename)
    // console.log(JSON.stringify(data))
    const data2 = await changeTransferOrderData(item.tformname, item.dt, JSON.stringify(data),
        item.tformname,
        item.tmaintablename,
        props.userInfoDataList.data[transferOrderIndex.value].SYSTEM_ID,
        props.userInfoDataList.data[transferOrderIndex.value].SYSTEM_LCMC,
        props.userInfoDataList.data[transferOrderIndex.value].SYSTEM_LCMXMC_ORG,
    )
    try {
        closeToast();
        orderFlag.value = false
        if (data2.PAPA3) {
            if (dd.env.platform !== "notInDingTalk") {
                dd.biz.util.openLink({
                    url: `${baseUrl.value} + 'WAP' + ${data2.PAPA3}`,
                    onSuccess: function (result) {
                        /**/
                    },
                    onFail: function (err) { }
                })
            }
            if (navigator.userAgent.indexOf("wxwork") <= 0 && navigator.userAgent.indexOf("DingTalk") <= 0) {
                window.location.href =  './WAP' + data2.PAPA3
            }
            // else {
            //     window.location.href =  'WAP' + data2.PAPA3
            // }
        }
        else {
            // console.log(data2.MSG.split(data2.RESULT)[1])
            showToast(data2.MSG.split(data2.RESULT)[1].replace(/\[|]/g, ''))
        }
    }
    catch (err) {
        closeToast();
        console.log(err)
    }

}
// 转单，转操作，转订单详细操作
const goDetails = async (item, index) => {
    console.log(item, index)
    showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
    });
    const data = await loadTransferOrderData(item.name, item.name, props.userInfoDataList.data[index].SYSTEM_ID, item.tablename)
    console.log(data);
    const data2 = await changeTransferOrderData(item.name, item.dt, JSON.stringify(data),
        item.name,
        item.tablename,
        props.userInfoDataList.data[index].SYSTEM_ID,
        props.userInfoDataList.data[index].SYSTEM_LCMC,
        props.userInfoDataList.data[index].SYSTEM_LCMXMC_ORG,
    )
    try {
        // window.location.href = ('http://www.baidu.com')
        closeToast();
        if (data2.PAPA3) {
            if (dd.env.platform !== "notInDingTalk") {
                dd.biz.util.openLink({
                    url: `${baseUrl.value} + 'WAP' + ${data2.PAPA3}`,//要打开链接的地址
                    onSuccess: function (result) {
                        /**/
                    },
                    onFail: function (err) { }
                })
            }
            if (navigator.userAgent.indexOf("wxwork") <= 0 && navigator.userAgent.indexOf("DingTalk") <= 0) {
                window.location.href =  './WAP' + data2.PAPA3
            }
            // else {
            //     window.location.href =  'WAP' + data2.PAPA3
            // }
        }
        // window.location.href = ('http://www.baidu.com')
        else {
            // console.log(data2.MSG.split(data2.RESULT)[1])
            showToast(data2.MSG.split(data2.RESULT)[1].replace(/\[|]/g, ''))
        }
    }
    catch (err) {
        closeToast();
        console.log(err)
    }
}


const loadMore = () => {
    emit('loadMore')
}
const chooseSYSTEM_ID = ref([])
const checked = (name, SYSTEM_ID, SYSTEM_LCMC, SYSTEM_LCMXMC_ORG) => {
    // console.log(name)
    // let chooseSYSTEM_ID = []
    if (!chooseList.value.includes(name)) {
        totalMoney.value.push(name) // 判断已选列表中是否存在该id，不是则追加进去
        chooseList.value.push(name) // 判断已选列表中是否存在该id，不是则追加进去
        chooseSYSTEM_ID.value.push({ SYSTEM_ID: SYSTEM_ID, SYSTEM_LCMC: SYSTEM_LCMC, SYSTEM_LCMXMC_ORG: SYSTEM_LCMXMC_ORG, rn: chooseSYSTEM_ID.rn })
    } else {
        let index = chooseList.value.indexOf(name) // 求出当前id的所在位置
        // console.log()
        chooseList.value.splice(index, 1) // 否则则删除
        totalMoney.value.splice(index, 1) // 否则则删除
        chooseSYSTEM_ID.value.splice(index, 1)
    }
    // console.log(chooseList.value)
    // console.log(this.chooseList,name)
    emit('checked', chooseList.value, chooseSYSTEM_ID.value)
}

const scrollRef = ref() //名字需要跟上面模板中定义的一样
const loadingMore = ref(false)
onMounted(() => {
    // console.log(scrollRef.value)
    // 触底加载事件
    scrollRef.value.addEventListener('scroll', () => {
        const { scrollTop, offsetHeight, scrollHeight } = scrollRef.value
        // console.log(scrollTop, offsetHeight, scrollHeight,)

        if (loadingMore.value)
            return

        if (scrollTop + offsetHeight >= scrollHeight - 40) {
            //滚动条到达底部
            if (props.userInfoDataList.data.length < props.userInfoDataList.sum.count) {
                loadMore()
                console.log('loadmore')
            }
            console.log(props.userInfoDataList.data.length, props.userInfoDataList.sum.count)
            // console.log(scrollTop, offsetHeight, scrollHeight,props.userInfoDataList.data.length , props.userInfoDataList.sum.count)
        }
    })
})
// 暴露值给父组件
defineExpose({
    chooseList,
    loadingMore,
}); 
</script>

<style lang="less" scoped>
.page-content {
    &::-webkit-scrollbar {
        display: none;
    }

    .van-pull-refresh {
        overflow: none;
    }

    .card {
        border-radius: var(--van-radius-md);
    }

    .checked {
        .checkBorder {
            // border: solid 1px rgba(226, 226, 226, 1);
            width: 20px;
            height: 20px;
            border-radius: 2px;
            color: rgba(80, 80, 80, 1);
        }

        .van-icon {
            color: #fff;
            // border: solid 1px red;
            background-color: #1890ff;
            border-color: #1890ff;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 23px;
            box-sizing: border-box;
            font-size: 14px;
            border-radius: 2px;
        }
    }

    .name {
        min-width: 42px;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        // border: solid 1px red;
    }

    .options {
        font-size: 14px;
        color: rgba(24, 144, 255, 1);
    }

    .van-divider {
        margin: 0px;
    }

    .card-content1 {
        .address {
            display: flex;

            .addressed {
                color: #666666;
            }

            .van-icon-location {
                position: relative;
                top: 2px;
            }
        }

        .centerList {
            position: relative;

        }

        .taglist {
            flex-wrap: wrap;
            width: 225px;
        }

        .phone {
            color: #657786;
            display: flex;
            justify-content: flex-end;
            position: absolute;
            right: 0;
            // top: 0;
            align-items: center;

            img {
                width: 14px;
                height: 14px;
            }
        }

        .buyOptions {
            color: rgb(96, 178, 255);
            // border: solid 1px red;
            display: flex;
            flex-wrap: wrap;

            :deep(.van-tag--large) {
                font-size: 12px;
                padding: 2px 5px 2px 5px;
                border-radius: 2px;
            }
        }
    }

    .card-content2 {
        .title {
            .titleDetails {
                color: #999999;
            }

            .datas {
                color: #333333;
            }
        }
    }

    .card-content3 {
        border: solid 1px rgb(247, 248, 250);
        background-color: rgb(247, 248, 250);
        border-radius: 2px;

        span {
            color: #666666;
        }
    }

    .border {
        // height: 1px;
        background-color: rgba(233, 233, 233, 1);
    }

    .style1 {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        align-items: baseline;

        // height: 24px;
        // line-height: 24px;
        .titleMoney {
            color: rgba(102, 102, 102, 1);
        }

        .moneyDetails {
            color: rgba(17, 17, 17, 1);
            font-size: 16px;
            font-weight: bold;
        }
    }

    .style2 {
        width: 100%;
        display: flex;
        align-items: flex-end;
        align-items: baseline;

        // border: solid 1px red;
        // height: 24px;
        // line-height: 24px;
        .titleMoney {
            color: rgba(102, 102, 102, 1);
        }

        .moneyDetails {
            color: #111;
            font-size: 16px;
            font-weight: bold;
        }
    }

    .style3 {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        align-items: baseline;
        margin-bottom: 8px;

        // border: solid 1px red;
        // height: 24px;
        // line-height: 24px;
        .titleMoney {
            color: rgba(102, 102, 102, 1);
        }

        .moneyDetails3 {
            color: #111;
            font-size: 16px;
            font-weight: bold;
        }
    }

    .getDetails {
        display: flex;
        align-items: center;

        .bottonList {
            justify-content: flex-end;
            width: 100%;
            // border:solid 1px red
        }

        .userDetails {
            width: 83px;
            height: 31px;
            color: rgb(102, 102, 102);
            font-size: 13px;
            border-radius: 16px;
            background-color: white;
            border: solid 1px rgb(221, 221, 221) 0px 0px 0px 1px;
        }

        .order {
            width: 83px;
            border: rgba(24, 144, 255, 1) solid 1px;
            color: rgba(24, 144, 255, 1);
        }

        .borders {
            border: rgba(229, 229, 229, 1) solid 1px;
        }
    }

    .callPhone {
        margin-top: 46px;
        text-align: center;
    }

    .phoneTips {
        color: rgba(212, 48, 48, 1);
        font-size: 12px;
        text-align: center;
    }

    .nomore {
        color: var(--van-gray-6);
        text-align: center;
        font-size: var(--van-list-text-font-size);
        height: 90px;
        line-height: 20px;
    }
}
</style>