<template>
    <searchTab :placeholder="placeholder" @search="search"></searchTab>
    <div>
        index
    </div>
    <calendar></calendar>
    <superFilter></superFilter>
    <userInfo></userInfo>
</template>

<script setup>
import request from '_api'
import {ref} from 'vue'

const placeholder = ref('12313123')

const search = (value)=> {
    console.log(value,'12312312')
}

const getData = async()=> {
        let formData = new FormData()
        formData.append('Ttablename','bxd_main')
        formData.append('Turl','bxd.aspx')
        formData.append('Tformnamecn','4366')
        formData.append('Tsystem_lcmc','报销单')
        formData.append('TisFirst','1')
    try {
        const res = await request.getUserInfo(formData)
        // const res = await request.uploadCheckInATakePhotosImgs(formData)
        const resImg = res.data
        console.log(resImg)

        
    } catch (err) {
        console.log(err)
    }
}
getData()
</script>

<style lang="scss" scoped>

</style>