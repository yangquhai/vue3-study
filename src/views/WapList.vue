<!-- 协同列表首页,入口文件 -->
<template>
  <div class="page-content">
    <!-- <div class="mask" style="z-index:-1;background-color:rgb(239, 242, 245);"></div> -->
    <van-overlay z-index='100' :show="flag" @click="close" />
    <div style=" position: fixed;z-index:999;width:100%;">
      <searchTab @search="search" :placeholder="placeholder"></searchTab>
      <div class="dropdown">
        <div v-for="(item, index) in tabList" :key="index" class="dropdownList" @click="dropdown(item)"
          :style="{ 'color': (item != chooseIndex ? 'rgba(50, 50, 51, 1)' : '#1890ff') }">
          <div>{{ item }}</div>
          <img src="https://api.iconify.design/ic:baseline-arrow-drop-down.svg?color=%23888888" alt="" style=""
            v-if="index != chooseIndex">
          <img src="https://api.iconify.design/ic:baseline-arrow-drop-up.svg?color=%231989fa" alt="" style=""
            v-if="index == chooseIndex">
        </div>
      </div>
    </div>
    <transition>
      <div v-if="monthFlag" class="month">
        <div class="sort" v-for="(item, index) in monthList" :key="index" @click="chooseMonth(index, item)"
          :style="{ 'color': (item != chooseMonthIndex ? 'rgba(50, 50, 51, 1)' : '#1890ff') }">
          <div class="sortItem">
            <div>{{ item }}</div>
            <!-- <img src="../assets/选中.svg" alt="" v-if="index == chooseMonthIndex"> -->
            <van-icon name="success" v-if="item == chooseMonthIndex" />
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
          <van-button round size="small" type="primary" @click="close">确认</van-button>
        </div>
      </div>
    </transition>
    <transition>
      <div v-if="sortFlag" class="month">
        <div class="sort" v-for="(item, index) in sortList" :key="index" @click="choosesort(index, item)"
          :style="{ 'color': (item.text != chooseDateIndex ? 'rgba(50, 50, 51, 1)' : 'rgba(25, 137, 250, 1)') }">
          <div class="sortItem">
            <div>{{ item.text }}</div>
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
              @click="chooseProcedureTags(index, item)">
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
          <van-divider v-if="usertTagList.length"></van-divider>
          <superFilter :tabListData="tabListData" ref="filter" @sift="sift"></superFilter>
        </div>
        <div class="userOptions2">
          <!-- <van-button class="button" round type="success" size="small">重置</van-button>
          <van-button class="button1" round type="success" size="small" @click="keep">保存</van-button>
          <van-button class="button3" round type="success" size="small" @click="sift">筛选</van-button> -->
          <van-button class="button" type="primary" size="small" @click="reset">重置</van-button>
          <van-button type="primary" class="button1" size="small" @click="keep">保存</van-button>
          <van-button class="button3" type="primary" size="small" @click="sift">筛选</van-button>
        </div>
      </div>
    </transition>
    <div class="bottom">
      <div class="checkbox" :style="{ 'border': checkAllFlag ? 'solid 1px #ffffff' : 'solid 1px rgba(226, 226, 226, 1)' }"
        @click.stop="checkedAll">
        <van-icon v-show="checkAllFlag" name="success" />
      </div>
      <div class="total">
        <div class="number">
          共{{ count }}条,已选{{ chooseList.length }}条
        </div>
        <div class="number">{{ totalMoneyTitle }}共 <span v-if="!chooseList.length">{{ totalMoney }}</span> <span v-else>{{
          chooseTotalMoney }}</span> </div>
      </div>
      <div class="userOptions">
        <button class="button1" @click="del">删除</button>
        <button class="button3" @click="edit">批量操作</button>
        <button class="button2" @click="goAddData" v-if="tabListData.newUrl">新增</button>
      </div>
      <van-action-sheet v-model:show="editFlag" :actions="actions" @select="onSelect" cancel-text="取消" />
      <van-action-sheet v-model:show="orderFlag" :actions="actions2" @select="onSelect" cancel-text="取消" />
    </div>
    <skeleton v-if="isLoading"></skeleton>
    <userInfo class="userInfo" ref="info" @checked="checked" @transferOrder="transferOrder" :isLoad="isLoading" v-else
      @loadMore="loadMore(0)" :userInfoDataList="userInfoDataList"></userInfo>
  </div>
