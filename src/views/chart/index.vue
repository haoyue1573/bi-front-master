<template>
  <div class="app-container">
    <!-- 图表列表 -->
    <el-row :gutter="20">
      <el-col :span="12" v-for="(record, index) in records" :key="record.id">
        <h3>{{ record.name }}</h3>
        <p>生成结果：{{ record.genResult }}</p>
        <!-- 使用动态 id 防止重复 -->
        <div :id="'main-' + index" style="width: 100%; height: 270px"></div>
        <el-tag type="info" class="chart-status">{{ record.status }}</el-tag>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listMyChart } from "@/api/chart";

export default {
  data() {
    return {
      records: [],
      current: 1,
      size: 10,
      total: "", // 总记录数
      ChartStatus: {
        WAITING: { value: "正在等待中", text: "waiting" },
        RUNNING: { value: "正在执行中", text: "executing" },
        SUCCESS: { value: "已完成", text: "success" },
        FAILED: { value: "已失败", text: "failed" },
      },
      chartStates: [], // 存储各个chart实例对应state
    };
  },
  mounted() {
    this.loadChartData().then(() => {
      this.renderChart();
    });
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
        if (status === "wait") {
          const chart = this.$echarts.init(chartContainer);
          // 设置图表的 option
          chart.setOption(JSON.parse(this.records[i].genChart));
        } else if (status === "已失败") {
          chartContainer.textContent = "图表生成失败了，不建议参考";
        } else {
          //在等待中或者是在排队中
          chartContainer.textContent = "图表正在生成中，请稍后刷新页面";

          // 以下代码AI生成的
          // 清空容器内容以防止重复渲染
          // while (chartContainer.firstChild) {
          //   chartContainer.removeChild(chartContainer.firstChild);
          // }

          // const loadingDiv = document.createElement("div");
          // loadingDiv.classList.add("loading"); // 添加自定义样式类名用于展示加载动画效果

          // const spinnerIcon = document.createElement("i");
          // spinnerIcon.classList.add("el-icon-loading");

          // loadingDiv.appendChild(spinnerIcon);

          // setTimeout(() => {
          //   while (chartContainer.hasChildNodes()) {
          //     //清除子元素节点,避免多次点击时出现叠加问题。
          //     console.log(1);
          //     var childNode = document.getElementById(id).firstChild;
          //     id.removeChild(childNode);
          //   }
          // }, 1000);
        }
      }
    },
  },
};
</script>
