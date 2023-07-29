<!-- 签到拍照 -->
<template>
    <div v-if="!!clientInfo.name">


        <div role="tablist" class="van-tabbar van-tabbar--fixed van-hairline--top-bottom van-safe-area-bottom flex-r">
            <div role="tab" class="flex">
                <van-button @click="showPopupTypeSelect = true" type="primary" icon="photograph" plain round size="small" class="m-r-12 p-l-16 p-r-16 flex">&nbsp;拍&nbsp;照</van-button>
                <van-button @click="confirmCheckInATakePhotosData" type="primary" icon="checked" round size="small" class="m-r-12 p-l-16 p-r-16">&nbsp;确&nbsp;认</van-button>
            </div>
        </div>
        <div class="page-content van-safe-area-bottom">
            <!-- 客户信息 -->
            <div class="card">

                <div class="card-header flex p-0">
                    <span class="flex flex-wrap p-12 txt-c-1">
                        <span class="m-r-8">{{ clientInfo.name }}</span>

                        <a :href="'tel:' + clientInfo.tel" class="flex flex-l flex-1 txt-c-1">
                            <van-icon name="phone-circle" size="16px" class="m-r-4" />
                            <span>{{ clientInfo.tel }}</span>
                        </a>
                    </span>
                </div>
                <div class="card-content">
                    <div class="flex flex-l flex-t txt-gray p-l-12 p-r-12">
                        <van-icon name="location" size="14" class="m-r-4" />
                        <span>{{ clientInfo.address || '无' }}</span>
                    </div>
                    <van-row gutter="4" class="m-t-12 m-r-12 m-l-12">
                        <van-col span="12" class="flex flex-col flex-l">
                            <small class="txt-gray">部门</small>
                            <span class="m-t-4 m-b-12">{{ clientInfo.dept }}</span>
                        </van-col>
                        <van-col span="12" class="flex flex-col flex-l">
                            <small class="txt-gray">导购员</small>
                            <a :href="'tel:' + clientInfo.assoTel" class="m-t-4 m-b-12 txt-c-1">
                                {{ clientInfo.asso }}
                                <van-icon name="phone-circle" size="14px" />
                            </a>
                        </van-col>
                    </van-row>
                </div>
            </div>

            <!-- 拍照上传 -->
            <div class="card">

                <div class="card-header flex p-0">
                    <b class="p-12">拍照上传</b>
                    <van-icon @click="showPopupTypeSelect = true" name="photograph" size="20" class="p-12 txt-primary" />

                    <van-popup v-model:show="showPopupTypeSelect" round :style="{ width: '80vmin' }">

                        <div class="bg-gray txt-primary p-12">
                            <span class="flex flex-l">
                                <van-icon class="m-r-4" name="label-o" size="16" />选择类别
                            </span>
                        </div>

                        <van-grid clickable column-num="3"
                            :style="{ overflow: 'auto', height: '80vmin', alignContent: 'start' }">
                            <van-grid-item v-for="(typeItem, typeIndex) in typeList" :key="typeIndex"
                                @click="addImplImgGroup(typeItem.ZT)">
                                <template #default>
                                    <div class="tag-select"
                                        :class="{ 'selected': fileList.some(cardItem => { return cardItem.type === typeItem.ZT }) }">
                                        <span class="m-l-4 m-r-4 van-multi-ellipsis--l2">{{ typeItem.ZT }}</span>
                                        <span class="selected-icon"><van-icon name="success" size="12" /></span>
                                    </div>
                                </template>
                            </van-grid-item>
                        </van-grid>

                    </van-popup>
                </div>

                <div class="card-content">
                    <div class="card" v-for="fileItem in fileList">

                        <div class="card-header flex p-0">
                            <span class="p-12">{{ fileItem.type }}</span>
                            <van-icon @click="delImgCard(fileItem.type)" name="delete-o" size="20" class="p-12" />
                        </div>

                        <div class="card-content">
                            <div class="card-content-inner p-t-0 p-b-0">
                                <van-uploader v-model="fileItem.srclist"
                                    :after-read="$event => uploadCheckInATakePhotosImgs($event, fileItem.type)"
                                    @delete="$event => delImplImg($event, fileItem.type)"
                                    :preview-options="{ closeable: true }" :max-count="12" multiple
                                    preview-size="1.86rem" />
                            </div>
                        </div>

                        <div class="card-footer p-0">

                            <van-field v-model="fileItem.remark" :key="fileItem.id" placeholder="填写备注" rows="1"
                                type="textarea" maxlength="300" left-icon="chat-o" class="p-l-12 p-r-12" autosize />

                        </div>
                    </div>

                    <van-empty v-show="!!!fileList.length" image-size="30%" class="p-0" />
                </div>
                <div v-show="!!!fileList.length" class="van-haptics-feedback p-12 txt-primary flex flex-c"
                    @click="showPopupTypeSelect = true">
                    <van-icon class="m-r-4" name="photograph" size="16" />
                    <span>拍照上传</span>
                </div>

            </div>

            <!-- 信息填写 -->
            <div class="card">

                <div class="card-header"><b>信息填写</b></div>

                <div class="card-content">
                    <van-cell-group>
                        <van-field v-for="formIem in customForm" v-model="formIem.value" :key="formIem.key"
                            :label="formIem.label" input-align="right" error-message-align="right"
                            :placeholder="`请输入${formIem.label}`" />
                    </van-cell-group>
                </div>

            </div>

            <!-- 备注 -->
            <div class="card">

                <div class="card-header"><b>备注</b></div>

                <div class="card-content">
                    <van-cell-group>
                        <van-field placeholder="填写备注" v-model="inputRemark" rows="2" type="textarea" maxlength="300"
                            input-align="right" show-word-limit autosize />
                    </van-cell-group>
                </div>

            </div>

            <van-back-top target=".page-content"
                bottom="calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-padding-sm))"
                right="var(--van-padding-sm)" />
        </div>
    </div>
    <van-empty v-if="!!!clientInfo && !isLoading" description="暂无数据" />

    <van-loading v-if="isLoading" class="flex flex-c m-t-32" color="var(--van-primary-color)" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import request from '_api'
