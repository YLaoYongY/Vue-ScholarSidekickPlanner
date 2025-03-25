<script setup></script>
<template>
  <div class="home">
    <div class="left-content">
      <h2 class="header">任务完成情况</h2>
      <ul class="chart-container">
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>昨日任务进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1"></div>
          </div>
        </li>
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>今日任务进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1"></div>
          </div>
        </li>
        <li class="chart-card">
          <div class="card-content">
            <div class="data-section">
              <h3>总目标进度</h3>
              <p class="percentage">75%</p>
            </div>
            <div class="chart-section" ref="chart1"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-content">右边栏</div>
  </div>
</template>

<style scoped>
  .home {
    display: flex;
    height: 100vh; /* 确保容器高度 */
    gap: 20px; /* 添加间距 */
    background: #f6f6f9;
    width: 100%;
    overflow: hidden;
  }

  .left-content {
    flex: 1 1 60%;
    /* 移除固定min-width */
    min-width: auto;
    /* 添加最小宽度约束 */
    min-width: 400px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    /* 使用相对单位 */
    max-width: 75%;
  }

  .right-content {
    flex: 1 1 40%;
    /* 改为相对单位 */
    min-width: 250px;
    max-width: 25%;
    background: #e8e8e8;
    height: 100%;
  }
  .header {
    margin: 0;
    margin-top: 30px;
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

  .percentage {
    font-size: 2em;
    color: #409eff;
    margin: 10px 0;
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
</style>
