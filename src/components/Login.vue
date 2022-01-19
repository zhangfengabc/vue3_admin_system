<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="Username" prop="username">
      <el-input
        v-model="ruleForm.username"
        type="text"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="pass">
      <el-input
        v-model="ruleForm.pass"
        type="password"
        autocomplete="off"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import axios from '../utils/axios.js'
import md5 from 'js-md5'
import { ref, reactive, defineComponent } from 'vue'
import type { ElForm } from 'element-plus'
import { localSet } from '@/utils/index.js'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup () {
    const ruleFormRef = ref<InstanceType<typeof ElForm>>()
    const validateUsername = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('Please input the username'))
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
    const ruleForm = reactive({
      pass: '',
      username: ''
    })
    const rules = reactive({
      pass: [{ validator: validatePass, trigger: 'blur' }],
      username: [{ validator: validateUsername, trigger: 'blur' }]
    })
    const router = useRouter()
    const resetForm = () => {
      console.log('')
    }
    const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          axios.post('/adminUser/login', {
            userName: ruleForm.username,
            passwordMd5: md5(ruleForm.pass)
          }).then(res => {
            localSet('token', res)
            // router.push('/introduce')
            window.location.href = '/'
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
    return {
      ruleFormRef,
      ruleForm,
      rules,
      resetForm,
      submitForm
    }
  }
})
</script>
