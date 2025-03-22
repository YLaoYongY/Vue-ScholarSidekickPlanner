<script setup>
  import { onMounted } from 'vue'

  onMounted(() => {
    let nav = document.querySelectorAll('.nav li')
    function activeLink() {
      nav.forEach(item => item.classList.remove('active'))
      this.classList.add('active')
    }
    nav.forEach(item => item.addEventListener('click', activeLink))
  })
</script>

<template>
  <div class="shell">
    <ul class="nav">
      <li class="active" id="logo">
        <a href="#">
          <div class="icon">
            <div class="imageBox">
              <img src="@/assets/images/xy.jpg" alt="" />
            </div>
          </div>
          <div class="text">夏雨出品必属精品</div>
        </a>
      </li>
      <li>
        <router-link to="/home">
          <div class="icon">
            <i class="iconfont icon-shouye"></i>
          </div>

          <div class="text">首页</div></router-link
        >
        <!-- <a href="#home"> </a> -->
      </li>
      <li>
        <router-link to="/pomodoro-techniqu">
          <div class="icon">
            <i class="iconfont icon-shuju"></i>
          </div>
          <div class="text">番茄钟</div></router-link
        >
        <!-- <a href="#theme"> </a> -->
      </li>
      <li>
        <router-link to="/study-room"
          ><div class="icon">
            <i class="iconfont icon-zixishi"></i>
          </div>
          <div class="text">自习室</div></router-link
        >
        <!-- <a href="#wallet"> </a> -->
      </li>
      <li>
        <router-link to="/statistical-data">
          <div class="icon">
            <i class="iconfont icon-shuju"></i>
          </div>
          <div class="text">统计</div></router-link
        >
        <!-- <a href="#picture"> </a> -->
      </li>
    </ul>
  </div>
  <!-- <section id="home">Home</section>
  <section id="theme">theme</section>
  <section id="wallet">wallet</section>
  <section id="picture">picture</section>
  <section id="code">QR code</section>
  <section id="authentication">authentication</section>
  <section id="me">ME</section> -->
</template>

<style scoped>
  /* 图标样式 */
  @font-face {
    font-family: 'iconfont';
    src: url('iconfont.ttf?t=1742630205734') format('truetype');
  }

  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
  }

  body {
    background: #e4e9f5;
  }

  section {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font: 900 100px '';
    color: rgba(110, 90, 240, 0.3);
    background: #e4e9f5;
  }

  .shell {
    position: fixed;
    width: 84px;
    height: 100%;
    background: #fff;
    z-index: 9999;
    transition: width 0.5s;
    padding-left: 10px;
    overflow: hidden;
  }

  .shell:hover {
    width: 300px;
  }

  .imageBox {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }

  .imageBox img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .shell ul {
    position: relative;
    height: 100vh;
  }

  .shell ul li {
    position: relative;
    padding: 5px;
  }

  .active {
    background: #e4e9f5;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  .active::before {
    content: '';
    position: absolute;
    top: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-bottom-right-radius: 25px;
    box-shadow: 5px 5px 0 5px #e4e9f5;
    background: transparent;
  }

  .active::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: 0;
    width: 30px;
    height: 30px;
    border-top-right-radius: 25px;
    box-shadow: 5px -5px 0 5px #e4e9f5;
    background: transparent;
  }

  #logo {
    margin: 40px 0 100px 0;
  }

  .shell ul li a {
    position: relative;
    display: flex;
    white-space: nowrap;
  }

  .icon {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 60px;
    padding-left: 10px;
    height: 70px;
    color: #333;
    transition: 0.5s;
    color: rgb(110, 90, 240);
  }

  .icon i {
    font-size: 30px;
    z-index: 999;
  }

  .text {
    position: relative;
    height: 70px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #333;
    padding-left: 15px;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: 0.5s;
  }

  .shell ul li:hover a .icon,
  .shell ul li:hover a .text {
    color: #ffa117;
  }

  .active a .icon::before {
    content: '';
    position: absolute;
    inset: 5px;
    width: 60px;
    background: #fff;
    border-radius: 50%;
    transition: 0.5s;
    border: 7px solid rgb(110, 90, 240);
    box-sizing: border-box;
  }
</style>
