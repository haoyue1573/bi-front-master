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
          ><div class="grid-content bg-purple">
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
              <el-button
                 type="primary"
                 @click="genAsync()"
                 :disabled=disabled
                 :loading=loading
                 >生成</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </div></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { genAsync } from "@/api/chart";
import { Message } from 'element-ui'

export default {
  data() {
    return {
      disabled:false,
      loading:false,
      ChartForm: {
        name: "",
        goal: "",
        chartType: "",
        uploadFile: [],
      },
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.ChartForm.uploadFile = fileList;
    },
    genAsync() {
      this.loading = true
      this.disabled = true
      genAsync(this.ChartForm)
        .then((response) => {
          console.log("mq---seccess...")
          this.loading = false
          this.disabled = false
          this.$message.success("提交成功")
        })
        .catch((error) => {
          console.log(error);
          this.loading = false
          this.disabled = false
        });
    },
    resetForm() {
      this.$nextTick(() => {
        this.loading = false
        this.disabled = false
        this.$refs["ChartForm"].resetFields();
      });
    },
  },
};
</script>

<style>
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
</style>
