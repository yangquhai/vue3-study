<!-- 协同列表首页,入口文件 -->
<template>
  <div class="content">
    <div class="mask" style="z-index:-1;background-color:rgb(239, 242, 245);"></div>
    <van-overlay z-index='100' :show="flag" @click="close" />
    <div style=" position: fixed;z-index:1000;width:100%;">
      <searchTab @search="search" :placeholder="placeholder"></searchTab>
      <div class="dropdown">
        <div v-for="(item, index) in tabList" :key="index" class="dropdownList" @click="dropdown(index)"
          :style="{ 'color': (index != chooseIndex ? 'rgba(50, 50, 51, 1)' : '#1890ff') }">
          <div>{{ item }}</div>
          <img src="../assets/single.svg" alt="" style="" v-if="index == chooseIndex">
          <img src="../assets/nosingle.svg" alt="" style="" v-if="index != chooseIndex">
          <!-- <i class="el-icon-caret-bottom" v-if="index!=chooseIndex"></i>
             <i class="el-icon-caret-top" v-if="index==chooseIndex"></i> -->
        </div>
      </div>
    </div>
    <transition>
      <div v-if="monthFlag" class="month">
        <div class="sort" v-for="(item, index) in monthList" :key="index" @click="chooseMonth(index, item)"
          :style="{ 'color': (index != chooseMonthIndex ? 'rgba(50, 50, 51, 1)' : '#1890ff') }">
          <div class="sortItem">
            <img src="../assets/选中.svg" alt="" v-if="index == chooseMonthIndex">
            <div>{{ item }}</div>
          </div>
        </div>
        <div class="calendar" v-if="calendarFlag">
          <div class="calelist" style="display:flex">
            <van-cell title="从" :value="date1" @click.stop="value1 = true" />
            <van-calendar v-model:show="value1" :show-confirm="false" @confirm="onConfirm" :min-date="minDate"
              :max-date="maxDate" />


            <van-cell title="至" class="van-cell2" :value="date2" @click.stop="value2 = true" />
            <van-calendar v-model:show="value2" :show-confirm="false" @confirm="onConfirm2" :min-date="minDate"
              :max-date="maxDate" />
          </div>
          <van-button round size="small" @click="close">确认</van-button>
        </div>
      </div>
    </transition>
    <transition>
      <div v-if="sortFlag" class="month">
        <div class="sort" v-for="(item, index) in sortList" :key="index" @click="choosesort(index, item)"
          :style="{ 'color': (index != chooseDateIndex ? 'rgba(50, 50, 51, 1)' : 'rgba(25, 137, 250, 1)') }">
          <div class="sortItem">
            {{ item.text }}
          </div>
          <div class="imgList">
            <!-- <img class="img1" src="../assets/down.png" alt="" @click="up(index)" v-if="index!=chooseDateIndex">
              <img class="img2" src="../assets/up.png" alt="" @click="down(index)" v-if="index!=chooseDateIndex">
              <img src="../assets/black-down.svg" alt="" v-if="index==chooseDateIndex&&index==chooseDateIndex">
              <img src="../assets/up.svg" alt="" v-if="index==chooseDateIndex&&index==chooseDateIndex"> -->
            <img class="img1" src="../assets/down.png" alt="" @click="down(index, item.order, 0)"
              v-if="item.order != 'desc'">
            <img class="img1" src="../assets/chooseDown.png" alt="" @click="down(index, item.order, 1)"
              v-if="item.order == 'desc'">
            <img class="img2" src="../assets/up.png" alt="" @click="up(index, item.order, 0)"
              v-if="item.order != 'descd'">
            <img class="img1" src="../assets/chooseDown.png" alt="" @click="up(index, item.order, 1)"
              v-if="item.order == 'descd'">
          </div>
        </div>
      </div>
    </transition>
    <transition>
      <div v-if="selectFlag" class="month">
        <div class="superSelect">
          <div class="title">
            流程
          </div>
          <div class="checkboxPre">
            <div class="procedure" v-for="(item, index) in procedureList" :key="index"
              @click="chooseProcedureTags(index, item.value)">
              <!-- <van-tag class="van-tag1" color="rgba(243, 243, 243, 1)" text-color="#999999" size="medium" v-if="!procedureIndex.includes(item)">{{item.name}}</van-tag>  -->
              <van-tag class="van-tag1" color="rgba(243, 243, 243, 1)" text-color="#999999" size="medium"
                v-if="!item.select">
                {{ item.name }}
              </van-tag>
              <van-tag class="van-tag2" color="#eef6ff" text-color="#1890ff" size="medium" v-else>{{ item.name
              }}</van-tag>
            </div>
          </div>
          <van-divider></van-divider>

          <!-- 日期框 -->
          <div v-for="(item, index) in dateList" :key="item.fieldname">
            <div class="title">
              {{ item.text }}
            </div>
            <div class="checkboxPre">
              <div class="procedure" v-for="(item2, index2) in item.values" :key="index2"
                @click="chooseDataTag(index, index2, item2)">
                <van-tag class="van-tag1" color="rgba(243, 243, 243, 1)" text-color="#999999" size="medium"
                  v-if="!item2.select">
                  {{ item2.value }}
                </van-tag>
                <van-tag class="van-tag2" color="#eef6ff" text-color="#1890ff" size="medium" v-else>{{ item2.value
                }}</van-tag>
              </div>
            </div>
            <calendar v-if="calendarFlag2"></calendar>
          </div>
          <van-divider></van-divider>

          <!-- 多选框 -->
          <div v-for="(item, index) in usertTagList" :key="index" class="muliselect">
            <div class="title">
              {{ item.text }}
            </div>
            <div class="checkboxPre">
              <div class="procedure" v-for="(item2, index2) in item.values" :key="index2"
                @click="chooseUserTag(index, index2, item2)">
                <van-tag class="van-tag1" color="rgba(243, 243, 243, 1)" text-color="#999999" size="medium"
                  v-if="!item2.select">
                  {{ item2.item }}
                </van-tag>
                <van-tag class="van-tag2" color="#eef6ff" text-color="#1890ff" size="medium" v-else>{{ item2.item
                }}</van-tag>
              </div>
            </div>
          </div>
          <van-divider></van-divider>
          <superFilter :tabListData="tabListData" @sift="sift"></superFilter>
        </div>
        <div class="userOptions2">
          <van-button class="button" round type="success" size="small">重置</van-button>
          <van-button class="button1" round type="success" size="small" @click="keep">保存</van-button>
          <van-button class="button3" round type="success" size="small" @click="sift">筛选</van-button>
        </div>
      </div>
    </transition>
    <div class="bottom">
      <div class="checkbox">
      </div>
      <div class="total">
        <div class="number">
          共{{ dataList.length }}条,已选{{ chooseList.length }}条
        </div>
        <div class="number">销售金额共{{ totalMoney }}</div>
      </div>
      <div class="userOptions">
        <button class="button1" @click="del">删除</button>
        <button class="button3" @click="edit">批量操作</button>
        <button class="button2" @click="goAddData" v-if="tabListData.newUrl">新增</button>
      </div>
      <van-action-sheet v-model:show="editFlag" :actions="actions" @select="onSelect" cancel-text="取消" />
      <van-action-sheet v-model:show="orderFlag" :actions="actions2" @select="onSelect" cancel-text="取消" />
    </div>
    <userInfo class="userInfo" ref="info" @checked="checked" @transferOrder="transferOrder"
      :userInfoDataList="userInfoDataList"></userInfo>
  </div>