import { useDebounceFn } from '@vueuse/core'
import { showConfirmDialog, showToast, showLoadingToast, showSuccessToast, showFailToast } from 'vant'

const props = defineProps({
    settingID: {
        // tzsid
        type: String,
        required: true
    },
    orderNumber: {
        // 单号
        type: String,
        required: true
    },
    clientNumber: {
        // 客户编码
        type: String,
        required: true
    },
    type: {
        // 页面类型
        type: String
    },
    detailsType: {
        // 明细类型
        type: String
    },
    statusType: {
        // 页面状态类型
        type: String
    }
})

const isLoading = ref(false)
const sysID = props.clientNumber + (Date.now() % 1000) + '_' + (Math.random() * 1000 | 0) // 后端所需的system_Id，前端随机生成


// 拍照上传
const showPopupTypeSelect = ref(false)
const typeList = ref([])
const fileList = ref([]) // 拍照的图片组

// 新增图片组
const addImplImgGroup = (type) => {
    const hasImgGroup = fileList.value.some(cardItem => { return cardItem.type === type })
    if (hasImgGroup) {
        showToast('该类别已存在')
        return
    } else {
        fileList.value.unshift({
            remark: '',
            type: type,
            srclist: []
        })
        showPopupTypeSelect.value = false
    }
}

// 图片压缩
// 将 dataURL 转换为 Blob 对象
const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

function addWatermark(ctx, canvas, text) {
    const padding = 10
    const fontSize = 16
    const textWidth = ctx.measureText(text).width
    const textHeight = fontSize + 2 * padding

    // 在底部绘制半透明矩形
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, canvas.height - textHeight, canvas.width, textHeight)

    // 绘制文本信息
    ctx.fillStyle = 'white'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText(text, padding, canvas.height - padding)

    // 绘制当前时间
    const currentTime = new Date().toLocaleString()
    const timeTextWidth = ctx.measureText(currentTime).width
    ctx.fillText(currentTime, canvas.width - timeTextWidth - padding, canvas.height - padding)
}

const imageCompression = async (file, maxWidth, maxHeight) => {
    // 创建 FileReader 实例
    const reader = new FileReader();

    // 使用 FileReader 读取文件内容
    reader.readAsDataURL(file);

    // 等待文件读取完成
    await new Promise((resolve) => {
        reader.onload = () => resolve();
    });

    // 创建 Image 实例
    const img = new Image();

    // 等待图片加载完成
    await new Promise((resolve) => {
        img.onload = () => resolve();
        img.src = reader.result;
    });

    // 计算等比例压缩后的尺寸
    const { width, height } = calculateAspectRatioFit(img.width, img.height, maxWidth, maxHeight);

    // 创建 Canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // 在 Canvas 上绘制图片
    ctx.drawImage(img, 0, 0, width, height);

    // 添加水印
    const watermarkText = 'Your watermark text';
    const padding = 10;
    const textHeightRatio = 0.03; // 文本高度与 Canvas 高度的比例

    // 计算文本高度
    const textHeight = canvas.height * textHeightRatio;

    // 计算字体大小
    const fontSize = Math.floor(textHeight * 0.8); // 根据文本高度调整字体大小
    ctx.font = `${fontSize}px Arial`;

    // 计算文本宽度
    const textWidth = ctx.measureText(watermarkText).width;

    // 在底部绘制半透明矩形
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height - textHeight, canvas.width, textHeight);

    // 绘制文本信息
    ctx.fillStyle = 'white';
    ctx.fillText(watermarkText, padding, canvas.height - padding - (textHeight - fontSize) / 2);

    // let compressedDataUrl = canvas.toDataURL('image/jpeg', 1)
    // console.log(compressedDataUrl)

    // 创建 Blob 对象
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

    // 创建新的文件对象
    const newFile = new File([blob], file.name, {
        type: blob.type,
        lastModified: Date.now(),
    });

    return newFile;
};

