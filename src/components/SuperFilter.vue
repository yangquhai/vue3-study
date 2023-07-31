<!-- 用于筛选界面俩种type对应的值，包含text与select字段 -->
<template>
    <div class="page-content2">
        <div class="card">
            <!-- 渲染type为select的数据 -->
            <div v-if="selectList.length != 0" class="card-content">
                <div v-for="(item, index) in selectList" :key="item.fieldname">
                    <div>{{ item.text }}</div>
                    <div class="options">
                        <div class="buttons" @click="showSelectPopovers(index)">
                            <div>{{ value[index].luoji }}</div>
                            <van-icon name="arrow-down" />
                        </div>
                        <van-popup v-model="showPopoverSelect[index]" round position="bottom" :style="{ height: '30%' }">
                            <van-picker :columns="item.condition" @confirm="onConfirm" @cancel="onCancel" value-key="luoji"
                                show-toolbar item-height="1rem" :default-index="0" />
                        </van-popup>
                        <van-field v-model="item.values[0].value" :placeholder="'请输入' + item.text" right-icon="search" />
                    </div>
                    <van-divider></van-divider>
                </div>
            </div>

            <!-- 渲染type为text的数据 -->
            <div v-if="textList.length != 0" class="card-content">
                <div v-for="(item, index) in textList" :key="item.fieldname">
                    <div>{{ item.text }}</div>
                    <div class="options">
                        <div class="buttons" @click="showTextPopovers(index)">
                            <div class="luoji">{{ value1[index].luoji }}</div>
                            <van-icon name="arrow-down" />
                        </div>
                        <van-popup v-model="showPopoverText[index]" round position="bottom" :style="{ height: '30%' }">
                            <van-picker :columns="item.condition" @confirm="onConfirmText" @cancel="onCancelText"
                                value-key="luoji" show-toolbar item-height="1rem" :default-index="0" />
                        </van-popup>
                        <van-field v-model="item.values[0]" :placeholder="'请输入' + item.text" clearable />
                    </div>
                    <van-divider></van-divider>
                </div>
            </div>

            <!-- <div v-if="textList.length!=0">
            <div v-for="(item,index) in textList" :key="item.fieldname">
                <div>{{item.text}}</div>
                <div class="options" >
                    <div class="buttons" @click="showTextPopovers(index)">
                        <div>{{value1[index].luoji}}</div> 
                        <van-icon name="arrow-down" />
                    </div>
                    <van-popup v-model="showPopoverText[index]" round position="bottom" :style="{ height: '30%' }" >
                    <van-picker
                        :columns="item.condition"
                        @confirm="onConfirmText"
                        @cancel="onCancelText"
                        value-key = "luoji"
                        show-toolbar
                        item-height="1rem"
                        :default-index="1"
                        />
                    </van-popup>
                    <van-field v-model="item.values[0]" :placeholder="'请输入' +item.text" clearable/>
                </div>
            <van-divider></van-divider>
            </div>
            </div> -->
            <!-- <div class="card-footer">
                <van-button class="button" round type="success" size="small">重置</van-button>
                <van-button class="button1" round type="success" size="small" @click="keep">保存</van-button>
                <van-button round type="success" size="small" @click="sift">筛选</van-button>
            </div> -->
        </div>
    </div>
</template>
 
