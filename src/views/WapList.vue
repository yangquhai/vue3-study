<!-- 协同列表首页,入口文件 -->
<template>
  <div class="page-content">
    <!-- <div class="mask" style="z-index:-1;background-color:rgb(239, 242, 245);"></div> -->
    <van-overlay z-index='100' :show="flag" @click="close" />
    <div style=" position: fixed;z-index:999;width:100%;">
      <searchTab @search="search" :keyword="keyword" :placeholder="placeholder"></searchTab>
      <div class="dropdown">
        <div v-for="(item, index) in tabList" :key="index" class="dropdownList" @click="dropdown(item)"
          :style="{ 'color': (item != chooseIndex ? 'rgba(50, 50, 51, 1)' : '#1890ff') }" v-if="!isLoading">
          <div>{{ item }}</div>
          <span v-if="index != 1">
            <span class="iconfont icon-sort-down" v-if="item != chooseIndex" style="color: #dcdee0;"></span>
            <span class="iconfont icon-sort-up" v-if="item == chooseIndex"></span>
          </span>
          <div v-if="index == 1" class="sorticon">
            <span class="iconfont icon-sort-up icon-sort1"
              :style="{ 'color': sortDescFlag ? '#dcdee0' : '#1890ff' }"></span>
            <span class="iconfont icon-sort-down icon-sort2" :style="{ 'color': !sortDescFlag ? '#dcdee0' : '#1890ff' }"
              style="display: block;"></span>
          </div>
        </div>
        <div v-else class="skeleton">
          <van-skeleton-paragraph class="paragraphTitle" row-width="30%" style="background-color: #f2f3f5" />
          <van-skeleton-paragraph class="paragraphTitle" row-width="30%"
            style="background-color: #f2f3f5;margin-top: 0px;" />
          <van-skeleton-paragraph class="paragraphTitle" row-width="30%"
            style="margin-top: 0px; background-color: #f2f3f5" />
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
          <van-button round size="small" type="primary" @click="confirmDate">确 认</van-button>
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
              <!-- 被选中 -->
              <div v-if="item.select">
                <span class="iconfont icon-paixu-jiangxu" style="color:black" v-if="item.order != 'DESC'"></span>
                <span class="iconfont icon-paixu-shengxu" v-if="item.order == ''"></span>
                <span class="iconfont icon-paixu-jiangxu" v-if="item.order == 'DESC'"></span>
                <span class="iconfont icon-paixu-shengxu" style="color:black" v-if="item.order != ''"></span>
              </div>
              <div v-else>
                <span class="iconfont icon-paixu-jiangxu" style="color:black"></span>
                <span class="iconfont icon-paixu-shengxu" style="color:black"></span>
              </div>
              <!-- 未被选中 -->

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
            <calendar v-if="calendarFlag2" :calendarDate1List="calendarDate1List" @onConfirmDate="onConfirmDate"
              @onConfirmDate2="onConfirmDate2"></calendar>
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
          <superFilter :tabListData="tabListData" ref="filter"></superFilter>
        </div>
        <div class="userOptions2">
          <!-- <van-button class="button" round type="success" size="small">重置</van-button>
          <van-button class="button1" round type="success" size="small" @click="keep">保存</van-button>
          <van-button class="button3" round type="success" size="small" @click="sift">筛选</van-button> -->
          <van-button class="button" type="primary" size="small" @click="reset">重 置</van-button>
          <van-button type="primary" class="button1" size="small" @click="keep">保 存</van-button>
          <van-button class="button3" type="primary" size="small" @click="sift">筛 选</van-button>
        </div>
      </div>
    </transition>
    <div class="bottom" :style="{ 'border-bottom': isIos ? '0.3rem solid white' : '' }">
      <div v-if="!isLoading" style="position: relative;width: 100%; display: flex;align-items: center;">
        <div class="checkbox"
          :style="{ 'border': checkAllFlag ? 'solid 1px #ffffff' : 'solid 1px rgba(226, 226, 226, 1)' }"
          @click.stop="checkedAll">
          <van-icon v-show="checkAllFlag" name="success" />
        </div>
        <div class="total" @click.stop="checkedAll">
          <div class="number">
            共{{ count }}条,已选{{ chooseList.length }}条
          </div>
          <div class="number">{{ totalMoneyTitle }}共<span v-if="!chooseList.length">{{ totalMoney }}</span> <span
              v-else>{{
                chooseTotalMoney }}</span> </div>
        </div>
        <div class="userOptions">
          <button class="button1" @click="del">删 除</button>
          <button class="button3" @click="edit">批量操作</button>
          <button class="button2" @click="goAddData" v-if="tabListData.newUrl">新 增</button>
        </div>
      </div>
      <div v-else class="skeleton">
        <van-skeleton-paragraph class="paragraphTitle" row-width="30%" style="background-color: #f2f3f5" />
        <van-skeleton-paragraph class="paragraphTitle2 paragraphTitle" row-width="20%"
          style="background-color: #f2f3f5;margin-top: 0px;" />
        <van-skeleton-paragraph class="paragraphTitle2 paragraphTitle" row-width="20%"
          style="background-color: #f2f3f5;margin-top: 0px;" />
        <van-skeleton-paragraph class="paragraphTitle2 paragraphTitle" row-width="20%"
          style="background-color: #f2f3f5;margin-top: 0px;" />
      </div>
      <van-action-sheet v-model:show="editFlag" :actions="actions" @select="onSelect" cancel-text="取消" />
    </div>
    <skeleton v-if="isLoading"></skeleton>
    <userInfo class="userInfo" ref="info" @checked="checked" :isLoad="isLoading" v-else @loadMore="loadMore"
      :userInfoDataList="userInfoDataList"></userInfo>
  </div>
