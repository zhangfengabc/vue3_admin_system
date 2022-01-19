<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>+</span>
        <el-button class="button" type="text" @click="handleAdd">新增商品</el-button>
      </div>
    </template>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="goodsId" label="商品编号" width="120" />
      <el-table-column property="goodsName" label="商品名" width="120" />
      <el-table-column property="goodsIntro" label="商品简介" width="120" />
      <el-table-column label="商品图片" width="120">
        <template #default="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.goodsCoverImg" fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column property="stockNum" label="商品库存" width="120" />
      <el-table-column property="sellingPrice" label="商品售价" width="120" />
      <el-table-column label="上架状态" width="120">
        <template #default="scope">
          <span style="color: green;" v-if="scope.row.goodsSellStatus == 0">销售中</span>
          <span style="color: red;" v-else>已下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row.goodsId)">修改</el-button>
          <el-button type="text" size="small" v-if="scope.row.goodsSellStatus" @click="handleStatus(scope.row.goodsId, 0)">上架</el-button>
          <el-button type="text" size="small" v-else @click="handleStatus(scope.row.goodsId, 1)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" 
      :total="totalCount"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])"
        >Toggle selection status of second and third rows</el-button
      >
      <el-button @click="toggleSelection()">Clear selection</el-button>
    </div>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, toRefs } from 'vue'
import { ref, reactive } from 'vue'
import type { ElTable } from 'element-plus'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
interface User {
  date: string
  name: string
  address: string
}
export default defineComponent({
  setup () {
    const router = useRouter()
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const multipleSelection = ref<User[]>([])
    const toggleSelection = (rows?: User[]) => {
      if (rows) {
        rows.forEach((row) => {
          multipleTableRef.value!.toggleRowSelection(row, undefined)
        })
      } else {
        multipleTableRef.value!.clearSelection()
      }
    }
    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }
    const state = reactive({
      currentPage: 1,
      pageSize: 10,
      totalCount: '',
      totalPage: '',
      tableData: []
    })
    const getGoodsList = () => {
      axios.get('/goods/list', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.tableData = res.list
        state.currentPage = res.currPage
        state.pageSize = res.pageSize
        state.totalCount = res.totalCount
        state.totalPage = res.totalPage
      })
    }
    onMounted(() => {
      getGoodsList()
    })
    const changePage = (num) => {
      state.currentPage  = num
      getGoodsList()
    }
    const handleStatus = (id, status) => {
      axios.put(`/goods/status/${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getGoodsList()
      })
    }
    const handleAdd = () => {
      router.push('/add')
    }
    const handleEdit = (id) => {
      router.push({ path: '/add', query: { id } })
    }
    return {
      ...toRefs(state),
      multipleSelection,
      toggleSelection,
      handleSelectionChange,
      changePage,
      handleStatus,
      handleAdd,
      handleEdit
    }
  }
})
</script>
