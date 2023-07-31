<!-- 日历插件的制作 -->
<template>
  <div>
    <div class="calendar">
        <div class="calelist" style="display:flex">
            <van-cell title="从" :value="date1" @click="value1 = true" />
            <van-calendar v-model:show="value1" :show-confirm="false" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" />
            <van-cell title="至" class="van-cell2" :value="date2" @click="value2 = true" />
            <van-calendar v-model:show="value2" :show-confirm="false" @confirm="onConfirm2" :min-date="minDate" :max-date="maxDate" />
          </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const date1 = ref('请选择日期')
const date2 = ref('请选择日期')
const value1 = ref(false)
const value2 = ref(false)
const minDate = ref(new Date(2020, 0, 1))
const maxDate = ref(new Date(2025, 0, 31))
const onConfirm = (date)=> {
       value1.value = false;
       date1.value = getSimpleDate(date);
       console.log(date1.value)
}
const onConfirm2=(date)=> {
      value2.value = false;
      date2.value = getSimpleDate(date);
      console.log(date2.value)
}
const getSimpleDate = (date)=> {
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
        return y + '-' + m + '-' + d ;
}

</script>

<style lang="less" scoped>
.calendar {
      margin-left: 15px;
      margin-top: 18px;
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
        // position: absolute;
        // border: solid 1px red;
        margin-top: 12px;
        margin-left: 261px;
        margin-bottom: 5px;
        width: 83px;
	      height: 31px;
        // color: rgb(102, 102, 102);
        line-height: 150%;
        font-size: 13px;
        border-radius: 16px;
        // background-color: white;
      }

    }

</style>