// 计算等比例压缩后的尺寸
const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    const width = srcWidth * ratio;
    const height = srcHeight * ratio;
    return { width, height };
};



// 上传拍照图片
const uploadCheckInATakePhotosImgs = async (files, imgType) => {

    let formData = new FormData()
    formData.append('system_id', sysID)
    formData.append('tszid', props.settingID)
    formData.append('TDH', props.orderNumber)
    formData.append('imgtype', imgType || '')
    formData.append('mx', props.detailsType !== '' ? '是' : '否')
    formData.append('fieldname', 'TP')
    formData.append('tablename', 'SBWZXXMX')
    formData.append('name', 'sbwzxx.aspx')
    // 获取所需上传的文件数据
    const setImg = async (file) => {

        // 设置上传时显示状态
        file.status = 'uploading'
        file.message = '上传中...'
        const newFile = await imageCompression(file.file, 1920, 1440)

        console.log(file.file.size / 1024)
        console.log(newFile.size / 1024)
        formData.append('Files', newFile)
    }
    if (files.length) {
        for (const file of files) {
            await setImg(file)
        }
    } else {
        await setImg(files)
    }

    try {
        const res = await request.uploadCheckInATakePhotosImgs(formData)
        const resImg = res.data.imgList
        showToast(res.message || '上传成功')

        // 设置上传后显示状态
        if (files.length) {
            files.forEach((file, index) => {
                file.name = resImg[index].src
                file.status = 'done'
            })
        } else {
            files.name = resImg[0].src
            files.status = 'done'
        }

    } catch (err) {
        console.log(err)

        if (files.length) {
            files.forEach(file => {
                file.status = 'failed'
                files.message = '上传失败'
            })
        } else {
            files.status = 'failed'
            files.message = '上传失败'
        }
    }
}

// 删除拍照图片
const delImplImg = async (url, type) => {
    console.log(url.name, type)
    const params = {
        dh: 'props.orderNumber',
        imgtype: type,
        server_filename: url.name
    }
    try {
        const res = await request.delCheckInATakePhotosImgs(params)
        // 根据url, type匹配执行删除
        for (let i = 0; i < fileList.value.length; i++) {
            if (fileList.value[i].type === type) {
                const srclist = fileList.value[i].srclist
                const index = srclist.findIndex((item) => item === url)
                if (index !== -1) {
                    srclist.splice(index, 1)
                    break // 如果只需要删除第一个匹配项，可以注释掉此行
                }
            }
        }
        showToast(res.message || '删除成功')
    } catch (err) {
        console.log(err)
    }
}

// 删除拍照图片组
const delImgCard = (imgType) => {

    const beforeClose = (action) =>
        new Promise((resolve) => {
            if (action === 'confirm') {
                request.delImgCard({ dh: 'props.orderNumber', imgtype: imgType })
                    .then((res) => {
                        fileList.value = fileList.value.filter(item => item.type !== imgType)
                        showToast(res.message || '删除成功')
                        resolve(true)
                    })
                    .catch(err => {
                        console.error(err)
                        // 发生错误时也拦截取消操作
                        resolve(false)
                    })
            } else {
                // 拦截取消操作
                resolve(true)
            }
        })

    showConfirmDialog({
        title: `删除提示`,
        message: `确认删除<b class="txt-primary">${imgType}</b>的图片吗？`,
        allowHtml: true,
        beforeClose,
    }).catch(() => {
        // on cancel
    })
}



const clientInfo = ref({}) // 客户信息
const customForm = ref([]) // 自定义表单
// 获取页面数据
const getCheckInATakePhotosData = async () => {
    isLoading.value = true
    const params = {
        tszid: props.settingID,
        Tdh: props.orderNumber,
        Tkhbm: props.clientNumber,
        tlx: props.type,
        tmxlx: props.detailsType,
        twxqid: '',
        flag: 1,
    }
    try {
        const res = await request.getCheckInATakePhotosData(params)
        clientInfo.value = {
            name: res.data.KHMC,
            tel: res.data.LXDH,
            address: res.data.SHDD,
            dept: res.data.BM,
            asso: res.data.DGY,
            assoTel: res.data.DGYDH,
        }
        customForm.value = res.data.editorList.map(item => {
            // 转换自定义表单数据为所需形式
            return {
                key: item.id,
                label: item.name,
                value: ''
            }
        })
        typeList.value = res.data.typeData

    } catch (err) {
        console.log(err)
    }
    isLoading.value = false
}
getCheckInATakePhotosData()