</template>

<script setup>
import request from '_api'
import { ref, reactive, computed } from 'vue'
const tabList = ref(['当月', '排序', '筛选'])
const dataList = ref([])
// 用户选中的数组
const chooseList = ref([])
// 用户选择框
const placeholder = ref('')
// 自定义month月份选择
const monthList = ref(['昨日', '当日', '当周', '当月', '近30天', '当年', '全部', '自定义'])
// 高级筛选流程列表
const procedureList = ref([])
// 控制遮罩出现
const flag = ref(false)
// 控制日期筛选排序三种下拉框出现
const monthFlag = ref(false)
const sortFlag = ref(false)
const selectFlag = ref(false)
// 用户点击的索引
const chooseIndex = ref(null)
// 用户选中月份下拉框索引
const chooseMonthIndex = ref(null)
// 用户选中日期下拉框索引
const chooseDateIndex = ref(null)
// 判断是否为第一次点击
const firstIndex = ref(null)
// 判断点击选择的流程（可多选）
const procedureIndex = ref([])
// 判断选择的用户tags (可多选)
const userTagsIndex = ref([])
// 用于记录上一次点击的月份(处理单选框),如果值不为null说明有初始点击
const dateLastClick = ref([null])
const date1 = ref('请选择日期')
const date2 = ref('请选择日期')
// 控制日历框的出现
const calendarFlag = ref(false)
const calendarFlag2 = ref(false)
// 控制日历框的出现
const value1 = ref(false)
const value2 = ref(false)
// 筛选模块的数组
const tabListData = ref([])
// 用户信息的数组
const userInfoDataList = ref({})
// 转单按钮的下拉框控制
const editFlag = ref(false)
const actions = reactive([{ name: '批量审批' }, { name: '批量回退' }])
const orderFlag = ref(false)
const actions2 = reactive([{ name: '转收款' }, { name: '转订单' }, { name: '转出库' }])
// 月份限制
const minDate = ref(new Date(2020, 0, 1))
const maxDate = ref(new Date(2025, 0, 31))
const baseUrl = ref('http://dx.anywellchat.com:8888/ANYWELL_hylingls/')
// 总金额
const totalMoney = ref('')

