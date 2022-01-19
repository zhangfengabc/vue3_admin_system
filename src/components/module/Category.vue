<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button class="button" type="text" @click="handleAdd">添加</el-button>
        <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete">
        <template #reference>
          <el-button>Delete</el-button>
        </template>
      </el-popconfirm>
      </div>
    </template>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="categoryName" label="分类名称" width="120" />
      <el-table-column property="categoryRank" label="排序值" show-overflow-tooltip />
      <el-table-column label="添加时间" width="120">
        <template #default="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row.categoryId)">Edit</el-button>
          <el-button type="text" size="small" @click="handleNext(scope.row)"
            >下级分类</el-button
          >
          <el-popconfirm title="确定删除吗？" @confirm="handleClickOne(scope.row.category)">
            <template #reference>
              <el-button>Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([tableData[1], tableData[2]])"
        >Toggle selection status of second and third rows</el-button
      >
      <el-button @click="toggleSelection()">Clear selection</el-button>
    </div>
    <el-pagination background layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    >
    </el-pagination>
  </el-card>
  <dialog-add-category ref="addGoods" :type="type" :reload="getCategory"></dialog-add-category>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, onMounted, toRefs, onUnmounted } from 'vue'
import type { ElTable } from 'element-plus'
import axios from '../../utils/axios'
import DialogAddCategory from './DialogAddCategory.vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import router from '@/router'

interface User {
  date: string
  name: string
  address: string
}
export default defineComponent({
  setup () {
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const toggleSelection = (rows?: User[]) => {
      if (rows) {
        rows.forEach((row) => {
          multipleTableRef.value!.toggleRowSelection(row, undefined)
        })
      } else {
        multipleTableRef.value!.clearSelection()
      }
    }
    const route = useRoute()
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      level: 1,
      parentId: 0
    })
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
      console.log(state.multipleSelection)
    }
    // const tableData: User[] = []
    const deleteRow = (index: number) => {
      state.tableData.splice(index, 1)
    }
    const addGoods = ref(null)
    const handleEdit = (id) => {
      state.type = 'edit';
      (addGoods.value as any).open(id)
    }
    const handleNext = (item) => {
      const levelNumber = item.categoryLevel + 1
      if (levelNumber === 4) {
        ElMessage.error('没有下一级了')
        return
      }
      router.push({
        name: `level${levelNumber}`,
        query: {
          level: levelNumber,
          parentId: item.categoryId
        }
      })
    }
    onMounted(() => {
      getCategory()
    })
    // 获取分类列表
    const getCategory = () => {
      console.log(state.currentPage)
      state.loading = true
      const { level = 1, parentId = 0 } = route.query
      axios.get('/categories', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          categoryLevel: level,
          parentId: parentId
        }
      }).then(res => {
        console.log(res)
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        state.pageSize = res.pageSize
      })
    }
    const changePage = (num) => {
      console.log(num)
      state.currentPage = num
      getCategory()
    }
    const handleClickOne = (id) => {
      axios.delete('/categories', {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择')
        return
      }
      const ids = state.multipleSelection.map(i => i.categoryId)
      axios.delete('/categories', {
        data: {
          ids
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }
    const handleAdd = () => {
      state.type = 'add';
      (addGoods.value as any).open()
    }
    const unwatch = router.afterEach((to) => {
      if (['category', 'level2', 'level3'].includes(to.name as string)) {
        getCategory()
      }
    })
    onUnmounted(() => {
      unwatch()
    })
    return {
      ...toRefs(state),
      toggleSelection,
      multipleTableRef,
      handleSelectionChange,
      handleNext,
      deleteRow,
      addGoods,
      handleEdit,
      getCategory,
      changePage,
      handleClickOne,
      handleDelete,
      handleAdd
    }
  },
  components: {
    DialogAddCategory
  }
})
</script>
