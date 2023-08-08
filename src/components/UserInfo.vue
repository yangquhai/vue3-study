<!-- 用于card信息的渲染 -->
<template>
    <div class="page-content">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div v-for="(item, index) in props.userInfoDataList.data" class="card" @click="goSystem(index)">
            <div>
                <div class="card-header flex">
                    <div class="checked flex">
                        <div class="checkBorder"
                            :style="{ 'border': (chooseList.includes(item.rn) ? 'solid 1px #ffffff' : 'solid 1px rgba(226, 226, 226, 1)') }"
                            @click.stop="checked(item.rn)">
                            <van-icon v-show="chooseList.includes(item.rn)" name="success" />
                        </div>
                        <div class="name m-l-8">
                            {{ KHMC[index] }}
                        </div>
                    </div>

                    <small class="options">
                        {{ SYSTEM_LCMXMC[index] }}
                        <van-icon name="arrow" />
                    </small>
                </div>


                <van-divider />
                <div class="card-content">
                    <div class="card-content1 m-t-8 p-l-12 p-r-12">
                        <div class="address flex-l">
                            <i class="van-badge__wrapper van-icon van-icon-location m-r-4 txt-gray"></i>
                            <small class="addressed">{{ SHDD[index] }}</small>
                        </div>
                        <div class="centerList flex  m-t-8 ">

                            <div class="taglist flex flex-l">
                                <div class="buyOptions m-r-4 m-b-4" v-for="(item) in BQ[index]">
                                    <div v-for="(item2) in item">
                                        <van-tag color="#fff2e9" text-color="#fd9148" size="large" v-if="BQ[index]">
                                            {{ item2 }}
                                        </van-tag>
                                    </div>
                                </div>
                            </div>

                            <div class="phone" @click.stop="callOut(LXDH[index])">
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
                    <div class="border m-l-12 m-r-12" v-if="!BZ[index]"></div>
                </div>

                <div class="card-footer">
                    <div class="style1 m-b-12" v-if="AJAX_Url.length == 2">
                        <small class="titleMoney">销售金额</small>
                        <small>￥</small>
                        <span class="moneyDetails">{{ ZJE[index] }}</span>
                    </div>
                    <div class="style3" v-if="AJAX_Url.length == 0">
                        <small class="titleMoney">销售金额</small>
                        <small>￥</small>
                        <span class="moneyDetails3">{{ ZJE[index] }}</span>
                    </div>

                    <div class="getDetails">
                        <div class="style2" v-if="AJAX_Url.length != 2 && AJAX_Url.length != 0">
                            <small class="titleMoney">销售金额</small>
                            <small>￥</small>
                            <span class="moneyDetails">{{ ZJE[index] }}</span>
                        </div>

                        <div class="bottonList">
                            <div v-for="(item2, index2) in AJAX_Url"  style="display: flex;">
                                <div v-if="AJAX_Url.length < 3">
                                    <button class="userDetails borders m-l-8" @click.stop="goDetails">{{
                                    item2.text1 }}</button>
                                </div>
                                <div v-if="AJAX_Url.length > 2 && index2 == 0">
                                    <button  class="userDetails borders m-l-8"
                                    @click.stop="transferOrder">转单</button>
                                </div>

                                <div v-if="index2 == 0">
                                    <button class="userDetails order m-l-8" @click.stop="goDetails"
                                    >
                                    {{ KHBM[index].title }}
                                   
                                   </button>
                                </div>

                                
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        </van-pull-refresh>
        <!-- 用于唤起弹窗，拨打电话 -->
        <van-dialog v-model:show="show" show-cancel-button confirmButtonText="拨打电话" confirmButtonColor='#1890ff'
        :closeOnClickOverlay = "true"
            cancelButtonText="复制" @confirm="callPhone()">
            <!-- <p class="callPhone">{{ callPhoneNum }}</p> -->
            <p class="callPhone">18173135078</p>
            <p class="phoneTips">为了保护数据的安全性，本次的操作被系统记录。</p>
        </van-dialog>

        <div class="nomore" @click="loadMore">
            <!-- {{ KHBM }} -->
            没有更多了
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch  } from 'vue'