// 获取页面数据
const getData = async () => {
  let formData = new FormData()
  formData.append('Ttablename', 'bxd_main')
  formData.append('Turl', 'bxd.aspx')
  formData.append('Tformnamecn', '4366')
  formData.append('Tsystem_lcmc', '报销单')
  formData.append('TisFirst', '1')
  try {
    const res = await request.getUserInfo(formData)
    tabListData.value = res.colums
    userInfoDataList.value = res.data
    tabList.value[0] = tabListData.value.dateType.defaultValue
    placeholder.value = tabListData.value.search.text
    procedureList.value = tabListData.value.lcmxmc
    totalMoney.value = userInfoDataList.value.sum[0].value
    if (totalMoney.value > 10000)
    totalMoney.value = (totalMoney.value / 10000).toFixed(0).toString() + '万'
    // console.log(userInfoDataList.value.sum[0].value)
  } catch (err) {
    console.log(err)
  }
}
getData()

// 计算总金额
// const totalMoney = computed(() => {
//   let sum = 0
//   // console.log(this.chooseList.length)
//   if (chooseList.value.length) {
//     for (let i = 0; i < chooseList.value.length; i++) {
//       // sum = this.dataList[i].money+this.dataList[i+1].money
//       // console.log(this.chooseList[i].money)
//       sum = sum + chooseList[i].value.money
//     }
//   }
//   else {
//     for (let i = 0; i < dataList.value.length; i++) {
//       // sum = this.dataList[i].money+this.dataList[i+1].money
//       // console.log(this.dataList[i].money)
//       sum = sum + dataList[i].value.money
//     }
//   }
//   // console.log(sum)
//   if (sum > 10000)
//     sum = (sum / 10000).toFixed(0).toString() + '万'
//   return sum
// })
// 计算排序数组
const sortList = computed(() => {
  let sortList = tabListData.value.orderType.orderType
  // console.log(tabListData.value)
  return sortList
})
// 计算type类型为多选模块数组
const usertTagList = computed(() => {
  let usertTagList = []
  for (let i = 0; i < tabListData.value.searchCondition.length; i++) {
    // console.log(this.tabListData.searchCondition[i])
    if (tabListData.value.searchCondition[i].type == "muliselect")
      usertTagList.push(tabListData.value.searchCondition[i])
    // console.log(usertTagList)
  }
  // console.log(usertTagList)
  return usertTagList
})
// 计算日期模块数组
const dateList = computed(() => {
  let dateList = []
  let index = -1
  for (let i = 0; i < tabListData.value.searchCondition.length; i++) {
    if (tabListData.value.searchCondition[i].type == 'datetime') {
      index = index + 1
      dateList.push(tabListData.value.searchCondition[i])
      // 判断是否有初始选择框为true的情况
      // console.log(dateList[index].values,index)
      for (let j = 0; j < dateList[index].values.length; j++) {
        if (dateList[index].values[j].select)
          // dateLastClick.value[index] = 1
          console.log(111)
      }
    }
  }
  // console.log(dateList)
  return dateList
})