</template>

<script setup>
import request from '_api'
import { ref, computed } from 'vue'
import { showToast, showDialog } from 'vant';
const tabList = ref(['', '排序', '筛选'])
const sortList = ref([])
const isLoading = ref(true)
// 用户选中的数组
const chooseList = ref([])
// 用户选择框
const placeholder = ref('')
const keyword = ref('')
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
// 月份限制
const minDate = ref(new Date(2020, 0, 1))
const maxDate = ref(new Date(2025, 0, 31))
const baseUrl = ref('http://dx.anywellchat.com:8888/ANYWELL_hylingls/')
// 总金额
const totalMoney = ref(0)
const totalMoneyTitle = ref('')
const count = ref('')
const isIos = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
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
      fieldname: "",
      order: "",
      text: ""
    }
  },
})

// 用于初始化后端传来的数组 
// 传入到高级筛选模块的日期框
const calendarDate1List = ref({ dateFrom: '请选择日期', dateTo: '请选择日期' })
const sortDescFlag = ref(false)
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
        condition: { id: '', luoji: '' }
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
          // calendarDate2.value = tabListData.value.searchCondition[i].values[j]
          // toFormData.value.searchCondition[i].values.value = ''
          if (tabListData.value.searchCondition[i].values[j].select) {
            calendarDate1List.value = tabListData.value.searchCondition[i].values[j]
            calendarFlag2.value = true
          }
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
  // 排序数据的初始化
  tabListData.value.orderType.orderType.forEach(function (value) {
    if (value.select) {
      // console.log(sortDescFlag.value,value.order)
      if (!value.order) {
        sortDescFlag.value = false
      }
      else {
        sortDescFlag.value = true
      }
      toFormData.value.orderType.orderType.fieldname = value.fieldname
      toFormData.value.orderType.orderType.order = value.order
      toFormData.value.orderType.orderType.text = value.text
    }
  })
  // console.log(toFormData.value, tabListData.value)
}

// 获取页面数据,第一次进入页面

const Tformnamecn = ref('')
const Turl = ref('')
const Ttablename = ref('')
const Tsystem_lcmc = ref('')

const props = defineProps({
  Tformnamecn: {
    type: String,
    required: true
  },
  Turl: {
    type: String,
    required: true
  },
  Ttablename: {
    type: String,
    required: true
  },
  Tsystem_lcmc: {
    type: String,
    required: true
  },
})
// 获取页面路由上面的参数，将参数动态化
const getPageUrl = () => {
  Tformnamecn.value = props.Tformnamecn
  Turl.value = props.Turl
  Ttablename.value = props.Ttablename
  Tsystem_lcmc.value = props.Tsystem_lcmc
}
getPageUrl()

