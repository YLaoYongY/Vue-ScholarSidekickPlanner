<script setup>
  const format = () => {
    return '30s'
  }
</script>
<template>
  <div class="main">
    <div class="pomodoro-techniqu">
      <div class="clock"><el-progress :format="format" width="300" type="circle" :percentage="25" /></div>
      <div class="set-buttons">
        <button>Start</button><button>Cancel</button><button>5m</button><button>10m</button><button>25m</button>
        <button>自定义时间</button>
      </div>
    </div>
    <div class="music">我是音乐播放器</div>
  </div>
</template>

<style scoped>
  .demo-progress {
    width: 500px;
    height: 500px;
  }
  .demo-progress .el-progress--circle {
    margin-right: 15px;
  }
  .main {
    text-align: center;
    background-image: url(/src/assets/images/4.JPG);
    background-size: cover;
    background-position: center;
  }
  .pomodoro-techniqu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 80%;
  }
  .music {
    height: 20%;
    background-color: pink;
  }
</style>