//禁止滚动条滚动
const stop = () => {
  document.body.style.overflow = 'hidden';
  // document.addEventListener("touchmove",mo,{ passive: false });//禁止页面滑动
}
//取消滑动限制
const move = () => {
  var mo = function (e) {
    e.preventDefault();
  };
  document.body.style.overflow = '';//出现滚动条
  document.removeEventListener("touchmove", mo, false);
}

// 关闭下拉框
const close = () => {
  // console.log(this.value1.getFullYear())
  // console.log(this.getSimpleDate(this.value1)) 
  chooseIndex.value = null
  firstIndex.value = null
  monthFlag.value = false
  sortFlag.value = false
  selectFlag.value = false
  flag.value = false
  move()
}
// 点击跳转新增页面
const goAddData = () => {
  let url = baseUrl.value + tabListData.value.newUrl
  console.log(url)
  // window.open = (this.baseUrl + this.tabListData.newUrl,"blank")
  // window.location.href = ('http://www.baidu.com')
  window.location.href = (baseUrl.value + tabListData.value.newUrl)
}

// 点击出现下拉框
const dropdown = (index) => {
  stop()
  // console.log(this.chooseIndex,index)
  chooseIndex.value = index
  // console.log(this.firstIndex,index)
  // 判断是否第一次打开
  if (firstIndex.value != index) {
    if (index == 0) {
      monthFlag.value = true
      sortFlag.value = false
      selectFlag.value = false
      flag.value = true
    }
    if (index == 1) {
      monthFlag.value = false
      sortFlag.value = true
      selectFlag.value = false
      flag.value = true
    }
    if (index == 2) {
      monthFlag.value = false
      sortFlag.value = false
      selectFlag.value = true
      flag.value = true
    }
    // console.log(monthFlag,sortFlag)
  }
  // 再次点击
  else {
    if (chooseIndex.value == index) {
      chooseIndex.value = null
      flag.value = false
      monthFlag.value = false
      sortFlag.value = false
      selectFlag.value = false
      firstIndex.value = null
      move()
      return
    }
    else {
      // console.log(index,this.flag)
      if (flag.value == false && index == 0) {
        // console.log(index,this.flag)
        monthFlag.value = true
        flag.value = true
        return
      }
      if (flag.value == false && index == 1) {
        sortFlag.value = true
        flag.value = true
        return
      }
      if (flag.value == false && index == 2) {
        selectFlag.value = true
        flag.value = true
        return
      }
      if (flag.value == true) {
        flag.value = false
        monthFlag.value = false
        sortFlag.value = false
        selectFlag.value = false
        return
      }
    }
  }
  firstIndex.value = index
}

