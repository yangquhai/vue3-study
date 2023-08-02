<!-- 用于card信息的渲染 -->
<template>
    <div class="page-content">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <div v-if="userDataList.length != 0">
            <div v-for="(item, index) in userDataList" :key="index" class="card">
                <div class="card-header flex">
                    <div class="checked flex">
                        <div class="checkBorder"
                            :style="{ 'border': (chooseList.includes(item.name) ? 'solid 1px #ffffff' : 'solid 1px rgba(226, 226, 226, 1)') }"
                            @click="checked(item.name, item.money)">
                            <van-icon v-show="chooseList.includes(item.name)" name="success" />
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
                        <div class="address flex flex-l">
                            <img class="m-r-4" src="../assets/address.svg" alt="">
                            <small class="addressed">{{ SHDD[index] }}</small>
                        </div>
                        <div class="centerList flex  m-t-8 ">

                            <div class="taglist flex flex-l">
                                <div class="buyOptions m-r-4 m-b-4" v-for="(item) in BQ[index]">
                                    <van-tag color="#fff2e9" text-color="#fd9148" size="large" v-if="BQ[index]">
                                        <!-- {{ tagBM[index] }} -->
                                        {{ item }}
                                    </van-tag>
                                </div>
                            </div>

                            <div class="phone" @click="callOut(LXDH[index])">
                                <img src="../assets/phone.svg" alt="">
                                <small>{{ LXDH[index] }}</small>
                            </div>
                        </div>

                    </div>
                    <small class="card-content2">
                        <div class="van-row m-t-12 m-r-12 m-l-12">
                            <div class="title van-col van-col--8 flex flex-col flex-l" v-for="(item) in ZDY[index]">
                                <div class="titleDetails">{{ item.title }}</div>
                                <div class="datas m-t-4 m-b-12" v-if="ZDY[index]">{{ item.value }}</div>
                            </div>
                            <!-- <div class="title van-col van-col--8 flex flex-col flex-l" v-if="DGY[index]">
                                <div class="titleDetails">导购员</div>
                                <div class="datas m-t-4 m-b-12" v-if="DGY[index]">{{ DGY[index] }}</div>
                            </div>
                            <div class="title van-col van-col--8 flex flex-col flex-l" v-if="XGRQ[index]">
                                <div class="titleDetails">修改日期</div>
                                <div class="datas m-t-4 m-b-12" v-if="XGRQ[index]">{{ XGRQ[index] }}</div>
                            </div> -->
                        </div>
                    </small>
                    <div class="card-content3 m-t-0 m-l-12 m-r-12" v-if="BZ[index]">
                        <div class="tips m-8">
                            <span> <small style="font-weight:bold;">最后跟进内容:</small> <small>{{ BZ[index] }}</small> </span>
                        </div>
                    </div>
                    <div class="border m-l-12 m-r-12" v-if="!BZ[index]"></div>
                </div>
                <div class="card-footer">
                    <div class="style1 m-b-12" v-if="item.button.length == 3">
                        <small class="titleMoney">销售金额</small>
                        <small>￥</small>
                        <span class="moneyDetails">{{ ZJE[index] }}</span>
                    </div>
                    <div class="style3" v-if="item.button.length == 0">
                        <small class="titleMoney">销售金额</small>
                        <small>￥</small>
                        <span class="moneyDetails3">{{ ZJE[index] }}</span>
                    </div>

                    <div class="getDetails" v-if="item.keep">
                        <div class="style2" v-if="item.button.length != 3 && item.button.length != 0">
                            <small class="titleMoney">销售金额</small>
                            <small>￥</small>
                            <span class="moneyDetails">{{ ZJE[index] }}</span>
                        </div>

                        <div class="bottonList flex">
                            <div v-for="(item2, index2) in item.button" :key="index2">
                                <button class="userDetails borders m-l-8" @click="goDetails"
                                    v-if="item2 == '转测量' && item.button.length != 4">{{ item2 }}</button>
                                <button class="userDetails borders m-l-8" @click="goDetails"
                                    v-if="item2 == '转收款' && item.button.length != 4">{{ item2 }}</button>
                                <div v-else>
                                    <button class="userDetails borders m-l-8" @click="transferOrder" v-if="item2 == '转单'">{{
                                        item2
                                    }}</button>
                                </div>
                                <button class="userDetails order m-l-8" @click="goDetails"
                                    v-if="item2 == '客户详情'">客户详情</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- </van-pull-refresh> -->
        <!-- 用于唤起弹窗，拨打电话 -->
        <van-dialog v-model:show="show" show-cancel-button confirmButtonText="拨打电话" confirmButtonColor='#1890ff'
            cancelButtonText="复制" @confirm="callPhone()">
            <p class="callPhone">{{ callPhoneNum }}</p>
            <p class="phoneTips">为了保护数据的安全性，本次的操作被系统记录。</p>
        </van-dialog>

        <div class="nomore">
            <van-divider :style="{ color: '#969799', borderColor: '#969799', padding: '0 16px' }">没有更多了..</van-divider>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    userInfoDataList: Object
})


