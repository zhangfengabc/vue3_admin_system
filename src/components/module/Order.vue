<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-input v-model="orderNo" style="width:200px;margin-right: 20px;" placeholder="Please input" clearable @change="handleSearch" />
        <el-select v-model="orderStatus" class="m-2" placeholder="Select" @change="handleSearch"  style="width:200px;margin-right: 20px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary">配货完成</el-button>
        <el-button type="primary">出库</el-button>
        <el-button type="primary">关闭订单</el-button>
      </div>
    </template>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="orderNo" label="订单号" width="120" />
      <el-table-column property="totalPrice" label="订单总价" width="120" />
      <el-table-column label="订单状态" width="120">
        <template #default="scope">
          <span>{{orderStatusMap[scope.row.orderStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="120">
        <template #default="scope">
          <span>{{ payType(scope.row.payStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="120">
        <template #default="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column property="操作" label="Name" width="120">
        <template #default="scope">
          <el-popconfirm title="确定关闭订单吗？">
            <template #reference>
              <el-button>关闭订单</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="handleDetail(scope.row.orderId)">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next"
      :total="1000"
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
import { defineComponent, onMounted, ref, toRefs, reactive } from 'vue'
import type { ElTable } from 'element-plus'
import axios from '@/utils/axios'
import { orderStatusMap } from '@/utils/index'
import { useRouter } from 'vue-router'
interface User {
  date: string
  name: string
  address: string
}
export default defineComponent({
  setup () {
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const multipleSelection = ref<User[]>([])
    const router = useRouter()
    const state = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0,
      orderNo: '',
      orderStatus: '',
      tableData: [],
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '待支付'
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '配货完成'
      }, {
        value: 3,
        label: '出库成功'
      }, {
        value: 4,
        label: '交易成功'
      }, {
        value: -1,
        label: '手动关闭'
      }, {
        value: -2,
        label: '超时关闭'
      }, {
        value: -3,
        label: '商家关闭'
      }]
    })
    const toggleSelection = (rows?: User[]) => {
      if (rows) {
        rows.forEach((row) => {
          multipleTableRef.value!.toggleRowSelection(row, undefined)
        })
      } else {
        multipleTableRef.value!.clearSelection()
      }
    }
    const handleSelectionChange = (val: User[]) => {
      multipleSelection.value = val
    }

    const getOrderList = () => {
      axios.get('/orders', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          orderNo: state.orderNo,
          orderStatus: state.orderStatus
        }
      }).then(res => {
        state.tableData = res.list
      })
    }
    onMounted(() => {
      getOrderList()
    })
    const changePage = (val) => {
      state.currentPage = val
      getOrderList()
    }
    const payType = (num) => {
      return ['未支付', '微信支付', '支付宝支付'][num]
    }
    const handleSearch = () => {
      console.log('state.orderStatus:', state.orderStatus)
      state.currentPage = 1
      getOrderList()
    }
    const handleDetail = (id) => {
      router.push({ path: 'order_detail', query: { id } })
    }
    return {
      ...toRefs(state),
      multipleTableRef,
      multipleSelection,
      toggleSelection,
      handleSelectionChange,
      changePage,
      payType,
      orderStatusMap,
      handleSearch,
      handleDetail
    }
  }
})
</script>
