<template>
  <div class="app-container">
    <!-- 图表列表 -->
    <el-row :gutter="20">
      <el-col :span="12" v-for="(record, index) in records" :key="record.id">
        <h3>{{ record.name }}</h3>
        <p>生成结果：{{ record.genResult }}</p>
        <!-- 使用动态 id 防止重复 -->
        <div :id="'main-' + index" style="width: 100%; height: 270px ;"></div>
        <el-tag type="info" class="chart-status">{{ record.status }}</el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listMyChart } from '@/api/chart'

export default {
  data() {
    return {
      records: [],
      current: 1,
      size: 10,
      total: '', // 总记录数
      ChartStatus: {
        WAITING: { value: '正在等待中', text: 'waiting' },
        RUNNING: { value: '正在执行中', text: 'running' },
        SUCCESS: { value: '已完成', text: 'succeed' },
        FAILED: { value: '已失败', text: 'failed' }
      },
      chartStates: [] // 存储各个chart实例对应state
    }
  },
  mounted() {
    this.loadChartData().then(() => {
      this.renderChart()
    })
  },

  methods: {
    async loadChartData() {
      return new Promise((resolve, reject) => {
        listMyChart({ current: this.current, size: this.size })
          .then((response) => {
            console.log(response);
            this.records = response.data.records;
            console.log(this.records[0]);
            this.total = response.data.total;
            console.log("总共条数：" + this.total);
            resolve(); //!
          })
          .catch((error) => {
            console.log("请求方法内捕获：" + error);
          });
      }).catch((error) => {
        console.error("异步操作内捕获：" + error);
        reject(error); // 异步操作失败，执行 reject()
      });
    },
    renderChart() {
      for (let i = 0; i < this.records.length; i++) {
        const chartContainer = document.getElementById("main-" + i);

        if (!chartContainer) {
          console.log("没有获取到容器元素");
          continue;
        }
        const status = this.records[i].status;
        if (status === this.ChartStatus.SUCCESS.text) {
          const chart = this.$echarts.init(chartContainer);
          // 设置图表的 option
          console.log("@@",status)
          chart.setOption(JSON.parse(this.records[i].genChart));
        } else if (status === this.ChartStatus.FAILED.text) {
          console.log("@@",status)
          chartContainer.textContent = "图表生成失败了，抱歉";
          chartContainer.style.color = "red";
        } else{
          //在等待中或者是在排队中
          console.log("@@",status)
          chartContainer.textContent = "图表正在生成中，请稍后刷新页面";
          chartContainer.style.color = "green";
        }
      }
    },
  },
};
</script>
<style lang="css" scoped>
.failed-text {
  background-color: red;
  font-size: 20px;
}
</style>
