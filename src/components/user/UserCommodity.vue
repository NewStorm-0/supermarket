<script setup>
import {inject, ref} from "vue";
import {ElMessage} from "element-plus";
import {Search} from '@element-plus/icons-vue'

defineExpose({
  name: "UserCommodity"
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

const searchInput = ref(null)

function search() {
  if (searchInput.value === '') {
    showList.value = commoditiesList.value
  }
  showList.value = commoditiesList.value.filter(function (commodity) {
    return commodity.name.indexOf(searchInput.value) !== -1
        || commodity.id === parseInt(searchInput.value)
  })
}
</script>

<template>
  <div class="top-content"><h1>商品一览</h1></div>
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
              header-align="center"
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
    </el-table>
  </div>
</template>

<style scoped>
.commodity-table {
  max-width: 600px;
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
</style>