// 选择月份
const chooseMonth = (index, value) => {
  console.log(chooseIndex.value)
  console.log(index, value)
  // this.chooseIndex为0选择第一个
  chooseMonthIndex.value = index
  if (chooseIndex.value == 0) {
    if (index != 7) {
      chooseIndex.value = null
      firstIndex.value = null
      // this.tabList[0] = value
      tabList.value[0] = value
      // this.$set(this.tabList,0,value)
      // console.log(index)
      flag.value = false
      monthFlag.value = false
      sortFlag.value = false
      move()
    }
    else {
      calendarFlag.value = !calendarFlag.value
    }
  }
}
// 唤起日历插件进行日期自定义
const onConfirm = (date) => {
  value1.value = false;
  date1.value = getSimpleDate(date);
  console.log(date1.value)
}
const onConfirm2 = (date) => {
  value2.value = false;
  date2.value = getSimpleDate(date);
  console.log(date2.value)
}
// 中国标准时间 转换成 年月日
const getSimpleDate = (date) => {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  return y + '-' + m + '-' + d;
}

// 选择排序字段
const choosesort = (index, value) => {
  chooseDateIndex.value = index
  // console.log(index,value)
  // 再次点击相同索引，关闭下拉框
  if (chooseIndex.value == 1) {
    // this.tabList[0] = value
    chooseIndex.value = null
    firstIndex.value = null
    tabList.value[1] = value.text
    // this.$set(this.tabList,1,value.text)
    // console.log(index)
    flag.value = false
    monthFlag.value = false
    sortFlag.value = false
    move()
  }
}

// 点击排序字段选择升序还是降序
const up = (index, value, type) => {
  console.log(index, value, type)
  if (type == 0) {
    sortList.value[index].order = 'descd'
  }
  else {
    console.log('spec')
  }
}
const down = (index, value, type) => {
  console.log(index, value, type)
  if (type == 0) {
    sortList.value[index].order = 'desc'
  }
  else {
    console.log('spec')
  }
}

// 判断多选列表
const chooseUserTag = (index, index2, value) => {
  console.log(usertTagList.value[index].values[index2].select)
  if (usertTagList.value[index].values[index2].select) {
    // console.log(this.usertTagList[index].values[index2].select)
    usertTagList.value[index].values[index2].select = false
  }
  else {
    usertTagList.value[index].values[index2].select = true
  }
  console.log(value)
}
const chooseProcedureTags = (index, value) => {
  if (procedureList.value[index].select)
    procedureList.value[index].select = false
  else
    procedureList.value[index].select = true
  console.log(value)
}
// 日期单选
const chooseDataTag = (index, index2, value) => {
  // console.log(value)
  // console.log(dateLastClick.value[index])
  if (value.value == '自定义') {
    // 说明有初始值
    if (dateLastClick.value[index] != null)
      dateList.value[index].values[dateLastClick.value[index]].select = false
      dateList.value[index].values[index2].select = true
      calendarFlag2.value = true
  }
  // 当点击值为非自定义时
  else {
    calendarFlag2.value = false
     // 点击到相同的框
    if (dateList.value[index].values[index2].select) {
      // console.log(this.usertTagList[index].values[index2].select)
      dateList.value[index].values[index2].select = false
    }
    else {
      if (dateLastClick.value[index] != null)
        dateList.value[index].values[dateLastClick.value[index]].select = false
        dateList.value[index].values[index2].select = true
    }
  }
  dateLastClick.value[index] = index2
  // console.log(dateLastClick.value[index])
}

const onSelect = () => {
  console.log(333)
}
const search = (value) => {
  console.log(value)
}
const checked = (val) => {
  console.log(val)
  chooseList.value = val
}
const transferOrder = () => {
  console.log('zhaundan++++++++')
  orderFlag.value = true
}
const edit = () => {
  editFlag.value = true
  console.log('edit')
}
// 保存筛选框的值
const keep = () => {
  console.log('keep')
}

// 筛选模块弹窗关闭
const sift = () => {
  chooseIndex.value = null
  firstIndex.value = null
  flag.value = false
  selectFlag.value = false
  move()
}
</script>

