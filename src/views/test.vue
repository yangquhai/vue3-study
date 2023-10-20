<script setup>
import { useRouter } from "vue-router";
const router = useRouter()
const msg  = 'msgs'
const add = () =>{
    console.log(msg2.value)
    router.push('/404')
}
const msg2 = ref('')
// function test(params) {
//     this.params = params
//     // console.log(this.params)
// }
// function test2(){

// }
// const yuanxing = new test(2223)
// // yuanxing.params
// console.log(yuanxing.params)1

</script>

<template>
    <div @click="add">123123 {{ msg }} </div>
    <!-- <div @click="test(222)">123</div> -->
</template>

<style lang="scss">

</style>