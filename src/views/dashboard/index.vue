<template>
  <div class="dashboard-container">
    <div class="dashboard-text">项目介绍<br>
      什么是BI？<br>
      智能BI（Business
      Intelligence）分析平台是一种基于人工智能和数据分析技术的商业分析工具。它结合了数据仓库、数据挖掘、数据可视化和机器学习等技术，旨在帮助企业从海量的数据中提取有价值的信息和洞察，以支持决策制定和业务优化<br>
      传统的BI平台：<br>
      1. 上传数据<br>
      2. 选择需要分析的内容（数据字段）<br>
      3. 选择需要生成的图表<br>
      4. 生成图表<br>
      智能BI平台：<br>
      区别于传统的BI，智能BI只需用户输入要分析的数据集，和自己想要分析的目标，最后利用AI自动生成图表和结论。
    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn/"> 豫ICP备2024052256号-1 </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    width: 100%;
    //height:800px;
    position: relative;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.dashboard-container .footer{
  position: fixed;

  margin: 0 auto;
  width: 100%;
  bottom: 50px;
  left: 50%;
  font-size: 13px;

}

</style>
