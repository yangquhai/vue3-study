<!-- 用于头部框的搜索框制作 -->
<template>
    <form action="/">
      <van-search v-model="value"  shape="round" :placeholder="placeholder" @search="onSearch" />
    </form>
</template>

<script setup>
import { ref,watch } from 'vue'
const value = ref('')
// const flag = ref(['1','2','3'])
const props = defineProps({
  placeholder: String,
  keyword:String,
})
const emit = defineEmits(['search'])
const onSearch = () => {
  console.log(props.keyword)
  emit('search', value.value)
}
watch(()=>props.keyword,(newVal)=>{
  value.value = newVal
})
</script>

<style lang="less" scoped>
:deep(.van-field__control::-webkit-input-placeholder) {
  // color: rgba(95, 100, 110, 1);
  font-size: 12px;
}

:deep(.van-field__control) {
  // border: solid 1px red;
  font-size: 12px;
}
</style>