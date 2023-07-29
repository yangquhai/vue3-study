<!-- 图片上传 -->
<template>
    <div>
        <van-field v-model="selectedCategory" label="业务类别" readonly clickable placeholder="请选择业务类别"
            @click="showCategoryPicker = true" />

        <van-popup v-model:show="showCategoryPicker" position="bottom">
            <van-picker :columns="categories" @confirm="onCategoryConfirm"
                @cancel="showCategoryPicker = false" />
        </van-popup>

        <div v-for="(uploader, index) in uploaders" :key="index">
            <van-uploader :before-read="beforeRead" :after-read="afterRead" :max-count="10" :deletable="true"
                :preview-size="100" v-model="uploader.images">
                <!-- <template #default="{ item, index }">
                    <van-image fit="cover" :src="item.content" :round="false" :width="100" :height="100" />
                </template> -->
            </van-uploader>
            <van-button type="danger" @click="removeUploader(index)">删除</van-button>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
// import lrz from 'lrz'
const categories = [{ text: '类别1', value: '类别1' }, { text: '类别2', value: '类别2' }, { text: '类别3', value: '类别3' }]
const selectedCategory = ref('')
const showCategoryPicker = ref(false)
const uploaders = ref([])

const onCategoryConfirm = ({ selectedOptions }) => {
    showCategoryPicker.value = false
    selectedCategory.value = selectedOptions[0]?.text

    if (!uploaders.value.some((uploader) => uploader.category === selectedCategory.value)) {
        uploaders.value.push({ category: selectedCategory.value, images: [] })
    }
}

const beforeRead = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        // this.$toast('请上传图片')
    }
    return isImage
}

const afterRead = async (file) => {
    // const result = await lrz(file.file, { quality: 0.8 })
    // file.content = result.base64
    // 在这里实现图片的即时自动上传
    // 例如： uploadImage(file.content)
}

const removeUploader = (index) => {
    uploaders.value.splice(index, 1)
}
</script>