</template>

<script setup>
import request from '_api'
import { ref, computed } from 'vue'
const tabList = ref(['当月', '排序', '筛选'])
const sortList = ref([])
const isLoading = ref(true)
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
const actions = ref([{ name: '批量审批' }, { name: '批量回退' }])
const orderFlag = ref(false)
const actions2 = ref([{ name: '转收款' }, { name: '转订单' }, { name: '转出库' }])
// 月份限制
const minDate = ref(new Date(2020, 0, 1))
const maxDate = ref(new Date(2025, 0, 31))
const baseUrl = ref('http://dx.anywellchat.com:8888/ANYWELL_hylingls/')
// 总金额
const totalMoney = ref('')
const totalMoneyTitle = ref('')
const count = ref('')
// init数据，用于值的初始化，前端重置数据
const toFormData = ref({
  dateType: {
    value: {
      dateFrom: "",
      dateTo: ""
    },
    defaultValue: "",
    fieldname: ""
  },
  search: {
    value_sql: '',
    keyword: ''
  },
  searchCondition: [],
  lcmxmc: [],
  orderType: {
    orderType_sql: "",
    orderType:
    {
      filedname: "",
      order: "",
      text: ""
    }
  },
})

// 用于初始化后端传来的数组 

const initData = (tabListData, toFormData) => {
  toFormData.value.dateType = tabListData.value.dateType
  // 选中的流程值
  // console.log(tabListData.value.lcmxmc)
  for (let i = 0; i < tabListData.value.lcmxmc.length; i++) {
    if (tabListData.value.lcmxmc[i].select)
      toFormData.value.lcmxmc.push({ value: tabListData.value.lcmxmc[i].value, ID: tabListData.value.lcmxmc[i].ID })
  }
  // 高级筛选五种自定义选择
  for (let i = 0; i < tabListData.value.searchCondition.length; i++) {
    // console.log(tabListData.value.searchCondition[i])
    // 为日期的时候values是对象,否则为数组
    if (tabListData.value.searchCondition[i].type == 'text' || tabListData.value.searchCondition[i].type == 'select')
      toFormData.value.searchCondition.push({
        type: tabListData.value.searchCondition[i].type,
        fieldname: tabListData.value.searchCondition[i].fieldname,
        fieldtype: tabListData.value.searchCondition[i].fieldtype,
        lb: tabListData.value.searchCondition[i].lb,
        text: tabListData.value.searchCondition[i].text,
        defaultValue: tabListData.value.searchCondition[i].defaultValue,
        condition: {id:'',luoji:''}
      })
      if (tabListData.value.searchCondition[i].type == 'muliselect')
      toFormData.value.searchCondition.push({
        type: tabListData.value.searchCondition[i].type,
        fieldname: tabListData.value.searchCondition[i].fieldname,
        fieldtype: tabListData.value.searchCondition[i].fieldtype,
        lb: tabListData.value.searchCondition[i].lb,
        text: tabListData.value.searchCondition[i].text,
        values: [],
      })
      if (tabListData.value.searchCondition[i].type == 'datetime')
      toFormData.value.searchCondition.push({
        type: tabListData.value.searchCondition[i].type,
        fieldname: tabListData.value.searchCondition[i].fieldname,
        fieldtype: tabListData.value.searchCondition[i].fieldtype,
        lb: tabListData.value.searchCondition[i].lb,
        text: tabListData.value.searchCondition[i].text,
        values: {}
      })
    // 将值为muliselect入参
    if (tabListData.value.searchCondition[i].type == 'muliselect') {
      for (let j = 0; j < tabListData.value.searchCondition[i].values.length; j++) {
        if (tabListData.value.searchCondition[i].values[j].select) {
          toFormData.value.searchCondition[i].values.push({ item: tabListData.value.searchCondition[i].values[j].item })
        }
      }
    }
    // 将值为dateTime入参
    if (tabListData.value.searchCondition[i].type == 'datetime') {
      // console.log(tabListData.value.searchCondition[i])
      for (let j = 0; j < tabListData.value.searchCondition[i].values.length; j++) {
        if (tabListData.value.searchCondition[i].values[j].value == '自定义') {
          // console.log(tabListData.value.searchCondition[i].values[j].dateFrom)
          toFormData.value.searchCondition[i].values.dateFrom = tabListData.value.searchCondition[i].values[j].dateFrom
          toFormData.value.searchCondition[i].values.dateTo = tabListData.value.searchCondition[i].values[j].dateTo
        }
        else {
          // console.log(tabListData.value.searchCondition[i].values[j].select)
          if (tabListData.value.searchCondition[i].values[j].select)
            toFormData.value.searchCondition[i].values.value = tabListData.value.searchCondition[i].values[j].value
        }
      }
      // console.log(toFormData.value.searchCondition[i],tabListData.value.searchCondition[i].values)
    }
    // 将值为text入参
    if (tabListData.value.searchCondition[i].type == 'text') {
      for (let j = 0; j < tabListData.value.searchCondition[i].condition.length; j++) {
        // console.log(toFormData.value.searchCondition[i].condition.id)
        if (tabListData.value.searchCondition[i].condition[j].select) {
          toFormData.value.searchCondition[i].condition.id = tabListData.value.searchCondition[i].condition[j].id
          toFormData.value.searchCondition[i].condition.luoji = tabListData.value.searchCondition[i].condition[j].luoji
        }
      }
    }
    // console.log(toFormData.value.searchCondition[i].condition)
  }
  // 排序数据的初始化
  toFormData.value.orderType.orderType_sql = tabListData.value.orderType.orderType_sql
  // 搜索数据的初始化
  toFormData.value.search.value_sql = tabListData.value.search.value_sql
  toFormData.value.search.keyword = tabListData.value.search.keyword
  // console.log(toFormData.value, tabListData.value)
}

