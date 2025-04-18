<script setup>
  import RightHeader from './RightHeader.vue'

  components: {
    RightHeader
  }
  import { onMounted } from 'vue'
  import * as echarts from 'echarts'
  import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
  import { HeatmapChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'

  onMounted(() => {
    echarts.use([TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent, HeatmapChart, CanvasRenderer])

    var chartDom = document.getElementById('main')
    var myChart = echarts.init(chartDom)
    var option

    // 生成指定月份的数据（示例使用2023-10月）
    function getRealData() {
      const now = new Date() // 获取当前日期
      const year = now.getFullYear()
      const month = now.getMonth() // 注意月份是0-based
      const heatData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      // 计算当月第一天和最后一天
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0) // 下个月的第0天即本月最后一天

      const data = []
      const currentDay = new Date(firstDay) // 克隆日期对象避免污染

      while (currentDay <= lastDay) {
        // 格式化为YYYY-MM-DD
        const dayStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(
          currentDay.getDate()
        ).padStart(2, '0')}`

        // 这里保留随机数示例，实际可替换为真实数据
        data.push([dayStr, Math.floor(Math.random() * 1000)])

        // 增加一天
        currentDay.setDate(currentDay.getDate() + 1)
      }
      return data
    }

    var option = {
      tooltip: {
        position: 'top',
        formatter: function (p) {
          return p.data[0] + ': ' + p.data[1]
        },
      },
      // 右侧颜色条配置
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'vertical',
        right: '5%',
        top: '20%',
        // left: '80%', // 改为百分比定位
        // top: '10%', // 垂直居中
        itemWidth: 20, // 颜色条宽度
        itemHeight: 100, // 颜色条高度
        text: ['高', '低'], // 两端文字
        textStyle: {
          color: '#666',
        },
        // 颜色条和图表单元格的颜色
        inRange: {
          color: ['#50a3ba', '#eac736', '#d9534f'], // 从蓝色到黄色再到红色
        },
      },
      // 图表标题
      title: {
        show: true,
        text: '热力图', // 标题文本
        left: 'center',
        top: '10%',
        padding: [10, 0], // 上下边距
        textStyle: {
          color: '#333',
          fontSize: '1.5em',
        },
      },
      calendar: {
        top: '30%',
        left: '10%',
        right: '25%',
        // width: '300em',
        // height: '200em',
        orient: 'vertical',
        cellSize: [35, 35],

        range: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        dayLabel: {
          position: 'start',
          nameMap: ['一', '二', '三', '四', '五', '六', '日'],
          margin: 5,
          color: '#666',
        },
        monthLabel: {
          show: true,
          position: 'start',
          fontSize: 14,
          color: '#333',
        },
        yearLabel: { show: false },
        itemStyle: {
          borderColor: '#ddd',
          borderWidth: 1,
        },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getRealData(),
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff',
        },
      },
    }

    option && myChart.setOption(option)
  })
</script>

<template>
  <li class="status-card">
    <div id="main" style="width: 100%; height: 100%"></div>
  </li>
</template>

<style scoped>
  .status-card {
    flex: 1 1 30%; /* 基础30%宽度 */
    min-width: 300px; /* 最小卡片宽度 */
    max-width: calc(88%); /* 最大不超过1/3 */
    box-sizing: border-box;
    border-radius: 30px;
    box-shadow: 0 2rem 3rem rgba(132, 139, 200, 0.18);
    /* padding: 15px; 减小内边距 */
    height: 30%; /* 适当降低高度 */
    transition: all 0.3s; /* 添加过渡效果 */
    margin: auto;
    margin-bottom: 1rem;
    position: relative;
    perspective: 1000px;
  }
  .status-card .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
</style>
