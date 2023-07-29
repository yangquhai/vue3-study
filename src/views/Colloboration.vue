<template>
    <div>
        123123132
    </div>
    <calendar></calendar>
    <search></search>
    <superFilter></superFilter>
    <userInfo></userInfo>
</template>

<script setup>
import request from '_api'
import {ref} from 'vue'


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
        // let formData = new FormData()
        // formData.append('Ttablename','bxd_main')
        // formData.append('Turl','bxd.aspx')
        // formData.append('Tformnamecn','4366')
        // formData.append('Tsystem_lcmc','报销单')
        // formData.append('TisFirst','1')
        // let data = await api.getDropData(formData)
        // tabListData = data.colums
        // placeholders.value = tabListData.search.text
        // console.log(tabListData)
}
getData()
</script>

<style lang="scss" scoped>

</style>