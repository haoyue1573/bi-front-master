const item= {
    name: 'Banana',
    price: 2.99,
    quantity: 5,
}

console.log(item)
console.log(JSON.stringify(" {\n" +
  "    title: {\n" +
  "        text: '人口趋势分析'\n" +
  "    },\n" +
  "    tooltip: {\n" +
  "        trigger: 'axis'\n" +
  "    },\n" +
  "    legend: {\n" +
  "        data: ['人口数量']\n" +
  "    },\n" +
  "    xAxis: {\n" +
  "        type: 'category',\n" +
  "        boundaryGap: false,\n" +
  "        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']\n" +
  "    },\n" +
  "    yAxis: {\n" +
  "        type: 'value'\n" +
  "    },\n" +
  "    series: [\n" +
  "        {\n" +
  "            name: '人口数量',\n" +
  "            type: 'line',\n" +
  "            data: [13, 12, 5, 7, 8, 13, 45, 26, 14, 15, 11, 13]\n" +
  "        }\n" +
  "    ]\n" +
  "}"))