<style lang="less" scoped>
.content {
  .v-enter-active {
    animation: testanimation 0.3s;
  }

  .v-leave-active {
    animation: testanimation 0.3s reverse;
  }

  @keyframes testanimation {
    from {
      transform: translateY(-100%);
    }

    to {
      transform: translateY(0px);
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    opacity: 0.9;
    background-color: rgba(0, 0, 0, 0.7);
    // border: solid 1px red;
    position: fixed;
    z-index: 999;
  }

  .dropdown {
    // border: solid 1px red;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -4px;

    img {
      width: 21px;
      height: 21px;
      // margin-left: 40px;
    }

    .dropdownList {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 125px;
      height: 31px;
      top: 114px;
      background-color: rgba(255, 255, 255, 1);
      color: rgba(80, 80, 80, 1);
      font-size: 12px;
      line-height: 150%;
      // border: solid 1px red;
      // text-align: center;
    }
  }

  .month {
    position: fixed;
    z-index: 999;
    width: 100%;
    top: 80px;
    padding-top: 4px;
    background-color: rgba(255, 255, 255, 1);
    max-height: 70%;

    // border: solid 1px red;
    // border: none;
    // margin-top: -1px;
    .sort {
      color: rgba(80, 80, 80, 1);
      // background-color: rgba(255, 255, 255, 1);
      // background-color: red;
      height: 34px;
      display: flex;
      align-items: center;

      // justify-content: center;
      .imgList {
        margin-left: 316px;
        // border: solid 1px red;
        position: absolute;

        img {
          // border: solid 1px red;
          // position: absolute;
          width: 14px;
          height: 14px;
        }
      }

      .sortItem {
        width: 90%;
        font-size: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(242, 243, 245, 1);
        margin-left: 16px;

        img {
          width: 14px;
          height: 14px;
          position: absolute;
          margin-left: 321px;
        }
      }
    }

    .calendar {
      margin-left: 15px;
      margin-top: 4px;

      // display: flex;
      // border: solid 1px red;
      :deep(.van-cell__value) {
        // text-align: left;
        // border: solid 1px red;
        text-align: left;
        // width: 10px;
        margin-left: -30px;
      }

      .van-cell {
        padding: 0px;
        font-size: 12px;
        width: 34%;
      }

      .van-cell::after {
        border-bottom: none;
      }

      .van-cell2 {
        margin-left: 50px;
        // border: solid 1px red;
      }

      .van-button {
        margin-left: 260px;
        margin-bottom: 5px;
        width: 83px;
        height: 31px;
        // color: rgb(102, 102, 102);
        line-height: 150%;
        font-size: 13px;
        border-radius: 16px;
        background-color: rgba(24, 144, 255, 1);
        color: rgba(255, 255, 255, 1);
        border: none;
        // background-color: red;
      }

      :deep(.el-input__inner) {
        border: none;
        font-size: 12px;
        // border: solid 1px red;
        // width: 80px;
        // height: 28px;

        padding: 0px;
        margin-left: 35px;
      }

      :deep(.el-input) {
        width: 80px;
        // border: solid 1px red;
      }

      :deep(.el-input__icon) {
        display: none;
      }

      // /deep/ .el-input__inner {
      //   border: none;
      // }
    }

    .sort:nth-last-child(1) {
      .sortItem {
        border: none;
      }

    }

    .userOptions2 {
      // border: solid 1px red;
      width: 100%;
      // margin-left: 85px;
      margin-top: -25px;
      position: fixed;
      display: flex;
      z-index: 2;
      justify-content: flex-end;
      background-color: rgba(255, 255, 255, 1);
      padding-bottom: 8px;

      .van-button {
        width: 83px;
        height: 31px;
        border: none;
        background-color: rgba(24, 144, 255, 1);
        color: rgba(255, 255, 255, 1);
        border-radius: 16px;
        margin-left: 10px;
        // margin-bottom: 10px;
        // color: rgba(128, 128, 128, 1);
      }

      .button {
        border: solid 1px rgba(217, 217, 217, 1);
        background-color: white;
        color: rgba(128, 128, 128, 1);
      }

      .button1 {
        border: solid 1px rgba(24, 144, 255, 1);
        color: rgba(24, 144, 255, 1);
        background-color: white;
      }

      .button3 {
        margin-right: 9px;
      }
    }

    .superSelect {
      // border: solid 1px red;
      overflow: scroll;
      // height: 497px;
      height: 60vh;
      background-color: rgba(255, 255, 255, 1);

      .muliselect {
        overflow: scroll;
        // width:1200px; 
        // max-height:100px;
      }

      .title {
        padding-top: 8px;
        margin-left: 15px;
        font-size: 12px;
        color: rgba(50, 50, 51, 1);
        // border: solid 1px red;
      }

      .checkboxPre {
        // border: solid 1px red;
        display: flex;
        margin-left: 8px;
        flex-wrap: wrap
      }

      .van-divider {
        // margin: 0px;
        // border: solid 0.5px rgba(242, 243, 245, 1);
        // background-color: rgba(242, 243, 245, 1);
        width: 90%;
        margin-left: 16px;
        margin-top: 7px;
        margin-bottom: 1px;
      }

      .procedure {
        // border: solid 1px red;
        height: 20px;
        margin-top: 5px;
        margin-left: 6px;
        font-size: 12px;
        margin-bottom: 10px;

        .van-tag1 {
          // width: 30px;
          height: 19px;
          padding: 4px 8px 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: solid 1px rgba(243, 243, 243, 1);
        }

        .van-tag2 {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 19px;
          padding: 4px 8px 4px 8px;
          border: solid 1px rgba(25, 137, 250, 1)
        }
      }
    }
  }

  .userInfo {
    width: 356px;
    margin-left: 8.5px;
    // margin-top: 100px;
    // position: absolute;
    padding-top: 95px;
    // margin-right: 0px;
    // border: solid 1px red;
  }

  .checkbox {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    border: solid 1px rgba(226, 226, 226, 1);
    margin-left: 8px;
    // border: solid 1px red;
  }

  .total {
    position: absolute;
    // margin-top: 5px;
    margin-left: 38px;

    // border: solid 1px red;
    .number {
      color: rgba(128, 128, 128, 1);
      font-size: 12px;
    }
  }

  .userOptions {
    // border: solid 1px red;
    display: flex;
    // margin-left: 143px;
    // margin-top: 6px;
    font-size: 12px;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    margin-right: 2px;

    button {
      background-color: white;
      border-radius: 2em;
      width: 65px;
      height: 32px;
      color: rgb(102, 102, 102);
      margin-right: 6px;
      font-size: 12px;
      // border: solid 1px rgb(221, 221, 221) 0px 0px 0px 1px;
      border: solid 1px rgb(221, 221, 221);
    }

    .button2 {
      background-color: #1890ff;
      color: white;
      border: solid 1px #1890ff;
      // border: solid 1px red;
    }

    .button3 {
      color: rgba(24, 144, 255, 1);
      // rgba(24, 144, 255, 1);
      // font-size: 12px;
      border: solid 1px rgba(24, 144, 255, 1);
      // border: solid 1px red;
      width: 80px;
    }
  }

  .bottom {
    position: fixed;
    width: 100%;
    // border: solid 1px rgb(239, 242, 245);
    // border: solid 1px red;
    // margin-top: 180%;
    bottom: 0;
    display: flex;
    align-items: center;
    // justify-content: center;
    z-index: 50;
    background-color: white;
    height: 50px;

    .approve {
      height: 46px;

      // display:flex;
      // justify-content: center;
      // align-items: center;
      // border: solid 1px red;
      // border: solid 1px red;
      // height: 33%;
      .van-cell {
        height: 46px;
        border-bottom: solid 1px rgba(245, 245, 245, 1);
        text-align: center;
        padding-left: 0px;
      }
    }

    .approve1 {
      height: 46px;

      // display:flex;
      // justify-content: center;
      // align-items: center;
      // border: solid 1px red;
      // border: solid 1px red;
      // height: 24%;
      .van-cell {
        height: 46px;
        border-bottom: solid 1px rgba(245, 245, 245, 1);
        text-align: center;
        padding-left: 0px;
      }
    }

  }
}
</style>