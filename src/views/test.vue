<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from 'vue'
const router = useRouter()
const msg  = 'msgs'
const add = () =>{
    console.log(msg2.value)
    msg2.value = '2345'
    arrey.value.push('4')
    // router.push('/404')
}
const msg2 = ref('123')
const arrey = ref(['1','2','3'])
// function test(params) {
//     this.params = params
//     // console.log(this.params)
// }
// function test2(){

// }
// const yuanxing = new test(2223)
// // yuanxing.params
// console.log(yuanxing.params)

</script>

<template>
    <div @click="add">123123 {{ msg }} {{ msg2 }} </div>
    <div v-for="item in arrey">{{ item }}</div>
    <!-- <div @click="test(222)">123</div> -->
</template>

<style lang="scss">

</style>