import request from '../utils/request'

export function getList(params) {
  return request({
    url: '/chart/list',
    method: 'get',
    params
  })
}

export function getChart() {
  return request({
    url: '/chart/getchart',
    method: 'get',
  })
}

export function postForm(data) {

  return request({
    url: '/chart/form',
    method: 'post',
    data
  })
}

export function upload(data) {

  const formData = new FormData();
    data.forEach(item=>{
    //文件信息中raw才是真的文件
    formData.append("file",item.raw)
  });

  return request({
    url: '/chart/upload',
    method: 'post',
    data: formData
  })
}


export function genChart(ChartForm) {
  // 将方法参数追加到formData
  const formData = new FormData();
  ChartForm.uploadFile.forEach(item=>{
    //文件信息中raw才是真的文件
    formData.append("file",item.raw)
  });

  // 添加字段到表单数据
  // Object.keys(ChartForm).forEach(key => {
  //   formData.append(key, ChartForm[key]);
  // });

  formData.append("name",ChartForm.name)
  formData.append("goal", ChartForm.goal);
  formData.append("chartType", ChartForm.chartType);

  return request({
    url: '/chart/genchart',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 同步生成图表方请求
export function genChartByAI(ChartForm) {
  // 将方法参数追加到formData
  const formData = new FormData();
  ChartForm.uploadFile.forEach(item => {
    //文件信息中raw才是真的文件
    formData.append("file", item.raw)
  });

  // 添加字段到表单数据
  // Object.keys(ChartForm).forEach(key => {
  //   formData.append(key, ChartForm[key]);
  // });

  formData.append("name", ChartForm.name)
  formData.append("goal", ChartForm.goal);
  formData.append("chartType", ChartForm.chartType);

  return request({
    url: '/chart/gen',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 异步生成图表请求
export function genAsync(ChartForm) {
  // 将方法参数追加到formData
  const formData = new FormData();
  ChartForm.uploadFile.forEach(item => {
    //文件信息中raw才是真的文件
    formData.append("file", item.raw)
  });

  // 添加字段到表单数据
  // Object.keys(ChartForm).forEach(key => {
  //   formData.append(key, ChartForm[key]);
  // });

  formData.append("name", ChartForm.name)
  formData.append("goal", ChartForm.goal);
  formData.append("chartType", ChartForm.chartType);

  return request({
    url: '/chart/gen/async/mq',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function listMyChart(data) {

  return request({
    url: '/chart/my/list/page',
    method: 'post',
    data
  })
}
