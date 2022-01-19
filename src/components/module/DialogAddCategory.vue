<template>
  <el-dialog
    v-model="dialogVisible"
    title="修改分类"
    width="30%"
    :close="handleClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类名称" prop="pass">
        <el-input
          v-model="ruleForm.pass"
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="order">
        <el-input
          v-model="ruleForm.order"
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import { hasEmoji } from '@/utils/index'
import { useRoute } from 'vue-router'
export default defineComponent({
  props: {
    type: String,
    reload: Function
  },
  setup (props) {
    const state = reactive({
      dialogVisible: false,
      ruleForm: {
        pass: '',
        order: ''
      },
      parentId: 0,
      categoryLevel: 1
    })
    const ruleFormRef = ref(null)
    const close = () => {
      state.dialogVisible = false
    }
    const handleClose = () => {
      (ruleFormRef.value as any).resetFields()
    }
    const checkAge = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error('Please input the age'))
      } else {
        callback()
      }
    }

    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        callback()
      }
    }

    const rules = reactive({
      pass: [{ validator: validatePass, trigger: 'blur', required: true }],
      order: [{ validator: checkAge, trigger: 'blur', required: true }]
    })
    const getDetail = (id) => {
      axios.get(`/categories/${id}`).then(res => {
        state.ruleForm = {
          pass: res.categoryName,
          order: res.categoryRank
        }
        state.parentId = Number(res.parentId)
        state.categoryLevel = Number(res.categoryLevel)
      })
    }
    const route = useRoute()
    const open = (id) => {
      state.dialogVisible = true
      if (id) {
        getDetail(id)
      } else {
        const { level = 1, parentId = 0 } = route.query
        state.ruleForm = {
          pass: '',
          order: ''
        }
        state.categoryLevel = Number(level)
        state.parentId = Number(parentId)
      }
    }
    const submitForm = () => {
      (ruleFormRef.value as any).validate(valid => {
        if (valid) {
          if (hasEmoji(state.ruleForm.pass)) {
            ElMessage.error('不能输入标签包')
            return
          } else if (state.ruleForm.pass.length > 16) {
            ElMessage.error('名称不能超过16个字符')
            return
          } else if (state.ruleForm.order.length > 200) {
            ElMessage.error('排序不能超过200')
            return
          }
          if (props.type === 'add') {
            axios.post('/categories', {
              categoryLevel: state.categoryLevel,
              parentId: state.parentId,
              categoryName: state.ruleForm.pass,
              categoryRank: state.ruleForm.order
            }).then(() => {
              ElMessage.success('添加成功')
              state.dialogVisible = false
              if (props.reload) {
                // props.reload()
              }
            })
          } else {
            axios.post('/categories', {
              categoryLevel: state.categoryLevel,
              parentId: state.parentId,
              categoryName: state.ruleForm.pass,
              categoryRank: state.ruleForm.order
            }).then(() => {
              ElMessage.success('修改成功')
              state.dialogVisible = false
              if (props.reload) {
                // props.reload()
              }
            })
          }
        }
      })
    }
    return {
      ...toRefs(state),
      handleClose,
      open,
      close,
      rules,
      ruleFormRef,
      submitForm
    }
  }
})
</script>
