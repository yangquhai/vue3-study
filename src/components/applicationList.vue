<template>
<!-- lisy  -->
    <div class="page-content">
        <div class="card-content" v-if="fittingList.length>0" >
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <!-- p-l-20 p-t-20 p-r-20 bd-b-s1 -->
                <div  v-for="item,index of fittingList" :key="index">
                    <van-card
                        :desc="item.goods_size"
                        :thumb="item.goods_url"
                        >
                        <template #title>
                            <div class="txt-bold txt-md">{{item.goods_brand}}</div>
                        </template>
                        <template #tags>
                            <div class="flex ">
                                <div class="flex flex-1 flex-l flex-wrap" style="max-width:280px">
                                <!-- <van-tag color="var(--van-primary-color-p15)"  text-color="var(--van-orange)"style="color: var(--van-primary-color); background: var(--van-primary-color-p15);" title="">{{userData.TEL}}</van-tag> -->
                                <van-tag v-for="i_item,i_index of item.goods_tag"  plain color= 'var(--van-primary-color)' style="background:transparent;"
                                :key="i_index"  class="m-r-8 m-b-4" >{{i_item}}</van-tag>
                                </div>
                                <div class="txt-r">库存 {{item.goods_stock}}</div>
                            </div>
                        </template>
                        <template #price>
                            <div class="flex">
                                <span style="color:var(--van-orange)" class="txt-sm m-t-4">￥<span class="txt-md">{{formatter.format(item.goods_prce)}}</span></span>
                            </div>
                        </template>
                        <template #num>
                            <div class="flex">
                                <van-button @click="throttledOnConfirm(item,index,'sub')"  v-if="item.goods_num>0" round style="width:22px;height:22px;" class="txt-md" size="mini">-</van-button>
                                <span @click="chooseNum(item,index)" v-if="item.goods_num>0" style="min-width:30px;line-height:20px" class="c-black txt-c">{{item.goods_num}}</span>
                                <van-button @click="throttledOnConfirm(item,index,'add')" color="var(--van-orange)" class="txt-md" round style="width:22px;height:22px;" size="mini">+</van-button>
                            </div>
                        </template>
                        <!-- <template #footer>
                        </template> -->
                    </van-card>
                </div>
            </van-list>
        </div>
        <van-overlay style="z-index:3;" :show="showNum" @click="showNum = false" >
            <div class="wrapper" >
                <div class="block" @click.stop>
                    <div class="p-t-8 p-b-8 txt-c txt-lg txt-bold bd-b-s1">提示</div>
                    <div class="flex flex-l m-t-12 flex-c">
                        <div class="txt-nowrap">数量：</div>
                        <input class="changeNum_inp txt-bold p-t-12 p-b-12 txt-c txt-l" :autofocus="showNum?true:false" v-model="chooseGoodNum"  type="number" placeholder="请输入修改数量"/>
                    </div>                    
                    <div class="flex flex-c bd-t-s1 p-t-12 p-b-12 choose_inputBut">
                        <van-button @click="showNum = false" round style="width:35%;" class="txt-md m-r-12" size="small">取消</van-button>
                        <van-button @click="confirmGoodNum"  round style="width:35%;" color="var(--van-orange)"  class="txt-md m-l-12" size="small">加入购物车</van-button>
                    </div>                
                </div>
            </div>
        </van-overlay>
        <van-empty v-if="fittingList.length==0&&loading" description="暂无数据" />
        <van-loading v-if="!loading" class="flex flex-c m-t-32" color="var(--van-primary-color)" />
    </div>
</template>