const props = defineProps({
    userInfoDataList: Object,
    isLoad: Boolean

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

const goSystem = (index) => {
    console.log(index)
}


// 获取AJAX_Url按钮
const AJAX_Url = computed(() => {
    let AJAX_Url = props.userInfoDataList.AJAX_Url
    // console.log(AJAX_Url)
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
                }
            }
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
                        if(props.userInfoDataList.data[i][fieldName.value[j].fieldname])
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
        // console.log(KHMC.length)
        // sliceArr(KHMC,size)
        for (let i = 0; i < sliceArr(KHMC, size).length; i++) {
            // console.log(sliceArr(KHMC,size)[i])
            for (let j = 0; j < sliceArr(KHMC, size)[i].length; j++) {
                // console.log(sliceArr(KHMC,size)[i][j].split(','))
                KHMC2.push(sliceArr(KHMC, size)[i][j].split(','))
            }
        }
        // console.log(KHMC2)
        // console.log(sliceArr(KHMC2,size))
    }
    return sliceArr(KHMC2, size)
})

// 总金额筛选
const ZJE = computed(() => {
    let LXDH = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '金额') {
                    if (props.userInfoDataList.data[i][fieldName.value[j].fieldname] < 100000)
                        LXDH.push(Math.trunc(props.userInfoDataList.data[i][fieldName.value[j].fieldname]).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'))
                    // this.valueStr.push(this.userDataList[i].money.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,'))
                    else
                        // this.userDataList[i].money
                        valueStr.value.push((userDataList.value[i].money / 10000).toFixed(2).toString())
                    // LXDH.push(Math.trunc(this.userDataList2[i][this.fieldName[j].fieldname]))
                }
            }
        }
    // console.log(LXDH)
    return LXDH
})

// 客户详情按钮筛选
const KHBM = computed(() => {
    let KHMC = []
    if (props.userInfoDataList.data != undefined && fieldName.value != undefined)
        for (let i = 0; i < props.userInfoDataList.data.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '客户详情按钮') {
                    KHMC.push({text:fieldName.value[j].text,title:'客户详情'})
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

const userDataList2 = reactive(['', '', '', '', '', '', '', '', '', '',])
const chooseList = ref([])
const totalMoney = ref([])
const valueStr = ref([])
const isLoading = ref(false)
const show = ref(false)
const callPhoneNum = ref('')
const onRefresh = () => {
    setTimeout(() => {
        // Toast('刷新成功');
        isLoading.value = false;
    }, 1000);
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

// 转单，转操作，转订单详细操作
const goDetails = () => {
    console.log(222)
    // console.log(userDataList.value[0].money.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,'),formDate.value)
    // this.$router.push({path: '/details', query: {selected: "2"}});
}

// 将组件方法暴露给父组件,
const emit = defineEmits(['transferOrder', 'checked','loadMore'])
const transferOrder = () => {
    // this.orderFlag = true
    emit('transferOrder')
}
const loadMore = () =>{
    emit('loadMore')
}
const checked = (name) => {
    // console.log(name)
    if (!chooseList.value.includes(name)) {
        totalMoney.value.push(name) // 判断已选列表中是否存在该id，不是则追加进去
        chooseList.value.push(name) // 判断已选列表中是否存在该id，不是则追加进去
    } else {
        let index = chooseList.value.indexOf(name) // 求出当前id的所在位置
        // console.log()
        chooseList.value.splice(index, 1) // 否则则删除
        totalMoney.value.splice(index, 1) // 否则则删除
    }
    console.log(chooseList.value)
    // console.log(this.chooseList,name)
    emit('checked',chooseList.value)
}
// 暴露值给父组件
defineExpose({
	chooseList
}); 
</script>

<style lang="less" scoped>
.page-content {
    &::-webkit-scrollbar {
        display: none;
    }

    .card {
        border-radius: var(--van-radius-md);

        .skeleton {
            .paragraphTitle {
                height: 40px;
            }

            .paragraphaddress {
                height: 50px;
            }

            .paragraphBZ {
                height: 50px;
            }
        }
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
            top: 0;
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
        height: 0.5px;
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
        line-height: 30px;
    }
}
</style>