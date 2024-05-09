<template>
  <div style="padding: 30px">
    <el-form
      :model="ChartForm"
      ref="ChartForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="6"
        >
          <div class="grid-content bg-purple">
            <el-form-item label="图表名称" prop="name">
              <el-input v-model="ChartForm.name"></el-input>
            </el-form-item>
            <el-form-item label="分析目标" prop="goal">
              <el-input type="textarea" v-model="ChartForm.goal"></el-input>
            </el-form-item>
            <el-form-item label="图表类型" prop="chartType">
              <el-select
                v-model="ChartForm.chartType"
                placeholder="请选择图表类型"
              >
                <el-option label="折线图" value="折线图"></el-option>
                <el-option label="柱状图" value="柱状图"></el-option>
                <el-option label="饼图" value="饼图"></el-option>
                <el-option label="雷达图" value="雷达图"></el-option>
                <el-option label="散点图" value="散点图"></el-option>
                <el-option label="k线图" value="k线图"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传数据" prop="uploadFile">
              <el-upload
                class="upload-demo"
                action=""
                drag
                multiple
                :on-change="handleChange"
                :file-list="ChartForm.uploadFile"
                :auto-upload="false"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                  <div class="el-upload__tip" slot="tip">
                    只能上传xlsx文件，大小尽量不超过500kb
                  </div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getResultByAI()" :disabled="disabled" :loading="loading"
              >生成
              </el-button
              >
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </div>
        </el-col
        >
        <el-col :span="6"
        >
          <div class="grid-content bg-purple">
            <el-form-item label="生成结论" prop="genResult">
              <el-input
                type="textarea"
                v-model="AiResult.genResult"
                autosize
                readonly
                placeholder="AI生成的结论仅供参考"
              ></el-input>
            </el-form-item>
            <el-form-item label="生成的图表" prop="genChart" class="chart-table">
              <div id="main" style="width: 100%; height: 270px"/>
              <div v-if="isRunning" class="table-loading-running">
                <img src="/R.gif" alt="加载中..." style="width: 30%">
              </div>
            </el-form-item>
          </div
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>


<script>
import { genChart } from '@/api/chart'
import { genChartByAI } from '@/api/chart'

/**
 * {
 *           "title": {
 *             "text": "图表示例"
 *           },
 *           "xAxis": {
 *             "data": [
 *               "衬衫",
 *               "羊毛衫",
 *               "雪纺衫",
 *               "裤子",
 *               "高跟鞋",
 *               "袜子"
 *             ]
 *           },
 *           "yAxis": {},
 *           "series": [
 *             {
 *               "name": "销量",
 *               "type": "bar",
 *               "data": [
 *                 5,
 *                 20,
 *                 36,
 *                 10,
 *                 10,
 *                 20
 *               ]
 *             }
 *           ]
 *         }
 */
export default {
  data() {
    return {
      disabled: false,
      loading: false,
      isRunning: false,
      ChartForm: {
        name: '',
        goal: '',
        chartType: '',
        uploadFile: []
      },
      AiResult: {
        genResult: '',
        genChart: ``
      }
    }
  },
  mounted() {
    this.initChart()
    this.$set(this.AiResult, 'genChart', this.AiResult.genChart) // 将genChart转换为响应式属性
  },
  // 第一种 watch options变化 利用vue的深度 watcher，options 一有变化就重新setOption
  watch: {
    // genChart(newVal) {
    //   this.myChart.setOption(newVal);
    // },
    'AiResult.genChart': {
      deep: true,
      handler(newOption, oldOption) {
        console.log('newOption=', newOption)
        console.log('oldOption=', oldOption)
        this.myChart.setOption(newOption)
        console.log('chart option was updated')
      }
    }
  },
  methods: {
    initChart() {
      // var echarts = require("echarts");
      // 这样是全局引入，通过require也可以按需引入，但是不够清晰
      // 初始化echarts实例
      var mainChart = document.getElementById('main')
      this.myChart = this.$echarts.init(mainChart)
      // this.myChart.setOption(JSON.parse(this.AiResult.genChart))
    },

    handleChange(file, fileList) {
      this.ChartForm.uploadFile = fileList
      // console.log(fileList)
    },
    submitForm() {
      console.log(this.ChartForm)
      console.log(this.ChartForm.uploadFile)
      genChart(this.ChartForm)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getResultByAI() {
      this.loading = true
      this.disabled = true
      this.isRunning = true
      this.AiResult.genResult=''
      this.myChart.setOption({})
      genChartByAI(this.ChartForm)
        .then((response) => {
          this.isRunning = false
          this.AiResult.genChart = JSON.parse(response.data.genChart)
          this.AiResult.genResult = response.data.genResult;
          this.disabled=false
          this.loading=false
        })
        .catch((error) => {
          this.isRunning = false
          this.disabled = false
          this.loading = false
          console.log(error)
        })
    },

    resetForm() {
      this.$nextTick(() => {
        this.$refs['ChartForm'].resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.chart-table{
  position: relative;
  .table-loading-running{
   position: absolute;
    top: 50px;
    text-align: center;
  }

}

.el-upload-dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 360px;
  height: 220px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.el-col-6 {
  width: 50%;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple[data-v-d8ccf2d2] {
  background: #fff;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
