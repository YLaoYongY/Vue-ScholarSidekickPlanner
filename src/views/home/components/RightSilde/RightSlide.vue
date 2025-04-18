<script setup>
  import RightHeader from './RightHeader.vue'
  import TimeCard from './TimeCard.vue'
  import HeatMap from './HeatMap.vue'
  import PhotoMotto from './PhotoMotto.vue'
  import { HeatmapChart } from 'echarts/charts'

  components: {
    RightHeader
  }
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  import * as echarts from 'echarts'
  import { TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'

  import { CanvasRenderer } from 'echarts/renderers'

  import draggable from 'vuedraggable'
  import { Rank, Plus } from '@element-plus/icons-vue'

  onMounted(() => {
    // echarts.use([TitleComponent, CalendarComponent, TooltipComponent, VisualMapComponent, HeatmapChart, CanvasRenderer])
    // var chartDom = document.getElementById('main')
    // var myChart = echarts.init(chartDom)
    // var option
    // 生成指定月份的数据（示例使用2023-10月）
    // function getRealData() {
    //   const now = new Date() // 获取当前日期
    //   const year = now.getFullYear()
    //   const month = now.getMonth() // 注意月份是0-based
    //   // 计算当月第一天和最后一天
    //   const firstDay = new Date(year, month, 1)
    //   const lastDay = new Date(year, month + 1, 0) // 下个月的第0天即本月最后一天
    //   const data = []
    //   const currentDay = new Date(firstDay) // 克隆日期对象避免污染
    //   while (currentDay <= lastDay) {
    //     // 格式化为YYYY-MM-DD
    //     const dayStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(
    //       currentDay.getDate()
    //     ).padStart(2, '0')}`
    //     // 这里保留随机数示例，实际可替换为真实数据
    //     data.push([dayStr, Math.floor(Math.random() * 1000)])
    //     // 增加一天
    //     currentDay.setDate(currentDay.getDate() + 1)
    //   }
    //   return data
    // }
    // var option = {
    //   tooltip: {
    //     position: 'top',
    //     formatter: function (p) {
    //       return p.data[0] + ': ' + p.data[1]
    //     },
    //   },
    //   // 右侧颜色条配置
    //   visualMap: {
    //     min: 0,
    //     max: 1000,
    //     calculable: true,
    //     orient: 'vertical',
    //     right: '5%',
    //     top: '20%',
    //     // left: '80%', // 改为百分比定位
    //     // top: '10%', // 垂直居中
    //     itemWidth: 20, // 颜色条宽度
    //     itemHeight: 100, // 颜色条高度
    //     text: ['高', '低'], // 两端文字
    //     textStyle: {
    //       color: '#666',
    //     },
    //   },
    //   // 图表标题
    //   title: {
    //     show: true,
    //     text: '热力图', // 标题文本
    //     left: 'center',
    //     top: '10%',
    //     padding: [10, 0], // 上下边距
    //     textStyle: {
    //       color: '#333',
    //       fontSize: '1.5em',
    //     },
    //   },
    //   calendar: {
    //     top: '30%',
    //     left: '10%',
    //     right: '25%',
    //     // width: '300em',
    //     // height: '200em',
    //     orient: 'vertical',
    //     cellSize: [35, 35],
    //     range: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    //     dayLabel: {
    //       position: 'start',
    //       nameMap: ['一', '二', '三', '四', '五', '六', '日'],
    //       margin: 5,
    //       color: '#666',
    //     },
    //     monthLabel: {
    //       show: true,
    //       position: 'start',
    //       fontSize: 14,
    //       color: '#333',
    //     },
    //     yearLabel: { show: false },
    //     itemStyle: {
    //       borderColor: '#ddd',
    //       borderWidth: 1,
    //     },
    //   },
    //   series: {
    //     type: 'heatmap',
    //     coordinateSystem: 'calendar',
    //     calendarIndex: 0,
    //     data: getRealData(),
    //     itemStyle: {
    //       borderWidth: 1,
    //       borderColor: '#fff',
    //     },
    //   },
    // }
    // option && myChart.setOption(option)
  })

  // 轮播图数据
  const item = [
    '/src/assets/images/1.png',
    '/src/assets/images/2.png',
    '/src/assets/images/3.jpeg',
    '/src/assets/images/4.JPG',
  ]
  // 座右铭数据
  const maxims = ref([
    { text: '他日我若为青帝，报与桃李一处开。', author: '黄巢' },
    { text: '路漫漫其修远兮，吾将上下而求索。', author: '屈原' },
    { text: '天行健，君子以自强不息。', author: '《周易》' },
    { text: '博观而约取，厚积而薄发。', author: '苏轼' },
  ])
  const currentMaximIndex = ref(0)

  const nextMaxim = () => {
    currentMaximIndex.value = (currentMaximIndex.value + 1) % maxims.value.length
  }
</script>

<template>
  <div class="right-content">
    <right-header />
    <ul class="status-bar">
      <time-card></time-card>
      <heat-map></heat-map>
      <photo-motto></photo-motto>
    </ul>
  </div>
</template>

<style scoped>
  .right-content {
    flex: 1 1 40%;
    /* 改为相对单位 */
    min-width: 250px;
    max-width: 25%;
    /* background: #e8e8e8; */
    height: 100%;
  }
  /* 右侧卡片的样式 */
  .status-bar {
    list-style: none;
    margin: 0;

    padding: 0;
    height: 100%;
  }

  /* 图表数据 */
  .chart-container {
    display: flex;
    width: 100%;
    gap: 20px;
    /* background-color: white; */
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .chart-card {
    flex: 1 1 30%; /* 基础30%宽度 */
    min-width: 280px; /* 最小卡片宽度 */
    max-width: calc(33.33% - 13px); /* 最大不超过1/3 */
    box-sizing: border-box;
    border-radius: 30px;
    box-shadow: 0 2rem 3rem rgba(132, 139, 200, 0.18);
    padding: 15px; /* 减小内边距 */
    height: 160px; /* 适当降低高度 */
    transition: all 0.3s; /* 添加过渡效果 */
  }

  .card-content {
    display: flex;
    height: 100%;
    text-align: center;
  }

  .data-section {
    flex: 1;
    padding-right: 15px;
    border-right: 1px solid #eee;
  }

  .chart-section {
    flex: 1;
    height: 100%;
    margin-left: 15px;
  }

  @media (max-width: 1200px) {
    .left-content {
      max-width: 65%;
    }
    .right-content {
      max-width: 35%;
    }
    .chart-card {
      min-width: 240px;
    }
  }

  @media (max-width: 992px) {
    .home {
      flex-direction: column;
    }
    .left-content,
    .right-content {
      max-width: 100%;
      min-width: 100%;
    }
    .chart-card {
      flex: 1 1 48%;
      max-width: calc(50% - 10px);
    }
  }

  /* 主页待办 */
  .main-todo {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-top: 10px;
  }

  .quadrant-selector {
    display: flex;
    margin-bottom: 20px;
  }

  .quadrant-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
    width: 200px;
    height: 200px;
    margin-right: 20px;
  }
  .quadrant-grid {
    position: relative;
    width: 100%;
    height: 200px;
    border: 2px solid #666;
    background: linear-gradient(to right, transparent 49.5%, #666 49.5%, #666 50.5%, transparent 50.5%),
      linear-gradient(to bottom, transparent 49.5%, #666 49.5%, #666 50.5%, transparent 50.5%);
  }
</style>
