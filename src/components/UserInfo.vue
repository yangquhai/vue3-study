<!-- 用于card信息的渲染 -->
<template>
    <div class="userinfo">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div v-if="userDataList.length != 0">
                <div v-for="(item, index) in userDataList" :key="index" class="userinfoDataList">
                    <div class="top">
                        <div class="checked">
                            <div class="checkBorder"
                                :style="{ 'border': (chooseList.includes(item.name) ? 'none' : 'solid 1px rgba(226, 226, 226, 1)') }"
                                @click="checked(item.name, item.money)">
                                <van-icon v-show="chooseList.includes(item.name)" name="success" />
                            </div>
                        </div>
                        <div class="name">
                            {{ KHMC[index] }}
                        </div>
                        <div class="options">
                            {{ SYSTEM_LCMXMC[index] }}
                            <van-icon style="font-weight:bold;" name="arrow" />
                        </div>
                    </div>
                    <van-divider />
                    <div class="center">
                        <div class="address">
                            <img src="../assets/address.svg" alt="">
                            <div class="addressed">{{ SHDD[index] }}</div>
                        </div>
                        <div style="display:flex;" class="centerList">
                            <div class="taglist">
                                <div class="buyOptions">
                                    <van-tag color="#fff2e9" text-color="#fd9148" size="large" v-if="tagBM[index]">{{
                                        tagBM[index] }}</van-tag>
                                    <!-- <van-tag color="rgba(234,84,85,0.1)" text-color="#ea5455" size="large"  v-if="item.money=='4500'">{{item2}}</van-tag>
              <van-tag color="rgba(115,103,240,0.1)" text-color="#7367f0" size="large"  v-if="item.money=='2300'">{{item2}}</van-tag> -->
                                </div>
                                <div class="buyOptions">
                                    <van-tag color="#fff2e9" text-color="#fd9148" size="large" v-if="XSQD[index]">{{
                                        XSQD[index]
                                    }}</van-tag>
                                    <!-- <van-tag color="rgba(234,84,85,0.1)" text-color="#ea5455" size="large"  v-if="item.money=='4500'">{{item2}}</van-tag>
              <van-tag color="rgba(115,103,240,0.1)" text-color="#7367f0" size="large"  v-if="item.money=='2300'">{{item2}}</van-tag> -->
                                </div>
                            </div>
                            <div class="phone" @click="callOut(item.phone)">
                                <img src="../assets/phone.svg" alt="">
                                <div>{{ LXDH[index] }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <div style="display:flex">
                            <div class="title" v-if="YWY[index]">
                                <div class="titleDetails">业务员</div>
                            </div>
                            <div class="title" v-if="DGY[index]">
                                <div class="titleDetails">导购员</div>
                            </div>
                            <div class="title" v-if="XGRQ[index]">
                                <div class="titleDetails">修改日期</div>
                            </div>
                        </div>
                        <div class="contentData">
                            <div class="datas" v-if="YWY[index]">{{ YWY[index] }}</div>
                            <div class="datas" v-if="DGY[index]">{{ DGY[index] }}</div>
                            <div class="datas" v-if="XGRQ[index]">{{ XGRQ[index] }}</div>
                        </div>
                    </div>
                    <div class="bottoms" v-if="BZ[index]">
                        <div class="tips">
                            <span> <span style="font-weight:bold;">最后跟进内容:</span> <span>{{ BZ[index] }}</span> </span>
                        </div>
                    </div>
                    <div class="border" v-if="!BZ[index]"></div>
                    <div class="style1" v-if="item.button.length == 3">
                        <span class="stylemoney">销售金额</span>
                        <span>￥</span>
                        <span class="moneyDetails">
                            {{ ZJE[index] }}
                        </span>
                    </div>
                    <div class="style3" v-if="item.button.length == 0">
                        <span class="titleMoney">销售金额</span>
                        <span class="points" style="color: #111;">￥</span>
                        <span class="prices">
                            <span class="moneyDetails3">
                                {{ ZJE[index] }}
                            </span>
                        </span>
                    </div>
                    <div class="getDetails" v-if="item.keep">
                        <div class="money">
                            <div class="style2" v-if="item.button.length != 3 && item.button.length != 0">
                                <div class="titleMoney">销售金额</div>
                                <div>
                                    <span class="points" style="color: #111;">￥</span>
                                </div>
                                <div class="moneyList">
                                    <span class="moneyDetails">
                                        {{ ZJE[index] }}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div class="bottonList">
                            <div v-for="(item2, index2) in item.button" :key="index2">
                                <button class="userDetails borders" @click="goDetails"
                                    v-if="item2 == '转测量' && item.button.length != 4">{{ item2 }}</button>
                                <button class="userDetails borders" @click="goDetails"
                                    v-if="item2 == '转收款' && item.button.length != 4">{{ item2 }}</button>
                                <div v-else>
                                    <button class="userDetails borders" @click="transferOrder" v-if="item2 == '转单'">{{ item2
                                    }}</button>
                                </div>
                                <button class="userDetails order" @click="goDetails" v-if="item2 == '客户详情'">客户详情</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-pull-refresh>
        <van-dialog v-model="show" show-cancel-button confirmButtonText="拨打电话" confirmButtonColor='#1890ff'
            cancelButtonText="复制" @confirm="callPhone()">
            <p class="callPhone">{{ callPhoneNum }}</p>
            <p class="phoneTips">为了保护数据的安全性，本次的操作被系统记录。</p>
        </van-dialog>

        <div class="nomore"></div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
    userInfoDataList: Object
})