// 获取页面数据,第一次进入页面时TisFirst为1，否则都为0
const getData = async (TisFirst) => {
  let formData = new FormData()
  formData.append('Tformnamecn', '1665')
  formData.append('Turl', 'YXKHGZB.ASPX')
  formData.append('Ttablename', 'YXKHGZB')
  formData.append('Tsystem_lcmc', '意向客户跟踪表')
  formData.append('TisFirst', TisFirst)
  formData.append('pageIndex', 1)
  formData.append('pagesize', 10)
  // if (filter)
  //   formData.append('filter', filter)
  try {
    const res = await request.getUserInfo(formData)
    isLoading.value = false
    tabListData.value = res.colums
    userInfoDataList.value = res.data
    // console.log(userInfoDataList.value)
    // 当月份的值为空时,删除月份排序
    if (tabListData.value.dateType.fieldname) {
      chooseMonthIndex.value = tabListData.value.dateType.defaultValue
      tabList.value[0] = tabListData.value.dateType.defaultValue
    }
    else
      tabList.value = tabList.value.filter(item => item !== "当月")
    // 排序数组。当数组长度为空时，不显示排序字段
    if (tabListData.value.orderType.orderType.length)
      sortList.value = tabListData.value.orderType.orderType
    else
      tabList.value = tabList.value.filter(item => item !== "排序")
    // console.log(sortList.value)
    placeholder.value = tabListData.value.search.text
    // JSON.parse(JSON.stringify(b.value))将浅拷贝转换为深拷贝,此时改变procedureList的值不会影响tabListData的值
    procedureList.value = JSON.parse(JSON.stringify(tabListData.value.lcmxmc))
    totalMoney.value = userInfoDataList.value.sum.value
    totalMoneyTitle.value = userInfoDataList.value.sum.text
    count.value = userInfoDataList.value.sum.count
    if (totalMoney.value > 10000)
      totalMoney.value = (totalMoney.value / 10000).toFixed(0).toString() + '万'
    // console.log(userInfoDataList.value.sum[0].value)
    // 初始化数据
    initData(tabListData, toFormData)
    initData(tabListData, initDataTo)
    // console.log(toFormData.value,tabListData.value)
  } catch (err) {
    console.log(err)
  }
}