// 第一次请求页面获取参数
const getData = async () => {
  let formData = new FormData()
  formData.append('Tformnamecn', Tformnamecn.value)
  formData.append('Turl', Turl.value)
  formData.append('Ttablename', Ttablename.value)
  formData.append('Tsystem_lcmc', Tsystem_lcmc.value)
  formData.append('pageIndex', 1)
  formData.append('pagesize', 10)
  try {
    const res = await request.getUserInfo(formData)
    isLoading.value = false
    tabListData.value = res.colums
    userInfoDataList.value = res.data
    // console.log(userInfoCard.value)
    // 当月份的值为空时,删除月份排序
    if (tabListData.value.dateType.defaultValue == '自定义') {
      calendarFlag.value = true
      console.log(tabListData.value.dateType.value)
      date1.value = tabListData.value.dateType.value.dateFrom
      date2.value = tabListData.value.dateType.value.dateTo
    }
    if (tabListData.value.dateType.fieldname) {
      chooseMonthIndex.value = tabListData.value.dateType.defaultValue
      tabList.value[0] = tabListData.value.dateType.defaultValue
    }
    else {
      tabList.value = tabList.value.filter(item => item !== "当月")
    }
    // 排序数组。当数组长度为空时，不显示排序字段
    if (tabListData.value.orderType.orderType.length) {
      sortList.value = tabListData.value.orderType.orderType
      if (tabList.value.length == 3) {
        sortList.value.forEach(function (value) {
          if (value.select) {
            tabList.value[1] = value.text
            chooseDateIndex.value = value.text
          }
        })
      }
      else {
        sortList.value.forEach(function (value) {
          if (value.select) {
            tabList.value[0] = value.text
            chooseDateIndex.value = value.text
          }
        })
      }
    }
    else {
      tabList.value = tabList.value.filter(item => item !== "排序")
    }
    // console.log(sortList.value)
    placeholder.value = tabListData.value.search.text
    keyword.value = tabListData.value.search.keyword
    // JSON.parse(JSON.stringify(b.value))将浅拷贝转换为深拷贝,此时改变procedureList的值不会影响tabListData的值
    procedureList.value = JSON.parse(JSON.stringify(tabListData.value.lcmxmc))
    if (userInfoDataList.value.sum.value==null)
      totalMoney.value = 0
    else
      totalMoney.value = userInfoDataList.value.sum.value
    totalMoneyTitle.value = userInfoDataList.value.sum.text
    sumFieldName.value = userInfoDataList.value.sum.fieldname
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

getData()

// 点击获取转单操作
const tsystem_idlist = ref('')
// 批量操作数据
const onSelect = async (item) => {
  let Tsystem_ids = "";
  for (let i = 0; i < chooseSYSTEM_ID.value.length; i++) {
    Tsystem_ids += chooseSYSTEM_ID.value[i].SYSTEM_ID + ",";
  }
  Tsystem_ids = Tsystem_ids.substring(0, Tsystem_ids.length - 1);
  let formData = new FormData()
  formData.append('Tformnamecn', Tformnamecn.value)
  formData.append('Turl', Turl.value)
  formData.append('Ttablename', Ttablename.value)
  formData.append('Tsystem_lcmc', Tsystem_lcmc.value)
  formData.append('Tsystem_ids', Tsystem_ids)
  try {
    const res = await request.batchOperation(formData)
    tsystem_idlist.value = res.data.data
  }
  catch (err) {
    console.log(err)
  }
  // console.log(item)
  // console.log(chooseSYSTEM_ID.value)
  // let Turl = 'YXKHGZB.ASPX'
  if (item.name == '批量审批') {
    // console.log(baseUrl.value + `${Turl}?Tflag=9&TAUTOCLOSE=2&tsystem_idlist=${tsystem_idlist.value}`)
    window.location.href = (baseUrl.value + `${Turl.value}?Tflag=9&TAUTOCLOSE=2&tsystem_idlist=${tsystem_idlist.value}`)
  }
  else {
    // console.log(baseUrl.value + `${Turl.value}?Tflag=9&TAUTOCLOSE=2&tsystem_idlist=${tsystem_idlist.value}`)
    window.location.href = (baseUrl.value + `${Turl.value}?Tflag=8&TAUTOCLOSE=2&tsystem_idlist=${tsystem_idlist.value}`)
  }
}
const edit = () => {
  if (chooseList.value.length) {
    editFlag.value = true
  }
  else
    showDialog({
      message: '请选择数据',
    }).then(() => {
      // on close
    });
}
// 批量删除数据
// 删除词条
const deleteWords = (wordIds) => {
  userInfoDataList.value.data = userInfoDataList.value.data.filter(item => !wordIds.includes(item.SYSTEM_ID))
}
const del = async () => {
  if (chooseList.value.length) {
    console.log('delete')
    let userChoose = []
    let Tsystem_ids = "";
    let PWorkflowString = ""
    let Pwork = ""
    let delTurl = '[' + Turl.value + ']'
    let delSYSTEM_LCMC = []
    let SYSTEM_LCMXMC_ORG = []
    for (let i = 0; i < chooseSYSTEM_ID.value.length; i++) {
      userChoose.push(chooseSYSTEM_ID.value[i].SYSTEM_ID)
      Tsystem_ids += chooseSYSTEM_ID.value[i].SYSTEM_ID + ",";
      delSYSTEM_LCMC.push('[' + chooseSYSTEM_ID.value[i].SYSTEM_LCMC + ']')
      SYSTEM_LCMXMC_ORG.push('[' + chooseSYSTEM_ID.value[i].SYSTEM_LCMXMC_ORG + ']')
      // let delTurl = '[' + Turl.value +']'
      // Pwork = chooseSYSTEM_ID.value[i].SYSTEM_LCMC + chooseSYSTEM_ID.value[i].SYSTEM_LCMXMC_ORG +delTurl
      // PWorkflowString += Pwork + ","
      // console.log(PWorkflowString)
    }
    Tsystem_ids = Tsystem_ids.substring(0, Tsystem_ids.length - 1)
    Pwork = delSYSTEM_LCMC[0] + SYSTEM_LCMXMC_ORG[0] + delTurl
    // PWorkflowString = PWorkflowString.substring(0, PWorkflowString.length - 1)
    // console.log(Tsystem_ids,Pwork)
    // console.log(Tsystem_ids)
    let formData = new FormData()
    formData.append('id', Tsystem_ids)
    formData.append('PWorkflowString', Pwork)
    // console.log(userChoose)
    // console.log(chooseSYSTEM_ID.value, userInfoDataList.value.data)
    try {
      const res = await request.deleteUserInfo(formData)
      deleteWords(userChoose)
      console.log(userChoose.length)
      userInfoDataList.value.sum.count = userInfoDataList.value.sum.count - userChoose.length
      count.value = count.value - userChoose.length
      chooseList.value.length = 0
      Tsystem_ids = ""
      Pwork = ""
      userChoose.length = 0
      showToast(res.msg)
      console.log(res)
    }
    catch (err) {
      chooseList.value.length = 0
      Tsystem_ids = ""
      Pwork = ""
      userChoose.length = 0
      console.log(err)
    }
  }
  else
    showDialog({
      message: '请选择数据',
    }).then(() => {
      // on close
    });
}

// 加载更多数据
const conactArray = ref([])
const pageIndex = ref(1)
const loadMore = async () => {
  pageIndex.value++
  siftDataTo.value = JSON.parse(JSON.stringify(initDataTo.value))
  siftDataTo.value.sum = { fieldname: sumFieldName.value, text: totalMoneyTitle.value }
  // console.log(siftDataTo.value)
  let formData = new FormData()
  formData.append('Tformnamecn', Tformnamecn.value)
  formData.append('Turl', Turl.value)
  formData.append('Ttablename', Ttablename.value)
  formData.append('Tsystem_lcmc', Tsystem_lcmc.value)
  formData.append('Tfilter', JSON.stringify(siftDataTo.value))
  formData.append('pageIndex', pageIndex.value)
  formData.append('pagesize', 10)
  try {
    const res = await request.siftUserInfo(formData)
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
  for (let i = 0; i < tabListData.value.searchCondition.length; i++) {
    if (tabListData.value.searchCondition[i].type == 'datetime') {
      dateList.push(tabListData.value.searchCondition[i])
    }
  }
  // console.log(dateList)
  return dateList
})

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
  // move()
}
// 点击跳转新增页面
const goAddData = () => {
  let url = baseUrl.value + tabListData.value.newUrl
  console.log(url)
  // window.open = (this.baseUrl + this.tabListData.newUrl,"blank")
  // window.location.href = ('http://www.baidu.com')
  window.location.href = (baseUrl.value + tabListData.value.newUrl)

  // window.open("https://www.cnblogs.com/guorongtao/");
  //   dd.openLink({
  //   url: 'http://www.dingtalk.com',
  //   success: () => {},
  //   fail: () => {},
  //   complete: () => {},
  // });
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
  // stop()
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
    // console.log(chooseIndex.value, item)
    if (chooseIndex.value == item) {
      chooseIndex.value = null
      flag.value = false
      monthFlag.value = false
      sortFlag.value = false
      selectFlag.value = false
      firstIndex.value = null
      // move()
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
  if (monthList.value.includes(chooseIndex.value)) {
    if (index != 7) {
      chooseIndex.value = null
      firstIndex.value = null
      tabList.value[0] = value
      flag.value = false
      monthFlag.value = false
      sortFlag.value = false
      // keep()
      copyData(siftDataTo, initDataTo)
      calendarFlag.value = false
      siftUserInfo(JSON.stringify(siftDataTo.value))
      // move()
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
// 选中自定义日期
const confirmDate = () => {
  console.log(initDataTo.value)
  // keep()
  copyData(siftDataTo, initDataTo)
  // console.log(value,siftDataTo.value)
  tabList.value[0] = '自定义'
  siftUserInfo(JSON.stringify(siftDataTo.value))
  calendarFlag.value = false
  close()
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
const orderType = ref(1)
const choosesort = (index, value) => {
  // let initOrderFlag = 0
  // console.log(chooseDateIndex.value, value.text, initDataTo.value.orderType.orderType)
  sortList.value.forEach(function (item) {
    item.select = false
  })
  if (initDataTo.value.orderType.orderType.fieldname)
    orderType.value = 1
  else
    orderType.value = 0
  initDataTo.value.orderType.orderType.fieldname = value.fieldname
  initDataTo.value.orderType.orderType.text = value.text
  // 点击相同索引
  if (chooseDateIndex.value == value.text) {
    console.log(initDataTo.value.orderType.orderType.order)
    if (initDataTo.value.orderType.orderType.order == 'DESC') {
      initDataTo.value.orderType.orderType.order = ''
      sortList.value[index].order = ''
      sortList.value[index].select = true
      sortDescFlag.value = false
      orderType.value = 0
      console.log(sortList.value)
    }
    else {
      initDataTo.value.orderType.orderType.order = 'DESC'
      sortList.value[index].order = 'DESC'
      sortList.value[index].select = true
      sortDescFlag.value = true
      orderType.value = 0
      console.log(222)
    }
  }
  // 点击不同索引
  else {
    console.log(value)
    initDataTo.value.orderType.orderType.order = 'DESC'
    sortList.value[index].order = 'DESC'
    sortList.value[index].select = true
    sortDescFlag.value = true
    orderType.value = 0
    console.log(222)
  }
  chooseDateIndex.value = value.text
  // console.log(initDataTo.value.orderType.orderType, sortList.value)
  // console.log(chooseDateIndex.value)
  // console.log(value.order)
  // 再次点击相同索引，关闭下拉框
  if (sortIncludes.value.includes(chooseDateIndex.value)) {
    chooseIndex.value = null
    firstIndex.value = null
    // 如果没有月份排序，则tabList字段第一个值为排序
    if (tabList.value.length == 3)
      tabList.value[1] = value.text
    else
      tabList.value[0] = value.text
    // console.log(index,value)
    copyData(siftDataTo, initDataTo)
    siftUserInfo(JSON.stringify(siftDataTo.value))
    flag.value = false
    monthFlag.value = false
    sortFlag.value = false
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
// 日期单选,
const lastClick = ref(null)
const chooseDataTag = (index, index2, value) => {
  // console.log(index, index2,dateList.value[index].values)
  for (let i = 0; i < dateList.value[index].values.length; i++) {
    // dateList.value[index].values[i].select = false
    // console.log(dateList.value[index].values[i].select)
    if (dateList.value[index].values[i].select) {
      lastClick.value = i + 1
    }
  }
  if (value.value == '自定义') {
    // 判断之前是否有点击
    if (!lastClick.value) {
      dateList.value[index].values[index2].select = !dateList.value[index].values[index2].select
      calendarFlag2.value = !calendarFlag2.value
      lastClick.value = index2 + 1
    }
    else {
      // lastClick.value = null
      dateList.value[index].values[index2].select = !dateList.value[index].values[index2].select
      calendarFlag2.value = !calendarFlag2.value
      dateList.value[index].values[lastClick.value - 1].select = false
      lastClick.value = null
    }
  }
  else {
    // 第一次点击
    if (!lastClick.value) {
      calendarFlag2.value = false
      dateList.value[index].values[index2].select = !dateList.value[index].values[index2].select
      lastClick.value = index2 + 1
    }
    else {
      // console.log(lastClick.value)
      // lastClick.value = null
      calendarFlag2.value = false
      dateList.value[index].values[index2].select = !dateList.value[index].values[index2].select
      dateList.value[index].values[lastClick.value - 1].select = false
      lastClick.value = null
    }
  }
  // console.log(lastClick.value)
}

// 计算选中的金额,以及全选与反选
const chooseTotalMoney = ref(0)
const chooseSYSTEM_ID = ref([])
// 获取userinfo属性
const info = ref(null);
const checked = (val, SYSTEM_ID) => {
  chooseTotalMoney.value = 0
  // console.log(val,SYSTEM_ID)
  // chooseList.value.push(val)
  let chooseTotalMoneyList = []
  chooseList.value = val
  chooseSYSTEM_ID.value = SYSTEM_ID
  // console.log(chooseList.value,chooseSYSTEM_ID.value)
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
      for (let k = 0; k < usertTagList.value[index4].values.length; k++) {
        usertTagList.value[index4].values[k].select = false
        // console.log(usertTagList.value[index4].values[k])
        for (let j = 0; j < toFormData.value.searchCondition[i].values.length; j++) {
          // console.log(toFormData.value.searchCondition[i].values[j])
          if (toFormData.value.searchCondition[i].values[j].item == usertTagList.value[index4].values[k].item)
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
  formData.append('Tformnamecn', Tformnamecn.value)
  formData.append('Turl', Turl.value)
  formData.append('Ttablename', Ttablename.value)
  formData.append('Tsystem_lcmc', Tsystem_lcmc.value)
  formData.append('Tformat', Tformat)
  try {
    const res = await request.saveUserInfo(formData)
    console.log(res)
    showToast(res.msg);
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
      fieldname: "",
      order: "",
      text: ""
    }
  },
})
// 日期框选择的日期
const onConfirmDate = (val) => {
  console.log(val)
  calendarDate1List.value.dateFrom = val
}
const onConfirmDate2 = (val) => {
  console.log(val)
  calendarDate1List.value.dateTo = val
}
// 将用户选择的数据收集起来,后续用于保存还是筛选分不同的点击
const keepData = () => {
  // console.log(filter.value)
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
        if (dateList.value[i].values[j].value == '自定义') {
          if (dateList.value[i].values[j].select) {
            // calendarDate1List
            initDataTo.value.searchCondition[i].values.dateFrom = calendarDate1List.value.dateFrom
            initDataTo.value.searchCondition[i].values.dateTo = calendarDate1List.value.dateTo
          }
          else {
            initDataTo.value.searchCondition[i].values.dateFrom = dateList.value[i].values[j].dateFrom.split('T')[0]
            initDataTo.value.searchCondition[i].values.dateTo = dateList.value[i].values[j].dateTo.split('T')[0]
          }
        }
      }
    }
    // console.log(initDataTo.value.searchCondition)
  }
  // 值为多选框的保存
  for (let i = 0; i < usertTagList.value.length; i++) {
    // console.log(usertTagList.value[i])
    initDataTo.value.searchCondition.push({
      type: usertTagList.value[i].type,
      fieldname: usertTagList.value[i].fieldname,
      fieldtype: usertTagList.value[i].fieldtype,
      lb: usertTagList.value[i].lb,
      text: usertTagList.value[i].text,
      values: [],
    })
    for (let j = 0; j < usertTagList.value[i].values.length; j++) {
      if (usertTagList.value[i].values[j].select)
        // console.log(usertTagList.value[i].values[j].item)
        initDataTo.value.searchCondition[i + dateList.value.length].values.push({ item: usertTagList.value[i].values[j].item })
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
        initDataTo.value.searchCondition[i + dateList.value.length + usertTagList.value.length].condition.id = filter.value.selectList[i].condition[j].id
        initDataTo.value.searchCondition[i + dateList.value.length + usertTagList.value.length].condition.luoji = filter.value.selectList[i].condition[j].luoji
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
        initDataTo.value.searchCondition[i + dateList.value.length + filter.value.selectList.length + usertTagList.value.length].condition.id = filter.value.textList[i].condition[j].id
        initDataTo.value.searchCondition[i + dateList.value.length + filter.value.selectList.length + usertTagList.value.length].condition.luoji = filter.value.textList[i].condition[j].luoji
      }
    }
  }
  // console.log(initDataTo.value)
  // JSON.stringify(initDataTo.value)
  // console.log('keep',  JSON.stringify(initDataTo.value))
  // saveData(JSON.stringify(initDataTo.value))
}
const keep = () => {
  keepData()
  saveData(JSON.stringify(initDataTo.value))
}
// 筛选数据接口
const siftUserInfo = async (Tformat) => {
  isLoading.value = true
  pageIndex.value = 1
  let formData = new FormData()
  formData.append('Tformnamecn', Tformnamecn.value)
  formData.append('Turl', Turl.value)
  formData.append('Ttablename', Ttablename.value)
  formData.append('Tsystem_lcmc', Tsystem_lcmc.value)
  formData.append('Tfilter', Tformat)
  formData.append('pageIndex', 1)
  formData.append('pagesize', 10)
  try {
    const res = await request.siftUserInfo(formData)
    isLoading.value = false
    // console.log(res.data.sum)
    userInfoDataList.value.data = res.data.data
    // userInfoCard.value = res.data.data
    totalMoney.value = res.data.sum.value
    totalMoneyTitle.value = res.data.sum.text
    sumFieldName.value = res.data.sum.fieldname
    count.value = res.data.sum.count
    userInfoDataList.value.sum.count = res.data.sum.count
    if (totalMoney.value > 10000)
      totalMoney.value = (totalMoney.value / 10000).toFixed(0).toString() + '万'
    // chooseList.length = 0
    // console.log(userInfoDataList.value.sum)
  }
  catch (err) {
    console.log(err)
  }
}

const siftDataTo = ref('')

// 将initData值赋给siftData
const copyData = (siftDataTo, initDataTo) => {
  // 深拷贝一个数组siftDataTo用于筛选数据
  siftDataTo.value = JSON.parse(JSON.stringify(initDataTo.value))
  siftDataTo.value.sum = { fieldname: sumFieldName.value, text: totalMoneyTitle.value }
  chooseList.value.length = 0
  checkAllFlag.value = false
  console.log('sift', siftDataTo.value)
}
const sumFieldName = ref('')
// 筛选模块弹窗关闭,需要调用keep函数，获取修改后的值
const sift = () => {
  close()
  keepData()
  copyData(siftDataTo, initDataTo)
  siftUserInfo(JSON.stringify(siftDataTo.value))
}
// 点击搜索数据
const search = (value) => {
  // let formData = new FormData()
  // let data = {}
  // console.log(initDataTo.value)
  initDataTo.value.search.keyword = value
  // console.log(filter.value)
  // keep()
  copyData(siftDataTo, initDataTo)
  // console.log(value,siftDataTo.value)
  siftUserInfo(JSON.stringify(siftDataTo.value))
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

    span {
      font-size: 12px;
      margin-left: 3px;
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

      .sorticon {
        position: relative;
        // height: 20px;
        // border: solid 1px red;
      }

      .icon-sort1 {
        // border: solid 1px red;
        position: absolute;
        margin-top: -10px;
      }

      .icon-sort2 {
        // border: solid 1px red;
        margin-top: -2px;
        position: absolute;
      }
    }

    .skeleton {
      display: flex;
      align-items: flex-start;
      position: relative;
      justify-content: space-between;
      width: 100%;
      margin: 0px 12px 0px 12px;

      .paragraphTitle {
        height: 20px;
      }
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

        span {
          font-size: 12px;
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
        display: block;
        margin-bottom: 12px;
        width: 66px;
        font-size: 13px;
        background-color: rgba(24, 144, 255, 1);
        border: none;
        margin-top: 12px;
        margin-left: auto;
        margin-right: 12px;
      }
    }

    .sort:nth-last-child(1) {
      .sortItem {
        border: none;
      }

    }

    .userOptions2 {
      // width: 100%;
      // padding-top: 12px;
      margin-left: 12px;
      margin-right: 2px;
      display: flex;
      z-index: 2;
      justify-content: flex-end;
      padding-bottom: 12px;

      .van-button {
        width: 66px;
        margin-left: 10px;
        border-radius: 16px;
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
        margin-right: 12px;
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

    .skeleton {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      // margin-left: 38px;
      // border: solid 1px red;
      margin-top: 6px;
      margin-left: 12px;

      .paragraphTitle {
        background-color: #f2f3f5;
        height: 35px;
        margin-right: 12px;
      }

      .paragraphTitle2 {
        border-radius: 16px;
        height: 30px;
      }
    }
  }
}</style>