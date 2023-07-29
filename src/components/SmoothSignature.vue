<!-- 电子签名 -->
<template>
    <div class="mbDemo">
        <div class="wrap1" v-show="!showFull">
            <canvas class="canvas1" id="canvas1" />
            <div class="actions">
                <button @click="handleClear1">Clear</button>
                <button @click="handleUndo1">Undo</button>
                <button @click="handlePreview1">View PNG</button>
                <button @click="handleColor1">Change Color</button>
                <button @click="handleFull">Full Screen</button>
            </div>
        </div>
        <div class="wrap2" v-show="showFull">
            <div class="actionsWrap">
                <div class="actions">

                    <van-button @click="_showPopup = false" icon="arrow-left" type="default" round
                        class="m-r-12 p-l-32 p-r-32">返 回</van-button>
                    <van-button @click="handleClear2" icon="revoke" type="default" round class="m-r-12 p-l-32 p-r-32">重
                        写</van-button>
                    <van-button @click="confirmSignature" icon="certificate" type="primary" round
                        class="m-r-12 p-l-32 p-r-32">确 定</van-button>
                </div>
            </div>
            <canvas class="canvas" id="canvas2" />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import SmoothSignature from 'smooth-signature'
import { useDebounceFn, useVModel } from '@vueuse/core'
import { showToast, showConfirmDialog } from 'vant'
const props = defineProps({
    showPopup: {
        type: Boolean,
        default: () => false
    }
})

const emits = defineEmits(['update:showPopup', 'getSignature'])
const _showPopup = useVModel(props, 'showPopup', emits)

const showFull = ref(true)
let signature1, signature2

onMounted(() => {
    initSignature1()
    initSignature2()
})

function initSignature1() {
    const canvas = document.getElementById('canvas1')
    const options = {
        width: window.innerWidth - 10,
        height: 200,
        minWidth: 2,
        maxWidth: 6,
        bgColor: '#f6f6f6',
    }
    signature1 = new SmoothSignature(canvas, options)
}

function initSignature2() {
    const canvas = document.getElementById('canvas2')
    const options = {
        width: window.innerWidth - 100,
        height: window.innerHeight - 50,
        minWidth: 3,
        maxWidth: 10,
    }
    signature2 = new SmoothSignature(canvas, options)
}

function handleClear1() {
    signature1.clear()
}

function handleClear2() {
    signature2.clear()
}

function handleUndo1() {
    signature1.undo()
}

function handleUndo2() {
    signature2.undo()
}

function handleFull() {
    showFull.value = !showFull.value
}

function handlePreview1() {
    const isEmpty = signature1.isEmpty()
    if (isEmpty) {
        alert('isEmpty')
        return
    }
    const pngUrl = signature1.getPNG()
    console.log(pngUrl)
    // window.previewImage(pngUrl)
}

function handlePreview2() {
    const isEmpty = signature2.isEmpty()
    if (isEmpty) {
        alert('isEmpty')
        return
    }
    const canvas = signature2.getRotateCanvas(-90)
    const pngUrl = canvas.toDataURL()
    emits('getSignature', pngUrl)
    console.log(pngUrl)
    // window.previewImage(pngUrl, 90)
}

function handleColor1() {
    signature1.color = getRandomColor()
}

function handleColor2() {
    signature2.color = getRandomColor()
}

function getRandomColor() {
    return '#' + Math.random().toString(16).slice(-6)
}

// 确认签名
const confirmSignature = () => {

    const isEmpty = signature2.isEmpty()
    if (isEmpty) {
        showToast('请完成签名')
        return
    }
    showConfirmDialog({
        className: 'landscape-mode',
        title: '签名提示',
        message: '签名完成后将不可修改，确认完成吗？'

    }).then(() => {
        // on confirm
        const canvas = signature2.getRotateCanvas(-90)
        const imgFile = canvas.toDataURL()
        emits('getSignature', imgFile)

        _showPopup.value = false
    }).catch(() => {
        // on cancel
    })
}
</script>

<style lang="less" scoped>
.mbDemo {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    canvas {
        border-radius: 10px;
        border: 2px dashed #ccc;
    }

    .wrap1 {
        margin-top: 100px;

        .actions {
            margin-bottom: 20px;
        }
    }

    .wrap2 {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        padding: 15px;
        display: flex;
        justify-content: center;

        .actionsWrap {
            width: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .canvas {
            flex: 1;
        }

        .actions {
            margin-right: 10px;
            white-space: nowrap;
            transform: rotate(90deg);
        }
    }
}

</style>