// 解析后端传输的字段，筛选出符合要求的数据,并对数据进行处理
const fieldName = computed(() => {
    let fieldName = props.userInfoDataList.fieldname
    return fieldName
})
const userDataList2 = computed(() => {
    let userDataList2 = props.userInfoDataList.data
    return userDataList2
})
// 客户名称筛选
const KHMC = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '姓名') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 状态筛选

const SYSTEM_LCMXMC = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '状态') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 备注筛选
const BZ = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '备注') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
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
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '电话') {
                    if (userDataList2.value[i][fieldName.value[j].fieldname].length > 11)
                        KHMC.push((userDataList2.value[i][fieldName.value[j].fieldname].slice(0, 11) + '..'))
                    else
                        KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})

// 销售地址筛选
const SHDD = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '地址') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
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
    if (userDataList2.value != undefined && fieldName.value != undefined) {
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '字段1') {
                    sum++
                    KHMC.push({value:userDataList2.value[i][fieldName.value[j].fieldname],title:fieldName.value[j].text})
                }
            }
            size = sum
            sum = 0
        }
        // console.log(KHMC.length)
        // sliceArr(KHMC,size)
        // console.log(sliceArr(KHMC,size))
    }
    return sliceArr(KHMC,size)
})

// 标签筛选
const BQ = computed(() => {
    let KHMC = []
    let sum = 0
    let size = 0
    if (userDataList2.value != undefined && fieldName.value != undefined) {
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '标签') {
                    sum++
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
            size = sum
            sum = 0
        }
        // console.log(KHMC.length)
        // sliceArr(KHMC,size)
        // console.log(sliceArr(KHMC,size))
    }
    return sliceArr(KHMC,size)
})

// 总金额筛选
const ZJE = computed(() => {
    let LXDH = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '金额') {
                    if (userDataList2.value[i][fieldName.value[j].fieldname] < 100000)
                        LXDH.push(Math.trunc(userDataList2.value[i][fieldName.value[j].fieldname]).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'))
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

const userDataList = reactive([
    { button: ['转测量', '转收款', '转单', '客户详情'], keep: 1 },
    { button: ['转测量', '转收款', '客户详情'], keep: 1 },
    { button: [], keep: 0 },
    { button: ['转测量', '转收款', '转单', '客户详情'], keep: 1 },
    { button: ['转测量', '转收款', '客户详情'], keep: 1 },
    { button: [], keep: 0 },
    { button: ['转测量', '转收款', '转单', '客户详情'], keep: 1 },
    { button: ['转测量', '转收款', '客户详情'], keep: 1 },
    { button: [], keep: 0 }, { button: [], keep: 0 },])
// const title = ref(['部门', '导购员', '最后跟踪时间'])
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
    console.log(fieldName.value, userDataList2.value.length)
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
const emit = defineEmits(['transferOrder', 'checked'])
const transferOrder = () => {
    // this.orderFlag = true
    emit('transferOrder')
}
const checked = (name, money) => {
    if (!chooseList.value.includes(name)) {
        totalMoney.value.push({ name: name, money: money }) // 判断已选列表中是否存在该id，不是则追加进去
        chooseList.value.push(name) // 判断已选列表中是否存在该id，不是则追加进去
    } else {
        let index = chooseList.value.indexOf(name) // 求出当前id的所在位置
        // console.log()
        chooseList.value.splice(index, 1) // 否则则删除
        totalMoney.value.splice(index, 1) // 否则则删除
    }
    // console.log(this.chooseList)
    // console.log(this.chooseList,name)
    emit('checked', totalMoney.value)
}
</script>

<style lang="less" scoped>
.page-content {
    &::-webkit-scrollbar {
        display: none;
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
            img {
                width: 14px;
                height: 14px;
            }

            .addressed {
                color: #666666;
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

            img {
                width: 14px;
                height: 14px;
            }
        }

        .buyOptions {
            color: rgb(96, 178, 255);

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
        height: 80px;
    }
}</style>