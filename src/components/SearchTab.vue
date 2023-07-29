<template>
    <div>
      <form action="/">
      <van-search
        v-model="value"
        show-action
        :placeholder="placeholder"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    </div>
</template>

<script setup>
import {ref} from 'vue'
    const value = ref('1312312')
    const props =defineProps({
      placeholder:String
    })
    const emit = defineEmits(['search'])
    const onSearch = ()=> {
      console.log(props.placeholder)
      emit('search',value.value)
    }
    const onCancel = ()=>{
      console.log(222)
    } 
</script>

<style lang="less" scoped>
   :deep(.van-field__control::-webkit-input-placeholder)  {
        // color: rgba(95, 100, 110, 1);
        font-size: 12px;
    }
    :deep(.van-field__control)  {
        // border: solid 1px red;
        font-size: 12px;
    }
</style>