// 确认完成
const inputRemark = ref('') // 备注
const confirmCheckInATakePhotosData = async () => {
    if (!!!fileList.value) {
        showToast('请拍照上传')
        return
    }

    // 移除图片数据的srclist
    const imgInfo = []
    for (let i = 0; i < fileList.value.length; i++) {
        imgInfo[i] = {
            remarks: fileList.value[i].remark,
            signtype: fileList.value[i].type
        }
    }

    const customInfo = []
    for (let i = 0; i < customForm.value.length; i++) {
        imgInfo[i] = {
            id: customForm.value[i].key,
            value: customForm.value[i].value
        }
    }
    
    const params = {
        tszid: props.settingID,
        Tdh: props.orderNumber,
        Tkhbm: props.clientNumber,
        tlx: props.type,
        tmxlx: props.detailsType,
        signtype: props.statusType,
        Tarr_img: imgInfo,
        editorList: customInfo,
        tbz: inputRemark.value,
        tsystemid: sysID,
        Tkhmc: clientInfo.value.name,
        tel: clientInfo.value.tel,
        TSHDD: clientInfo.value.address,
        dz: '',
        tjd: 0,
        twd: 0,
        tablename: props.detailsType == '' ? 'sbwzxx' : 'SBWZXXMX',
        twxqid: '',
        workers: []
    }


    const beforeClose = (action) =>
        new Promise((resolve) => {
            if (action === 'confirm') {

                request.confirmCheckInATakePhotosData(params)
                    .then((res) => {
                        showSuccessToast(res.message || '拍照已成功')
                        resolve(true)
                    })
                    .catch(err => {
                        showFailToast('确认失败，请重试')
                        console.log(err)
                        // 发生错误时也拦截取消操作
                        resolve(false)
                    })

            } else {
                // 拦截取消操作
                resolve(true)
            }
        })

    showConfirmDialog({
        title: `完成提示`,
        message: `完成后将不可修改，是否确认已完成？`,
        allowHtml: true,
        beforeClose,
    }).catch(() => {
        // on cancel
    })

}
</script>

<style lang="less" scoped>
.page-content {
    padding-bottom: calc(var(--van-tabbar-height) + constant(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
    padding-bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom) + var(--van-back-top-size) + var(--van-padding-sm));
}
.card-content>.card {
    filter: invert(.025);

    &:first-child {
        margin-top: 0;
    }
}

// :deep(.van-uploader) {

//     width: 100%;

//     .van-uploader__wrapper {
//         flex-flow: row;
//         // justify-content: start;
//         overflow-x: auto;
//         padding-bottom: 0;
//         padding-right: 1.75rem;
//         box-sizing: border-box;
//     }

//     .van-uploader__preview {
//         margin: 0 var(--van-padding-xs) 0 0;
//     }

//     .van-uploader__upload {
//         position: absolute;
//         right: 0;
//         margin: 0;
//         background: transparent;

//         &::before {
//             content: "";
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background: var(--van-gray-color-p60);
//             backdrop-filter: blur(10px);
//         }

//         .van-uploader__upload-icon {
//             color: var(--van-gray-6);
//         }
//     }
// }
:deep(.van-uploader__wrapper) {

    .van-uploader__upload,
    .van-uploader__preview:nth-child(4n) {
        margin-right: 0;
    }

    .van-uploader__preview,
    .van-uploader__upload {
        border-radius: var(--van-radius-md);
        overflow: hidden;
    }
}

.van-steps+.page-content {
    padding-top: 60px;
}

.van-grid-item {
    height: 1.25rem;
}

.tag-select {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    text-align: center;
    word-break: break-all;

    .selected-icon {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 0 var(--van-padding-base)var(--van-padding-base);
        display: inline-block;
        color: var(--van-white);
        background-color: var(--van-primary-color);
        border-radius: 0 0 0 2em;
        opacity: 0;
        transform: scale(.7);
        transform-origin: top right;
    }

    &.selected {
        color: var(--van-primary-color);
        font-weight: 700;

        .selected-icon {
            opacity: 1;
        }
    }
}

.card-tag {
    position: absolute;
    top: 0;
    left: 0;
}

.brd-dash {
    border: 1px dashed var(--van-gray-4);
}

.p-b-40p {
    padding-bottom: 40%;
}
</style>