<script setup>
import { computed, ref } from "vue";
// const tabListData = ref('')
// 用于控制显示
const showPopoverSelect = ref([])
const showPopoverText = ref([])
// 用户点击的condition索引
const showPopoverSelectFlag = ref([])
// const showPopoverTextFlag = ref([])
const value = ref([])
const value1 = ref([])
const props = defineProps({
    tabListData: Object
})
// console.log(props.tabListData)
// 用于筛选出type为select的数据，形成新的数组渲染
const selectList = computed(() => {
    let selectList = []
    for (let i = 0; i < props.tabListData.searchCondition.length; i++) {
        // console.log(this.tabListData.searchCondition[i])
        if (props.tabListData.searchCondition[i].type == "select") {
            selectList.push(props.tabListData.searchCondition[i])
            for (let j = 0; j < props.tabListData.searchCondition[i].condition.length; j++) {
                if (props.tabListData.searchCondition[i].condition[j].select)
                    // console.log(i)
                    value.value.push({ luoji: props.tabListData.searchCondition[i].condition[j].luoji })
                // this.value1[valueIndex].luoji = this.tabListData.searchCondition[i].condition[j].luoji
            }
        }
    }
    return selectList
})
// 用于筛选出type类型为text的数据，形成新的数组渲染
const textList = computed(() => {
    let textList = []
    for (let i = 0; i < props.tabListData.searchCondition.length; i++) {
        // console.log(this.tabListData.searchCondition[i])
        if (props.tabListData.searchCondition[i].type == "text") {
            textList.push(props.tabListData.searchCondition[i])
            // this.value1.push({luoji:'包含'})
            // console.log(this.tabListData.searchCondition[i])
            for (let j = 0; j < props.tabListData.searchCondition[i].condition.length; j++) {
                if (props.tabListData.searchCondition[i].condition[j].select)
                    // console.log(i)
                    value1.value.push({ luoji: props.tabListData.searchCondition[i].condition[j].luoji })
                // this.value1[valueIndex].luoji = this.tabListData.searchCondition[i].condition[j].luoji
            }
            // this.showPopoverText.push(false)
        }
    }
    // console.log(this.value1)
    return textList
})
const onSelect = (action) => {
    console.log(action.text)
    // this.name = action.text
}
const chooseOptions = (action) => {
    console.log(index)
}
const clear = () => {
    console.log(111)
}
const clear2 = () => {
    console.log(222)
}
const sift = () => {
    const emit = defineEmits(['sfit'])
    emit('sift')
}
const showSelectPopovers = (index) => {
    // this.showPopoverSelect[index] = true
    // this.$set(this.showPopoverSelect,index,true)
    showPopoverSelect[index].value = true
    showPopoverSelectFlag.value = index
    // console.log(this.showPopoverSelect[index])
}
const onConfirm = (value, index) => {
    // Toast(`当前值：${value}, 当前索引：${index}`);
    console.log(index, value, showPopoverSelectFlag.value, value[this.showPopoverSelectFlag].value)
    value.value[showPopoverSelectFlag.value] = value
    // this.$set(this.value,index,value)
    this.$set(this.showPopoverSelect, this.showPopoverSelectFlag, false)
    console.log(this.showPopoverSelect)
}
const onCancel = () => {
    // Toast('取消');
    this.$set(this.showPopoverSelect, this.showPopoverSelectFlag, false)
    showPopoverSelect.value[showPopoverSelectFlag.value] = false
    showPopover.value = false
}
const showTextPopovers = (index) => {
    showPopoverText.value[index] = true
    showPopoverTextFlag.value = index
}
const onConfirmText = (value, index) => {
    // Toast(`当前值：${value}, 当前索引：${index}`);
    console.log(index, value, showPopoverTextFlag.value)
    value1.value[showPopoverTextFlag.value] = value
    // this.$set(this.value1,index,value)
    showPopoverText.value[showPopoverTextFlag.value] = false
}
const onCancelText = () => {
    this.$set(this.showPopoverText, index, true)
    showPopoverText.value[index] = true
    showPopover1.value = false
}

</script>
 
<style lang="less" scoped>
.card {
    // overflow:scroll; 
    // width:1200px; 
    // border: solid 1px red;
    // margin-bottom: 40px;
    // max-height:200px;
    margin-left: 15px;
    margin-top: 9px;

    :deep(.van-field__control::-webkit-input-placeholder) {
        // color: rgba(95, 100, 110, 1);
        font-size: 12px;
    }

    :deep(.van-field__control) {
        // border: solid 1px red;
        font-size: 12px;
    }

    :deep(.van-divider) {
        margin-left: 0px;
        width: 94%;
        // border: solid 1px red;
        margin-top: 0px;
    }

    .checkboxPre {
        // border: solid 1px red;
        display: flex;
        margin-left: 8px;
        flex-wrap: wrap
    }

    .options {
        display: flex;
        // align-items: center;
        // border-bottom: solid 1px rgba(242, 243, 245, 1);
        // padding-left: 15px;
        width: 94%;
        // border: solid 1px red;
        margin-bottom: 5px;

        .buttons {
            display: flex;
            align-items: center;
            // border: solid 1px red;
            width: 121px;
            height: 26px;
            font-size: 12px;

            .luoji {
                width: 60px;
                // border: solid 1px red;
            }

            .van-icon {
                // position: absolute;
                // border: solid 1px red;
                // margin-left: 60px;
                color: rgba(153, 153, 153, 1);
                ;
            }
        }

        .title {
            // border: solid 1px red;
            display: flex;
            align-items: center;
        }

        .van-cell {
            padding: 0px;
            margin-left: 16px;
        }
    }

    .card-footer {
        // border: solid 1px red;
        width: 90%;
        margin-left: 25px;
        // margin-top: 94px;
        // position: fixed;
        display: flex;
        z-index: 2;
        justify-content: flex-end;

        // background-color: rgba(255, 255, 255, 1);
        // padding-bottom: 10px;
        .van-button {
            width: 83px;
            height: 31px;
            border: none;
            background-color: rgba(24, 144, 255, 1);
            color: rgba(255, 255, 255, 1);
            border-radius: 16px;
            margin-left: 10px;
            margin-bottom: 10px;
            // color: rgba(128, 128, 128, 1);
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
    }
}
</style>