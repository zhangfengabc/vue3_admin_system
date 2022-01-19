<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{num}}</p>
    <div>{{name}}---{{age}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch, watchEffect } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup () {
    const num = ref(0)
    const state = reactive({
      name: '张三',
      age: 18
    })
    setTimeout(() => {
      num.value++
      state.age++
    }, 1000)
    // 修改age值时会触发watch的回调
    // watch(
    //   () => state.age,
    //   (curAge, preAge) => {
    //     console.log('新值：', curAge, '老值:', preAge)
    //   }
    // )
    // const plusOne = computed(() => num.value + 1)
    // const plusOne = computed({
    //   get: () => num.value + 1,
    //   set: val => {
    //     num.value = val - 1
    //   }
    // })
    // const plusOne = computed(() => num.value + 1, {
    //   onTrack(e) {
    //     debugger
    //   },
    //   onTrigger(e) {
    //     debugger
    //   }
    // })
    // // plusOne.value = 1
    // console.log(plusOne.value) // 访问plusOne，触发onTrack
    num.value++ // 修改num.value, 触发onTrigger
    // onTrack和onTrigger仅在开发模式下生效
    // 1.监听ref定义的一个响应式数据
    const mg = ref('hello')
    setTimeout(() => {
      mg.value = 'world'
    }, 1000)
    watch(mg, (newMg, oldMg) => {
      console.log('变化', newMg, oldMg)
    }, { immediate: true })
    // 2.监听ref定义的多个响应式数据
    const as = ref('我是')
    watch([mg, as], (newVal, oldVal) => {
      console.log('变化', newVal, oldVal)
    }, { immediate: true })
    watchEffect(() => {
      console.log(num.value)
    })
    return {
      num,
      mg,
      ...toRefs(state)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
