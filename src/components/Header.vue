<template>
  <div>
    <i v-if="hasBack" class="el-icon-back" @click="back">back---></i>
    <span>{{name}}</span>
    <div class="right">
      <el-popover
        placement="bottom"
        trigger="click"
        popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <i class="icon el-icon-s-custom" />
            {{ userInfo && userInfo.nickName || '' }}
            <i class="el-icon-caret-bottom" />
          </div>
        </template>
        <div class="nickname">
          <p>登录名：{{ userInfo && userInfo.loginUserName || '' }}</p>
          <p>昵称：{{ userInfo && userInfo.nickName || '' }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pathMap, localRemove } from '@/utils/index'
import axios from '@/utils/axios'
export default defineComponent({
  setup () {
    const state = reactive({
      name: '',
      hasBack: false,
      userInfo: null
    })
    const router = useRouter()
    router.afterEach(to => {
      state.hasBack = ['level2', 'level3'].includes(to.name as string)
      state.name = pathMap[to.name]
    })
    const back = () => {
      router.back()
    }
    onMounted(() => {
      const pathname = window.location.hash.split('/')[1] || ''
      console.log(pathname)
      if (pathname !== 'login') {
        getUserInfo()
      }
    })
    const getUserInfo = async () => {
      const userInfo = await axios.get('/adminUser/profile')
      state.userInfo = userInfo
    }
    const logout = () => {
      axios.delete('/logout').then(() => {
        localRemove('token')
        window.location.reload()
      })
    }
    return {
      ...toRefs(state),
      back,
      logout
    }
  }
})
</script>
<style>
  .popper-user-box {
    background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat!important;
    background-size: cover!important;
    border-radius: 0!important;
  }
  .popper-user-box .nickname {
    position: relative;
    color: #ffffff;
  }
  .popper-user-box .nickname .logout {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
</style>
