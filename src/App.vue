<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <el-container v-if="showMenu" class="container">
    <el-aside width="200px" class="aside">
      <div class="head">
        <div>
          <span>admin system</span>
        </div>
      </div>
      <div class="line" />
      <!--  -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        :router="true"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Dashbord</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/introduce">系统介绍</el-menu-item>
            <el-menu-item index="/dashbord">Dashbord</el-menu-item>
            <el-menu-item index="/add">添加商品</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>首页配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">系统介绍</el-menu-item>
            <el-menu-item index="2-2">Dashbord</el-menu-item>
            <el-menu-item index="2-3">添加商品</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><document /></el-icon>
          <span>模块管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/category">分类管理</el-menu-item>
            <el-menu-item index="/good">商品管理</el-menu-item>
            <el-menu-item index="3-3">会员管理</el-menu-item>
            <el-menu-item index="/order">订单管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon><setting /></el-icon>
          <span>系统管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">修改密码</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
      <!--  -->
    </el-aside>
    <el-container class="content">
      <Header/>
      <el-main><router-view/></el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
  <div v-else class="container">
    <router-view/>
  </div>
</template>
<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from 'vue'
import Header from './components/Header.vue'
import { useRouter } from 'vue-router'
import { localGet } from '@/utils/index'
export default defineComponent({
  setup () {
    const state = reactive({
      showMenu: false
    })
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const router = useRouter()
    const unwatch = router.beforeEach((to, from, next) => {
      if (to.path === '/login') {
        next()
      } else {
        if (!localGet('token')) {
          next({ path: '/login' })
        } else {
          state.showMenu = true
          next()
        }
      }
      (document.title as any) = to.name
    })
    onUnmounted(() => {
      unwatch()
    })
    return {
      handleOpen,
      handleClose,
      ...toRefs(state)
    }
  },
  components: {
    Header
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
* {
  padding: 0;
  margin: 0;
}
html, body, #app {
  height: 100%;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.layout {
    min-height: 100vh;
    background-color: #ffffff;
  }
  .container {
    height: 100vh;
  }
  .aside {
    width: 200px!important;
    background-color: #222832;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .aside::-webkit-scrollbar {
    display: none;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
  .head > div {
    display: flex;
    align-items: center;
  }

  .head img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  .head span {
    font-size: 20px;
    color: #ffffff;
  }
  .line {
    border-top: 1px solid hsla(0,0%,100%,.05);
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  .content {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
  }
  .main {
    height: calc(100vh - 100px);
    overflow: auto;
    padding: 10px;
  }
</style>
<style>
  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .el-menu {
    border-right: none!important;
  }
  .el-submenu {
    border-top: 1px solid hsla(0, 0%, 100%, .05);
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .el-submenu:first-child {
    border-top: none;
  }
  .el-submenu [class^="el-icon-"] {
    vertical-align: -1px!important;
  }
  a {
    color: #409eff;
    text-decoration: none;
  }
  .el-pagination {
    text-align: center;
    margin-top: 20px;
  }
  .el-popper__arrow {
    display: none;
  }
</style>
