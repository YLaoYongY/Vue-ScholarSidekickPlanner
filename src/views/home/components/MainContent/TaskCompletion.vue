<script setup></script>

<template>
  <ul class="chart-container">
    <li class="chart-card">
      <div class="card-content">
        <div class="data-section">
          <h3>昨日任务进度</h3>
          <p class="percentage">75%</p>
        </div>
        <div class="chart-section" ref="chart1">
          <el-progress type="dashboard" :percentage="75">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">今日任务进度</span>
            </template>
          </el-progress>
        </div>
      </div>
    </li>
    <li class="chart-card">
      <div class="card-content">
        <div class="data-section">
          <h3>今日任务进度</h3>
          <p class="percentage">75%</p>
        </div>
        <div class="chart-section" ref="chart1">
          <el-progress type="dashboard" :percentage="75">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">今日任务进度</span>
            </template>
          </el-progress>
        </div>
      </div>
    </li>
    <li class="chart-card">
      <div class="card-content">
        <div class="data-section">
          <h3>总目标进度</h3>
          <p class="percentage">75%</p>
        </div>
        <div class="chart-section" ref="chart1">
          <el-progress type="dashboard" :percentage="75">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">今日任务进度</span>
            </template>
          </el-progress>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
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
  /* 圆形进度条样式 */
  .percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
  }
  .percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
  }
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  .demo-progress .el-progress--circle {
    margin-right: 15px;
  }
</style>
