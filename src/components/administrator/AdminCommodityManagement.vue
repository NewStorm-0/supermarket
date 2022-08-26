<script setup>
import {inject, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search} from '@element-plus/icons-vue';
import axios2 from "../../utils/request2";

defineExpose({
  name: "AdminCommodityManagement"
})

const axios = inject('axios')
const commoditiesList = ref([])
const showList = ref([])
const loading = ref(true)
axios.get('/commodity/all')
    .then((response) => {
      if (response.state === 0) {
        commoditiesList.value = response.data
        showList.value = commoditiesList.value
        loading.value = false
      } else {
        ElMessage.error(response.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })

function priceFormatter(row) {
  return row.price.toFixed(2)
}

const searchInput = ref('')

function search() {
  if (searchInput.value === '') {
    showList.value = commoditiesList.value
  }
  showList.value = commoditiesList.value.filter(function (commodity) {
    return commodity.name.indexOf(searchInput.value) !== -1
        || commodity.id === parseInt(searchInput.value)
  })
}

const addCommodityRuleFormRef = ref()
const addCommodityData = ref({
  id: null,
  name: null,
  price: null
})
const addCommodityVisible = ref(false)

function addCommodity() {
  addCommodityData.value.name = ''
  addCommodityData.value.price = 0.00
  addCommodityVisible.value = true
}

async function submitAddCommodity(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      axios2.post('/commodity/add', {
        id: null,
        name: addCommodityData.value.name,
        price: addCommodityData.value.price
      }, (data) => {
        commoditiesList.value.push({
          id: data,
          name: addCommodityData.value.name,
          price: addCommodityData.value.price
        })
        search()
        ElMessage.success('添加商品成功')
      })
      addCommodityVisible.value = false
    } else {
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
    }
  })
}

const changeCommodityRuleFormRef = ref()
const changeCommodityVisible = ref(false)
const changeCommodityData = ref({
  id: null,
  name: null,
  price: null
})

function changeCommodity(id) {
  changeCommodityData.value.id = id
  for (const commodity of commoditiesList.value) {
    if (commodity.id === id) {
      changeCommodityData.value.name = commodity.name
      changeCommodityData.value.price = commodity.price
      break
    }
  }
  changeCommodityVisible.value = true
}

async function submitChangeCommodity(formEl) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      axios2.post('/commodity/change', changeCommodityData.value, () => {
        for (const commodity of commoditiesList.value) {
          if (commodity.id === changeCommodityData.value.id) {
            commodity.name = changeCommodityData.value.name
            commodity.price = changeCommodityData.value.price
            break
          }
        }
        search()
        ElMessage.success('修改成功')
      })
      changeCommodityVisible.value = false
    } else {
      ElMessage({
        showClose: true,
        message: '输入的信息不符合要求',
        type: 'error'
      })
    }
  })
}

const rules = ref({
  name: [
    {
      required: true,
      message: '请输入商品名称',
      trigger: 'blur',
    },
  ],
  price: [
    {
      required: true,
      message: '请输入商品价格',
      trigger: 'blur'
    },
  ]
})

function deleteCommodity(id) {
  ElMessageBox.confirm(
      '确认删除该商品？',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    axios2.get('/commodity/delete', {
      params: {
        commodityId: id
      }
    }, () => {
      for (let i = 0; i < commoditiesList.value.length; i++) {
        if (commoditiesList.value[i].id === id) {
          commoditiesList.value.splice(i, 1)
          break
        }
      }
      search()
      ElMessage.success('删除成功')
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}
</script>

<template>
  <div class="top-content">
    <el-button type="primary" @click="addCommodity" size="large" class="my-button">
      添加商品
    </el-button>
    <h1>商品一览</h1>
  </div>
  <div style="text-align: center; max-width: 600px; margin: auto">
    <el-input
        v-model="searchInput"
        class="search"
        placeholder="输入商品名称或id"
        :prefix-icon="Search"
        @input="search"
    />
    <span/>
    <el-table :data="showList"
              class="commodity-table"
              v-loading="loading"
              max-height="calc(60vh - 2rem)"
              highlight-current-row
              stripe
              lazy
    >
      <!-- 上行这里应该有一个函数，传入UserId -->
      <el-table-column prop="id" label="商品号"/>
      <el-table-column prop="name" label="名称" align="center"/>
      <el-table-column prop="price" label="原价" align="center"
                       sortable :formatter="priceFormatter"/>
      <el-table-column prop="id" label="操作" width="160" align="center">
        <template v-slot:default="info">
          <el-button text type="primary" @click="changeCommodity(info.row.id)">
            编辑
          </el-button>
          <el-button text type="danger" @click="deleteCommodity(info.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="addCommodityVisible" center :modal="true"
             title="输入商品信息" width="300px">
    <el-form :model="addCommodityData"
             label-position="right"
             label-width="80px"
             :rules="rules"
             ref="addCommodityRuleFormRef"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="addCommodityData.name"/>
      </el-form-item>
      <el-form-item label="原价" prop="price">
        <el-input-number v-model="addCommodityData.price" :min="0" :precision="2"/>
      </el-form-item>
      <el-form-item>
        <div style="width: 20px"/>
        <el-button type="primary" @click="submitAddCommodity(addCommodityRuleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="changeCommodityVisible" center :modal="true"
             title="输入商品信息" width="300px">
    <el-form :model="changeCommodityData"
             label-position="right"
             label-width="80px"
             :rules="rules"
             ref="changeCommodityRuleFormRef"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="changeCommodityData.name"/>
      </el-form-item>
      <el-form-item label="原价" prop="price">
        <el-input-number v-model="changeCommodityData.price" :min="0" :precision="2"/>
      </el-form-item>
      <el-form-item>
        <div style="width: 20px"/>
        <el-button type="primary" @click="submitChangeCommodity(changeCommodityRuleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.commodity-table {
  max-width: 760px;
  margin: auto;
}

div.top-content {
  margin: auto;
  text-align: center;
}

.search {
  min-width: 100px;
  max-width: 200px;
  margin-bottom: 10px;
  float: left;
}

.my-button {
  float: left;
  margin-left: 12px;
  margin-right: -800px;
}
</style>