const formDate = computed(() => {
    for (let i = 0; i < userDataList.value.length; i++) {
        if (userDataList.value[i].money < 100000)
            valueStr.value.push(userDataList.value[i].money.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,'))
        else
            // this.userDataList[i].money
            valueStr.value.push((userDataList.value[i].money / 10000).toFixed(2).toString())
    }
    console.log(valueStr.value[0])
    return valueStr.value
})
const phone = computed(() => {
    let phone = []
    for (let i = 0; i < userDataList.value.length; i++) {
        if (userDataList.value[i].phone.length > 11)
            phone.push((userDataList.value[i].phone.slice(0, 11) + '..'))
        else
            phone.push(userDataList.value[i].phone)
        // console.log(phone)
    }
    return phone
})
const fieldName = computed(() => {
    let fieldName = props.userInfoDataList.fieldname
    return fieldName
})
const userDataList2 = computed(() => {
    let userDataList2 = props.userInfoDataList.data
    return userDataList2
})
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
const LXDH = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '电话') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
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
const tagBM = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '标签' && fieldName.value[j].fieldname == 'BM') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
const XSQD = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '标签' && fieldName.value[j].fieldname == 'XSQD') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
const YWY = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '字段1' && fieldName.value[j].fieldname == 'YWY') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
const DGY = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '字段1' && fieldName.value[j].fieldname == 'DGY') {
                    KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
const XGRQ = computed(() => {
    let KHMC = []
    if (userDataList2.value != undefined && fieldName.value != undefined)
        for (let i = 0; i < userDataList2.value.length; i++) {
            for (let j = 0; j < fieldName.value.length; j++) {
                if (fieldName.value[j].type == '字段1' && fieldName.value[j].fieldname == 'XGRQ') {
                    if (fieldName.value[j].lb == '数据:日期框') {
                        let arr = userDataList2.value[i][fieldName.value[j].fieldname].split('T')
                        KHMC.push(arr[0])
                    }
                    else if (fieldName.value[j].lb == '数据:时间框') {
                        KHMC.push(userDataList2.value[i][fieldName.value[j].fieldname])
                    }
                }
            }
        }
    // console.log(KHMC)
    return KHMC
})
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
const userData = reactive({
    name: '杨屈海',
    phone: '18173135079',
    address: '广州市黄浦区光谱西路65号凌宇大厦三楼广州市扬海数码科技有限公司(广州市扬海数码科技有限公司)',
    price: '零售',
    number: 'OPGZ广州05080006',
    buyAddress: '广红综合市场',
    buyPeople: '杨屈海',
    buyTime: '6/17 19:00',
    tips: '广州市黄浦区光谱西路65号凌宇大厦三楼广州市扬海数码科技有限公司'
})
const title = ref(['部门', '导购员', '最后跟踪时间'])
const chooseList = ref([])
const totalMoney = ref([])
const optionsFlag = ref(false)
const valueStr = ref([])
const bigValueStr = ref([])
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
const callPhone = () => {
    window.location.href = 'tel://' + this.callPhoneNum
}
const callOut = (phoneNum) => {
    console.log(phoneNum)
    show.value = true
    callPhoneNum.value = phoneNum
}
const goDetails = () => {
    console.log(222)
    // console.log(userDataList.value[0].money.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,'),formDate.value)
    // this.$router.push({path: '/details', query: {selected: "2"}});
}
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
.userinfo {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 86vh;

    // height: 100px;
    // border: solid 1px rgb(239, 242, 245);
    // border: solid 1px red;
    // height: 90%;
    // border-radius: 10px;
    // margin-top: 20px;
    // min-height: 400px;
    .userinfoDataList {
        margin-bottom: 10px;
        background-color: #ffffff;
        border-radius: 4px;
    }

    .taglist {
        // width: 225px;
        // border: solid 1px red;
        display: flex;
        // margin-left: 14px;
        flex-wrap: wrap;
    }

    .top {
        // margin-top: 8px;
        padding-top: 9px;
        margin-left: 9px;
        display: flex;
        align-items: center;
        // border: solid 1px red;
        margin-right: 12px;

        .checked {

            // margin-right: 6px;
            // position: absolute;
            .checkBorder {
                // border: solid 1px rgba(226, 226, 226, 1);
                width: 20px;
                height: 20px;
                border-radius: 2px;
                color: rgba(80, 80, 80, 1);
            }

            .van-icon {
                color: #fff;
                // padding: solid 1px #1989fa;
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

            img {
                width: 26px;
                height: 26px;
                position: absolute;
                margin-left: -3px;
                margin-top: -3px;
            }
        }

        .name {
            min-width: 42px;
            // margin-top: 8px;
            font-weight: bold;
            font-size: 14px;
            color: #333333;
            margin-left: 8px;
            // border: solid 1px red;
        }

        .options {
            // margin-top: 8px;
            font-size: 14px;
            // position: absolute;
            // margin-left: 242px;
            margin-left: auto;
            margin-right: -5px;
            // width: 338px;
            // display: flex;
            // justify-content: flex-end;
            color: rgba(24, 144, 255, 1);

            // border: solid 1px red;
            // align-items: center;
            .van-icon {
                margin-left: 0px;
            }
        }
    }

    .van-divider {
        // border: solid 1px red;
        margin: 0px;
        margin-top: 8px;
    }

    .center {
        // margin-left: 15px;
        // border: solid 1px red;
        position: relative;
        margin-top: 6px;

        .address {
            margin-left: 12px;
            // color: rgb(183,191,199);
            // border: solid 1px red;
            display: flex;
            margin-right: 12px;

            // text-align: right;
            // width: 335px;
            // justify-items: flex-end;
            img {
                width: 14px;
                height: 14px;
                // margin-top:3px;
                margin-right: 3px;
                // position: absolute;
            }

            .addressed {
                font-size: 12px;
                // border:solid 1px red;
                // width: 335px;
                color: #666666;
                // margin-left: auto;
                // display: inline-block;
                // text-align: justify;
                // margin-top: 3px;
            }
        }

        .centerList {
            // border: solid 1px red;
            // width: 335px;
            // width: 100%;
            margin-right: 12px;
            margin-left: 12px;
            display: flex;
            // justify-content: flex-end;
        }

        .phone {
            // width: 25%;
            // margin-right: 12px;
            margin-top: 8px;
            // font-weight: bold;
            font-size: 12px;
            // margin-left: 7px;
            color: #657786;
            display: flex;
            // justify-content: flex-end;
            margin-left: auto;

            img {
                width: 14px;
                height: 14px;
                // margin-top: 1px;
            }
        }

        .buyOptions {
            // margin-left: 15px;
            display: flex;
            color: rgb(96, 178, 255);
            margin-top: 7px;
            // border: solid 1px red;
            margin-right: 4px;

            :deep(.van-tag--large) {
                // border: solid 1px red;
                font-size: 12px;
                padding: 2px 5px 2px 5px;
                border-radius: 2px;
            }
        }
    }

    .content {
        margin-left: 15px;
        margin-top: 7px;
        font-size: 12px;

        // border: solid 1px red;
        .title {

            // display: flex;
            .titleDetails {
                width: 97px;
                text-align: center;
                margin-right: 20px;
                color: #999999;
                height: 18px;
                // border: solid 1px red;
            }
        }

        .contentData {
            display: flex;
            // margin-top: 0px;
            width: 103%;

            // border: solid 1px red;
            .datas {
                width: 97px;
                text-align: center;
                color: #333333;
                // border: solid 1px red;
                margin-right: 20px;
            }
        }
    }

    .bottoms {
        margin-left: 12px;
        margin-top: 7px;
        // width: 90%;
        border: solid 1px rgb(247, 248, 250);
        background-color: rgb(247, 248, 250);
        border-radius: 2px;
        margin-right: 12px;

        .tips {
            margin-top: 8px;
            margin-left: 8px;
            margin-bottom: 8px;
            margin-right: 7px;
        }

        span {
            color: #666666;
            font-size: 12px;
        }
    }

    .border {
        // border: solid 0.1px rgba(233, 233, 233, 1);
        margin-top: 6px;
        margin-bottom: 4px;
        // width: 90%;
        margin-left: 12px;
        margin-right: 12px;
        height: 0.7px;
        background-color: rgba(233, 233, 233, 1);
        // background-color: red;
    }

    .style1 {
        // border: solid 1px red;
        // margin-top: 9px;
        display: flex;
        justify-content: flex-end;
        margin-left: 12px;
        margin-right: 12px;
        align-items: flex-end;

        .stylemoney {
            color: rgba(102, 102, 102, 1);
            font-size: 12px;
            margin-top: 1px
        }

        span {
            font-size: 12px;
            margin-top: 1px;
        }

        .moneyDetails {
            // position: absolute;
            color: rgba(17, 17, 17, 1);
            font-size: 16px;
            font-weight: bold;
            // border: solid 1px red;
            margin-top: 0px;
            align-items: flex-start
        }
    }

    .style3 {
        display: flex;
        align-items: flex-end;
        // margin-left: 210px;
        // border: solid 1px red;
        padding-bottom: 8px;
        margin-left: 12px;
        margin-right: 12px;
        justify-content: flex-end;

        .titleMoney {
            // width: 50px;
            font-size: 12px;
        }

        .moneyDetails3 {
            // margin-left: 60px;
            // position: absolute;
            color: #111;
            font-size: 18px;
            // display: inline-block;
            // margin-top: -5px;
            // margin-left: -2px;
            // display: flex;
            font-weight: bold;
        }
    }

    .getDetails {
        display: flex;
        margin-top: 8px;
        padding-bottom: 8px;
        // border: solid 1px red;
        margin-left: 12px;
        margin-right: 12px;

        .bottonList {
            // border: solid 1px red;
            display: flex;
            // align-items: right;
            justify-content: flex-end;
            // margin-left: 0px;
            width: 420px;
            // border:solid 1px red
        }

        .money {
            width: 120px;
            margin-left: 15px;
            display: flex;
            margin-top: 7px;
            height: 18px;
            // left: 23px;
            // top: 611px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 12px;

            .style2 {
                width: 200px;
                position: relative;
                display: flex;
                align-items: flex-end;

                // border: solid 1px red;
                .points {
                    margin-left: 50px;
                }

                .titleMoney {
                    position: absolute;
                    // border: solid 1px red;
                    // margin-top: 5px;
                    width: 50px;
                }

                .moneyDetails {
                    // position: absolute;
                    color: #111;
                    font-size: 16px;
                    display: inline-block;
                    margin-top: -2px;
                    // margin-left: -2px;
                    // display: flex;
                    font-weight: bold;
                }

                .moneyDetails2 {
                    // position: absolute;
                    font-size: 12px;
                    color: #1890ff;
                    // margin-left: 24px;
                    // margin-top:4px;
                    font-weight: bold;
                    margin-left: -2px;
                }

                // span {
                //   margin-left: 50px;
                //   position: absolute;
                //   margin-top: 5px;
                //   // display: inline-block;
                // }
            }
        }

        .userDetails {
            width: 83px;
            height: 31px;
            color: rgb(102, 102, 102);
            // line-height: 150%;
            font-size: 13px;
            border-radius: 16px;
            background-color: white;
            margin-left: 8px;
            // margin-right: 8px;
            padding: 0px;
            border: solid 1px rgb(221, 221, 221) 0px 0px 0px 1px;
            // box-shadow: rgb(221, 221, 221) 0px 0px 0px 1px inset;
        }

        .order {
            // margin-left: 8px;
            // position: absolute;
            width: 75px;
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
        height: 40px;
        text-align: center;
        margin-bottom: 10px;
    }
}
</style>