<script setup>
import { showConfirmDialog, showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'
import { ref,defineExpose } from 'vue'
import { useThrottleFn, useDateFormat, useDebounceFn } from '@vueuse/core'
import request from '_api'
    const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    });
    const result = formatter.format();
    let filterType = ''
    let timeList = ''
    let search = "科勒"
    const itemChoose = ref(null)
    const indexChoose = ref(null)
    const showNum = ref(false)
    const loading = ref(false)
    const finished = ref(false)
    const isLoading = ref(false)
    const fittingList = ref([])
    const chooseGoodNum = ref(0)//选中的更改数量
    const props = defineProps({
        show: {
            // 是否显示
            type: Boolean,
            default: () => []
        },
        classifyChooseList:{
            type: Array,
            default: () => []
        },
        timeStart:{
            type: String,
            default: () => []
        },
        timeEnd:{
            type: String,
            default: () => []
        },
        timeField:{
            type: String,
            default: () => []
        },
        searchValue:{
            type: String,
            default: () => []
        },
        page:{
            type: Number,
            default: () => []
        },

    })

    const emit = defineEmits(['clickChild','clickPage','changeGoods'])
    // 使用创建名称，接受一个数组
    const clickChild = () => {
        let vaulShow = props.show
        let param = {
            content:!vaulShow
        }
        //传递给父组件
        emit('clickChild',param)
    }
     const clickPage = () => {
        let pagefrom = props.page
        let param = {
            content:pagefrom
        }
        //传递给父组件
        emit('clickPage',param)
    }
     const changeGoodsCart = () => {
        //传递给父组件
        emit('changeGoods')
    }
    //更新列表 
    const init = () => {
        fittingList.value = []
        loading.value = true
        props.page = 1
        getMaterialApplyList()
    }
    // 改变商品数量数据
    const change_fil_goods = () => {
        console.log('点击后更改数量的')
        fittingList.value.forEach( (ele,inde) => {
           ele.goods_num =  0
        })
    }
    // 获取列表数据
    const getMaterialApplyList = async () => {
        let timelist = [{"field":"","start":"","end":""}]
        timelist[0].field = props.timeField
        timelist[0].end = props.timeEnd
        timelist[0].start = props.timeStart
        let filter = []
        let fileterText = {}
        // let nameIndex = ''
        if(props.classifyChooseList.length>0){  //拼接数据传到后端
            props.classifyChooseList.forEach((ele,ind) => {
                fileterText = {"title":'',"list":[]}
                ele.data.forEach((ele_o,o_ind) => {
                    if(ele_o.is_choose) {
                        fileterText.title = ele.field
                        let textFrom = {"value":""}
                        textFrom.value = ele_o.value
                        fileterText.list.push(textFrom)
                    }
                })
                if(fileterText.list.length>0){
                        filter.push(fileterText)
                }
            })
        }
        try {
            const res = await request.getMaterialApplyList(
                {
                    pageIndex:props.page,
                    pagesize: 15,
                    filterType: filter,
                    timeList: timelist,
                    search: props.searchValue,
                }
            )
            if(res.code == 200){
                 let param = {
                    content:false
                }
                //传递给父组件
                emit('clickChild',param)
                if(props.page==1&&res.data.listData.length>0){
                    loading.value = false
                    // 分割不同的标签
                    res.data.listData.forEach(element => {
                       element.goods_tag = element.goods_tag.split(',')
                    });
                    fittingList.value  = res.data.listData
                    finished.value = false//
                    let paramPage = {content:props.page+1}
                    emit('clickPage',paramPage)//传递给父组件
                }else if(props.page>1&&res.data.listData.length>0){
                    res.data.listData.forEach(element => {
                       element.goods_tag = element.goods_tag.split(',')
                    });
                    fittingList.value  = fittingList.value.concat(res.data.listData)
                    loading.value = false
                    finished.value = false
                    let paramPage = { content:props.page+1}
                    emit('clickPage',paramPage)//传递给父组件
                }else if(res.data.listData.length==0){
                    finished.value = true
                    loading.value = true

                }
            }else{
                showToast(res.message);
            }
        } catch (err) {
            loading.value = false
            console.log(err)
        }
    }
    getMaterialApplyList()

    // 滚动加载
    const onLoad = async () => {
        if(finished==true||loading.value==false){
            return
        }
        getMaterialApplyList()
    }

    // 更改数据
    const chooseNum = async (item,index) => {
        showNum.value = !showNum.value
        chooseGoodNum.value = item.goods_num
        indexChoose.value = index
        itemChoose.value  =  JSON.parse(JSON.stringify(item)) 
    }

    // 更改数量后确定
    const confirmGoodNum = async () => {
        itemChoose.value.goods_num = chooseGoodNum.value
        useThrottleFn(change_goodsNum(itemChoose,indexChoose.value),1000)
    }

    const count = ref(0)
    const handleButtonClick = useDebounceFn((item,index,text) => {
      add_goods(item,index,text)
    }, 1000)
    const throttledOnConfirm = (item,index,text) => {
        if(text=='add'){
            item.goods_num = item.goods_num + 1
        }else if(text=='sub'){
            item.goods_num = item.goods_num - 1
        }
      handleButtonClick(item,index,text);
    };
    // const throttledOnConfirm = (item,index,text) => {
    //     if(text=='add'){
    //         item.goods_num = item.goods_num +1
    //     }else if(text=='sub'){
    //        item.goods_num = item.goods_num -1
    //     }
        
    //     useDebounceFn((item,index,text) => {add_goods(item,index,text)},5000) 
    //     // setTimeout(()=>{
    //     //     add_goods(item,index,text)
    //     // },1000)
        
    //     // async (item,index,text) => {useDebounceFn
    //     // useThrottleFn(add_goods(item,index,text),1000) 
    //     // }   
    // }   
    
    const addOrdel =  (item,index,text) => {
        console.log('编辑不同的商品增加到购物车',item)
        useThrottleFn(add_goods(item,index,text),1000)
    }
    // 编辑不同的商品增加到购物车
    const change_goodsNum = async (item,index) => {
        try {
            const res = await request.getMaterialApplyListCart_Add(
                {
                    "data":{
                        "goods_spbm":item.value.goods_spbm,
                        "goods_spmc":item.value.goods_spmc,
                        "goods_brand": item.value.goods_brand,
                        "goods_url": item.value.goods_url,
                        "id": item.value.id,
                        "goods_num": item.value.goods_num,
                        "goods_size": item.value.goods_size,
                        "goods_prce": item.value.goods_prce
                    }
                }
            )
            if(res.code == 200){
                showNum.value = false
                changeGoodsCart()
                fittingList.value.forEach( (ele,inde) => {
                    if(inde == index){
                        ele.goods_num =  item.value.goods_num
                    }
                })
            }else{
                showToast(res.message);
            }
            } catch (err) {
            loading.value = false
            console.log(err)
        }
    }
    // 编辑不同的商品增加到购物车
    const add_goods = async (item,index,text) => {
        let numAdd = item?JSON.parse(JSON.stringify(item.goods_num)):'' 
        // if(text=='add'){
        //     numAdd++
        // }else{
        //     numAdd--
        // }
        // fittingList.value.forEach( (ele,inde) => {
        //     if(inde == index&&text=='add'){
        //         ele.goods_num =  ele.goods_num + 1  
        //     }else if(inde == index&&text=='sub'){
        //         ele.goods_num =  ele.goods_num - 1  
        //     }
        // })
        try {
            const res = await request.getMaterialApplyListCart_Add({
                "data":{
                    "goods_spbm":item.goods_spbm,
                    "goods_spmc":item.goods_spmc,
                    "goods_brand": item.goods_brand,
                    "goods_url": item.goods_url,
                    "id": item.id,
                    "goods_num":numAdd,
                    "goods_size": item.goods_size,
                    "goods_prce": item.goods_prce
                }
            })
                if(res.code == 200){
                    changeGoodsCart()
                    fittingList.value.forEach( (ele,inde) => {
                        if(inde == index&&text=='addf'){
                            ele.goods_num =  numAdd  
                        }else if(inde == index&&text=='subf'){
                            ele.goods_num =  numAdd
                        }
                    })
                } else {
                    showToast(res.message);
                }
            } catch (err) {
            loading.value = false
        }
    }
    defineExpose({
         init,
         addOrdel,
         change_fil_goods
    }); //这里是关键
</script>

<style lang="less" scoped>

.bg-color{
   background: var( --van-orange);
   color: #fff;
}

.bd-b-s1{
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(229, 229, 229, 1);
}

.title_brand{
   padding: 1px 0;
}

.bg-brand{
   padding: 1px 0;
   border: 1px solid var( --van-orange);
   color: var( --van-orange);
   border-radius: 3px;
}
.my_fitting{
    padding: 20px 10px;
    min-height: 100vh;
    background: #fff;
}

.fitting_price{
     color: var( --van-orange);
}

// 修改提示语
    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .block {
        position: relative;
        border-radius: 5px;
        width: 80%;
        height: 150px;
        background-color: #fff;
    }

    .changeNum_inp{
        color: var(--van-orange);
        width:98px;
        border: 0px;
        outline:none;
        cursor: pointer;
    }
    .choose_inputBut{
        width: 100%;
        position: absolute;
        bottom: 0;
    }
</style>