getData(1)

// 加载更多数据
const conactArray = ref([])
const pageIndex = ref(1)
const loadMore = async (TisFirst) => {
  pageIndex.value++
  // console.log(pageIndex.value)
  let formData = new FormData()
  formData.append('Tformnamecn', '1665')
  formData.append('Turl', 'YXKHGZB.ASPX')
  formData.append('Ttablename', 'YXKHGZB')
  formData.append('Tsystem_lcmc', '意向客户跟踪表')
  formData.append('TisFirst', TisFirst)
  formData.append('pageIndex', pageIndex.value)
  formData.append('pagesize', 10)
  try {
    const res = await request.getUserInfo(formData)
    conactArray.value = res.data.data
    userInfoDataList.value.data = userInfoDataList.value.data.concat(conactArray.value)
    // console.log(conactArray.value,userInfoDataList.value.data)
  }
  catch (err) {
    console.log(err)
  }
}

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
// 计算日期模块数组,记录初始值，用于重置
const dateList = computed(() => {
  let dateList = []
  let index = -1
  for (let i = 0; i < tabListData.value.searchCondition.length; i++) {
    if (tabListData.value.searchCondition[i].type == 'datetime') {
      index = index + 1
      dateList.push(tabListData.value.searchCondition[i])
      // 判断是否有初始选择框为true的情况
      // console.log(dateList[index].values,index)
      // for (let j = 0; j < dateList[index].values.length; j++) {
      //   if (dateList[index].values[j].select)
      //     // dateLastClick.value[index] = 1
      //     // console.log(111)
      // }
    }
  }
  // JSON.parse(JSON.stringify(tabListData.value.lcmxmc)) 
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

// 用于判断sortList中是否存在item索引
const sortIncludes = computed(() => {
  let sortIncludes = []
  for (let i = 0; i < sortList.value.length; i++) {
    sortIncludes.push(sortList.value[i].text)
  }
  return sortIncludes
})

// 点击出现下拉框
const dropdown = (item) => {
  stop()
  // console.log(item,index,firstIndex.value)
  // console.log(this.chooseIndex,index)
  chooseIndex.value = item
  // console.log(this.firstIndex,index)
  // 判断是否第一次打开
  if (firstIndex.value != item) {
    // console.log(sortIncludes.value)
    if (monthList.value.includes(item)) {
      monthFlag.value = true
      sortFlag.value = false
      selectFlag.value = false
      flag.value = true
    }
    if (item == '排序' || sortIncludes.value.includes(item)) {
      monthFlag.value = false
      sortFlag.value = true
      selectFlag.value = false
      flag.value = true
    }
    if (item == '筛选') {
      monthFlag.value = false
      sortFlag.value = false
      selectFlag.value = true
      flag.value = true
    }
    // console.log(monthFlag,sortFlag)
  }
  // 再次点击
  else {
    console.log(chooseIndex.value, item)
    if (chooseIndex.value == item) {
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
      if (flag.value == false && monthList.value.includes(item)) {
        // console.log(index,this.flag)
        monthFlag.value = true
        flag.value = true
        return
      }
      if (flag.value == false && (item == '排序' || sortIncludes.value.includes(item))) {
        sortFlag.value = true
        flag.value = true
        return
      }
      if (flag.value == false && item == '筛选') {
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
  firstIndex.value = item
}

// 选择月份
const chooseMonth = (index, value) => {
  // console.log(chooseIndex.value)
  // console.log(index, initDataTo.value.dateType.defaultValue)
  initDataTo.value.dateType.defaultValue = value
  // this.chooseIndex为0选择第一个
  chooseMonthIndex.value = value
  console.log(initDataTo.value)
  if (monthList.value.includes(chooseIndex.value)) {
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
  initDataTo.value.dateType.value.dateFrom = date1.value
  console.log(date1.value)
}
const onConfirm2 = (date) => {
  value2.value = false;
  date2.value = getSimpleDate(date);
  initDataTo.value.dateType.value.dateTo = date2.value
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
  chooseDateIndex.value = value.text
  // 再次点击相同索引，关闭下拉框
  if (sortIncludes.value.includes(chooseDateIndex.value)) {
    // this.tabList[0] = value
    chooseIndex.value = null
    firstIndex.value = null
    if (tabList.value.length == 3)
      tabList.value[1] = value.text
    else
      tabList.value[0] = value.text
    // this.$set(this.tabList,1,value.text)
    console.log(index)
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
  // console.log(usertTagList.value[index].values[index2].select)
  if (usertTagList.value[index].values[index2].select) {
    // console.log(this.usertTagList[index].values[index2].select)
    usertTagList.value[index].values[index2].select = false
  }
  else {
    usertTagList.value[index].values[index2].select = true
  }
  // console.log(value)
}
// 流程框多选
const chooseProcedureTags = (index, value) => {
  if (procedureList.value[index].select)
    procedureList.value[index].select = false
  else
    procedureList.value[index].select = true
  // console.log(value,initDataTo.value.lcmxmc)
}
// 日期单选
const chooseDataTag = (index, index2, value) => {
  // console.log(index, index2, value,dateList.value[index])
  for (let i = 0; i < dateList.value[index].values.length; i++) {
    dateList.value[index].values[i].select = false
  }
  // console.log(dateLastClick.value[index])
  if (value.value == '自定义') {
    // dateList.value[index].values[dateLastClick.value[index]].select = false
    dateList.value[index].values[index2].select = true
    calendarFlag2.value = true
  }
  // 当点击值为非自定义时
  else {
    // console.log(dateList.value[index].values[index2].select)
    calendarFlag2.value = false
    // 点击到相同的框
    if (dateLastClick.value[index] == index2) {
      dateList.value[index].values[index2].select = false
    }
    else
      dateList.value[index].values[index2].select = true
    // console.log(dateList.value[index].values[index2].select)
  }
  dateLastClick.value[index] = index2
  // console.log(dateLastClick.value[index])
}

const onSelect = () => {
  console.log(333)
}
// 点击搜索数据
const search = (value) => {
  let formData = new FormData()
  // let data = {}
  console.log(value, toFormData.value)
  toFormData.value.searchKeys = value
  formData.append('filter', JSON.stringify(toFormData.value))
  console.log(formData.get('filter'))
  // getData(0,formData.get('filter'))
}
// 计算选中的金额,以及全选与反选
const chooseTotalMoney = ref(0)
const info = ref(null);
const checked = (val) => {
  chooseTotalMoney.value = 0
  // console.log(val)
  // chooseList.value.push(val)
  let chooseTotalMoneyList = []
  chooseList.value = val
  // console.log(chooseList.value)
  for (let i = 0; i < userInfoDataList.value.data.length; i++) {
    // console.log(userInfoDataList.value.data[i].rn)
    for (let j = 0; j < chooseList.value.length; j++) {
      if (chooseList.value[j] == userInfoDataList.value.data[i].rn) {
        // console.log(userInfoDataList.value.data[i][userInfoDataList.value.sum.fieldname])
        chooseTotalMoneyList.push(userInfoDataList.value.data[i][userInfoDataList.value.sum.fieldname])
      }
    }
  }
  for (let i = 0; i < chooseTotalMoneyList.length; i++) {
    chooseTotalMoney.value = chooseTotalMoney.value + chooseTotalMoneyList[i]
  }
  if (chooseTotalMoney.value > 10000)
    chooseTotalMoney.value = (chooseTotalMoney.value / 10000).toFixed(0).toString() + '万'
  // console.log(chooseTotalMoney.value,chooseTotalMoneyList)
}
// 全选与反选
const checkAllFlag = ref(false)
const checkedAll = () => {
  checkAllFlag.value = !checkAllFlag.value
  // 说明数组为空,进行全选操作

  if (checkAllFlag.value) {
    for (let i = 0; i < userInfoDataList.value.data.length; i++) {
      info.value.chooseList.push(userInfoDataList.value.data[i].rn)
    }
    info.value.chooseList = [...new Set(info.value.chooseList)]
    chooseList.value = info.value.chooseList
    checked(chooseList.value)
  }
  else {
    info.value.chooseList.length = 0
  }
  // console.log(chooseList.value,info.value.chooseList)
}


const transferOrder = () => {
  orderFlag.value = true
}
const edit = () => {
  editFlag.value = true
  console.log('edit')
}
// 重置选项为后端开始返回的值,只重置高级筛选内容
const filter = ref(null)
const reset = () => {
  // JSON.parse(JSON.stringify(tabListData.value.lcmxmc))
  // console.log('reset',tabListData.value)
  // 用于value索引,当type="text"时才开始计算数组的第一个值
  let index = -1
  let index2 = -1
  let index3 = -1
  let index4 = -1
  // 流程框初始化
  procedureList.value = JSON.parse(JSON.stringify(tabListData.value.lcmxmc))
  // console.log('reset',tabListData.value)
  // 选择框、文本框、日期框、多选框初始化
  for (let i = 0; i < toFormData.value.searchCondition.length; i++) {
    // console.log(toFormData.value.searchCondition[i])
    if (toFormData.value.searchCondition[i].type == 'text') {
      index++
      // console.log(toFormData.value.searchCondition[i].defaultValue)
      // console.log(filter.value.textList[index].defaultValue)
      filter.value.value1[index] = toFormData.value.searchCondition[i].condition.luoji
      filter.value.textList[index].defaultValue = toFormData.value.searchCondition[i].defaultValue
    }
    if (toFormData.value.searchCondition[i].type == 'select') {
      index2++
      filter.value.value[index] = toFormData.value.searchCondition[i].condition.luoji
      filter.value.selectList[index].defaultValue = toFormData.value.searchCondition[i].defaultValue
    }
    if (toFormData.value.searchCondition[i].type == 'datetime') {
      index3++
      // console.log(toFormData.value.searchCondition[i].values)
      if (!toFormData.value.searchCondition[i].values.value) {
        for (let j = 0; j < dateList.value[index3].values.length; j++) {
          // console.log(dateList.value[index3].values[j].select)
          dateList.value[index3].values[j].select = false
        }
      }
      else {
        for (let j = 0; j < dateList.value[index3].values.length; j++) {
          // console.log(toFormData.value.searchCondition[i].values.value,dateList.value[index3].values[j])
          if (toFormData.value.searchCondition[i].values.value == dateList.value[index3].values[j].value)
            dateList.value[index3].values[j].select = true
        }
      }
    }
    if (toFormData.value.searchCondition[i].type == 'muliselect') {
      index4++
      for(let k=0;k<usertTagList.value[index4].values.length;k++){
        usertTagList.value[index4].values[k].select = false
        // console.log(usertTagList.value[index4].values[k])
        for(let j=0; j<toFormData.value.searchCondition[i].values.length;j++){
         // console.log(toFormData.value.searchCondition[i].values[j])
         if(toFormData.value.searchCondition[i].values[j].item == usertTagList.value[index4].values[k].item)
         // console.log(33123)
         usertTagList.value[index4].values[k].select = true
       }
      }
      // console.log('muliselect',toFormData.value.searchCondition[i],usertTagList.value[index4])
    }
  }
}
// 保存筛选框的值
const saveData = async (Tformat) => {
  let formData = new FormData()
  formData.append('Tformnamecn', '1665')
  formData.append('Turl', 'YXKHGZB.ASPX')
  formData.append('Ttablename', 'YXKHGZB')
  formData.append('Tsystem_lcmc', '意向客户跟踪表')
  formData.append('Tformat', Tformat)
  try {
    const res = await request.saveUserInfo(formData)
    console.log(res)
  }
  catch (err) {
    console.log(err)
  }
}
const initDataTo = ref({
  dateType: {
    value: {
      dateFrom: "",
      dateTo: ""
    },
    defaultValue: "",
    fieldname: ""
  },
  search: {
    value_sql: '',
    keyword: ''
  },
  searchCondition: [],
  lcmxmc: [],
  orderType: {
    orderType_sql: "",
    orderType:
    {
      filedname: "",
      order: "",
      text: ""
    }
  },
})

const keep = () => {
  // console.log(initDataTo.value.searchCondition,dateList.value)
  initDataTo.value.lcmxmc.length = 0
  initDataTo.value.searchCondition.length = 0
  // console.log(initDataTo.value.searchCondition)
  // 流程多选的保存
  for (let i = 0; i < procedureList.value.length; i++) {
    if (procedureList.value[i].select) {
      initDataTo.value.lcmxmc.push({ value: procedureList.value[i].value, ID: procedureList.value[i].ID })
    }
  }
  // console.log(initDataTo.value.searchCondition,dateList.value)
  // 日期类型的保存
  for (let i = 0; i < dateList.value.length; i++) {
    // console.log(dateList.value[i].values)
    initDataTo.value.searchCondition.push({
      type: dateList.value[i].type,
      fieldname: dateList.value[i].fieldname,
      fieldtype: dateList.value[i].fieldtype,
      lb: dateList.value[i].lb,
      text: dateList.value[i].text,
      values: { value: '', dateFrom: '', dateTo: '' }
    })
    for (let j = 0; j < dateList.value[i].values.length; j++) {
      if (dateList.value[i].values[j].select) {
        // console.log(dateList.value[i].values[j])
        initDataTo.value.searchCondition[i].values.value = dateList.value[i].values[j].value
        initDataTo.value.searchCondition[i].values.dateFrom = dateList.value[i].values[j].dateFrom
        initDataTo.value.searchCondition[i].values.dateTo = dateList.value[i].values[j].dateTo
      }
    }
    // console.log(initDataTo.value.searchCondition)
  }
  // 值为多选框的保存
  for(let i=0;i<usertTagList.value.length;i++){
    // console.log(usertTagList.value[i])
    initDataTo.value.searchCondition.push({
      type: usertTagList.value[i].type,
      fieldname: usertTagList.value[i].fieldname,
      fieldtype: usertTagList.value[i].fieldtype,
      lb: usertTagList.value[i].lb,
      text: usertTagList.value[i].text,
      values:[],
    })
    for(let j = 0; j<usertTagList.value[i].values.length;j++){
      if(usertTagList.value[i].values[j].select)
      // console.log(usertTagList.value[i].values[j].item)
      initDataTo.value.searchCondition[i+dateList.value.length].values.push({item:usertTagList.value[i].values[j].item})
    }
  }
  // 值为select的保存
  for (let i = 0; i < filter.value.selectList.length; i++) {
    // console.log(filter.value.textList[i].defaultValue)
    initDataTo.value.searchCondition.push({
      type: filter.value.selectList[i].type,
      fieldname: filter.value.selectList[i].fieldname,
      fieldtype: filter.value.selectList[i].fieldtype,
      lb: filter.value.selectList[i].lb,
      text: filter.value.selectList[i].text,
      defaultValue: filter.value.selectList[i].defaultValue,
      condition: { id: '', luoji: '' }
    })
    for (let j = 0; j < filter.value.selectList[i].condition.length; j++) {
      // console.log(filter.value.textList[i].condition[j])
      if (filter.value.selectList[i].condition[j].select) {
        // console.log(filter.value.textList[i].condition[j])
        initDataTo.value.searchCondition[i + dateList.value.length +usertTagList.value.length].condition.id = filter.value.selectList[i].condition[j].id
        initDataTo.value.searchCondition[i + dateList.value.length +usertTagList.value.length].condition.luoji = filter.value.selectList[i].condition[j].luoji
      }
    }
  }


  // 值为text的保存
  for (let i = 0; i < filter.value.textList.length; i++) {
    // console.log(filter.value.textList[i].defaultValue)
    initDataTo.value.searchCondition.push({
      type: filter.value.textList[i].type,
      fieldname: filter.value.textList[i].fieldname,
      fieldtype: filter.value.textList[i].fieldtype,
      lb: filter.value.textList[i].lb,
      text: filter.value.textList[i].text,
      defaultValue: filter.value.textList[i].defaultValue,
      condition: { id: '', luoji: '' }
    })
    for (let j = 0; j < filter.value.textList[i].condition.length; j++) {
      // console.log(filter.value.textList[i].condition[j])
      if (filter.value.textList[i].condition[j].select) {
        // console.log(filter.value.textList[i].condition[j])
        initDataTo.value.searchCondition[i + dateList.value.length + filter.value.selectList.length +usertTagList.value.length].condition.id = filter.value.textList[i].condition[j].id
        initDataTo.value.searchCondition[i + dateList.value.length + filter.value.selectList.length +usertTagList.value.length].condition.luoji = filter.value.textList[i].condition[j].luoji
      }
    }
  }
  console.log(initDataTo.value)
  // JSON.stringify(initDataTo.value)
  // console.log('keep',  JSON.stringify(initDataTo.value))
  saveData(JSON.stringify(initDataTo.value))
}

// 筛选模块弹窗关闭
const sift = () => {
  chooseIndex.value = null
  firstIndex.value = null
  flag.value = false
  selectFlag.value = false
  move()
  console.log('keep', initDataTo.value)
}
</script>

<style lang="less" scoped>
.page-content {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100vh;

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

  .dropdown {
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -1px;
    background-color: rgba(255, 255, 255, 1);

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
      // top: 114px;
      background-color: rgba(255, 255, 255, 1);
      color: rgba(80, 80, 80, 1);
      font-size: 12px;
      position: relative;
    }
  }

  .month {
    position: fixed;
    z-index: 888;
    width: 100%;
    top: 80px;
    padding-top: 4px;
    background-color: rgba(255, 255, 255, 1);
    max-height: 70%;

    // border: solid 1px red;
    // border: none;
    // margin-top: -1px;
    .sort {
      height: 34px;
      display: flex;
      align-items: center;

      // justify-content: center;
      .imgList {
        // margin-left: 316px;
        display: flex;
        margin-left: auto;

        img {
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
        // border: solid 1px red;
        display: flex;
        justify-content: space-between;
      }
    }

    .calendar {
      margin-left: 15px;
      // margin-top: 4px;

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
        font-size: 13px;
        background-color: rgba(24, 144, 255, 1);
        border: none;
      }
    }

    .sort:nth-last-child(1) {
      .sortItem {
        border: none;
      }

    }

    .userOptions2 {
      // width: 100%;
      padding-top: 12px;
      margin-left: 12px;
      margin-right: 12px;
      display: flex;
      z-index: 2;
      justify-content: flex-end;
      padding-bottom: 12px;

      .van-button {
        width: 66px;
        margin-left: 10px;
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
        background-color: rgba(24, 144, 255, 1);
        border: none;
      }
    }

    .superSelect {
      // border: solid 1px red;
      overflow: scroll;
      // height: 497px;
      max-height: 60vh;
      background-color: rgba(255, 255, 255, 1);

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
        margin-left: 15px;
        flex-wrap: wrap
      }

      .van-divider {
        // margin: 0px;
        // border: solid 0.5px rgba(242, 243, 245, 1);
        // background-color: rgba(242, 243, 245, 1);
        width: 90%;
        margin-left: 15px;
        margin-top: 7px;
        margin-bottom: 1px;
      }

      .procedure {
        // border: solid 1px red;
        height: 20px;
        margin-top: 5px;
        margin-right: 6px;
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
    padding-top: 80px;
  }

  .checkbox {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    border: solid 1px rgba(226, 226, 226, 1);
    margin-left: 8px;

    // border: solid 1px red;
    .van-icon {
      color: #fff;
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
  }
}
</style>