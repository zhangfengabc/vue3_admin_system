<template>
  <el-form ref="formRef"
    :model="form"
    :rules="rules"
    label-width="100px">
    <el-form-item label="商品分类" required>
      <el-cascader :placeholder="defaultCate" style="width:300px" :props="props" @change="handleChangeCate"/>
    </el-form-item>
    <el-form-item label="商品名称" prop="goodsName">
      <el-input v-model="form.goodsName"></el-input>
    </el-form-item>
    <el-form-item label="商品简介" prop="goodsIntro">
      <el-input v-model="form.goodsIntro" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="originalPrice">
      <el-input v-model="form.originalPrice" type="number" min="0"></el-input>
    </el-form-item>
    <el-form-item label="商品售卖价" prop="originalPrice">
      <el-input v-model="form.sellingPrice" type="number" min="0"></el-input>
    </el-form-item>
    <el-form-item label="商品库存" prop="stockNum">
      <el-input v-model="form.stockNum" type="number" min="0"></el-input>
    </el-form-item>
    <el-form-item label="商品标签" prop="tag">
      <el-input v-model="form.tag"></el-input>
    </el-form-item>
    <el-form-item label="上架状态" prop="goodsSellStatus">
      <el-radio-group v-model="form.goodsSellStatus">
        <el-radio label="0">上架</el-radio>
        <el-radio label="1">下架</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="商品主图" prop="goodsCoverImg">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="form.goodsCoverImg" :src="form.goodsCoverImg" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import { useRouter, useRoute } from 'vue-router'
import { prefix } from '@/utils/index'
import type {
  UploadFile,
  ElUploadProgressEvent,
  ElFile
} from 'element-plus/es/components/upload/src/upload.type'
export default defineComponent({
  components: {
    Plus
  },
  setup () {
    const { proxy } = getCurrentInstance()
    console.log(proxy)
    const router = useRouter()
    const route = useRoute()
    const { id } = route.query
    const props = {
      lazy: true,
      lazyLoad (node, resolve) {
        const { level = 0, value } = node
        axios.get('/categories', {
          params: {
            pageNumber: 1,
            pageSize: 1000,
            categoryLevel: level + 1,
            parentId: value || 0
          }
        }).then(res => {
          const list = res.list
          const nodes = list.map(item => ({
            value: item.categoryId,
            label: item.categoryName,
            leaf: level > 1
          }))
          resolve(nodes)
        })
      }
    }
    const state = reactive({
      defaultCate: '',
      form: {
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        tag: '',
        goodsSellStatus: '0',
        goodsCoverImg: '',
        categoryId: ''
      },
      rules: {
        goodsName: [{
          required: true, message: '请填写商品名称', trigger: 'change'
        }],
        originalPrice: [{
          required: true, message: '请填写商品价格', trigger: ['change']
        }],
        sellingPrice: [{
          required: 'true', message: '请填写商品售价', trigger: ['change']
        }],
        stockNum: [{
          required: 'true', message: '请填写商品库存', trigger: ['change']
        }],
        goodsCoverImg: [{
          required: 'true', message: '请上传主图', trigger: ['change']
        }]
      },
      props
    })
    const formRef = ref(null)
    const handleAvatarSuccess = (res: ElUploadProgressEvent, file: UploadFile) => {
      state.form.goodsCoverImg = URL.createObjectURL(file.raw)
    }
    const beforeAvatarUpload = (file: ElFile) => {
      // const isJPG = file.type === 'image/jpeg'
      const sufix = file.name.split('.')[1]
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传jpg、jpeg、png格式的图片!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
      }
    }
    onMounted(() => {
      if (id) {
        axios.get(`/goods/${id}`).then(res => {
          const {
            goods: { goodsName, goodsIntro, originalPrice, sellingPrice, stockNum, tag, goodsSellStatus, goodsCoverImg, goodsCategoryId }, firstCategory, secondCategory, thirdCategory
          } = res
          state.form = {
            goodsName,
            goodsIntro,
            originalPrice,
            sellingPrice,
            stockNum,
            tag,
            goodsSellStatus: goodsSellStatus.toString(),
            goodsCoverImg: prefix(goodsCoverImg),
            categoryId: goodsCategoryId
          }
          console.log(prefix(goodsCoverImg))
          state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
        })
      }
    })
    const onSubmit = () => {
      formRef.value.validate(valid => {
        if (valid) {
          const httpOption = axios.post
          const params = {
            goodsCategoryId: state.form.categoryId,
            goodsCoverImg: state.form.goodsCoverImg,
            goodsDetailContent: '详情',
            goodsIntro: state.form.goodsIntro,
            goodsName: state.form.goodsName,
            goodsSellStatus: state.form.goodsSellStatus,
            originalPrice: state.form.originalPrice,
            sellingPrice: state.form.sellingPrice,
            stockNum: state.form.stockNum,
            tag: state.form.tag
          }
          httpOption('/goods', params).then(() => {
            ElMessage.success('添加成功')
            router.push({ path: '/good' })
          })
        }
      })
    }
    const handleChangeCate = (val) => {
      state.form.categoryId = val[2] || ''
    }
    return {
      ...toRefs(state),
      handleAvatarSuccess,
      beforeAvatarUpload,
      onSubmit,
      formRef,
      handleChangeCate
    }
  }
})
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  margin-top: 30px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
