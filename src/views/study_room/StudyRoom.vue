<script setup>
  import { ref, watch, onMounted } from 'vue'
  import WishDialog from './components/WishDialog.vue'

  const bg = ref(null)
  const flag = ref(true)

  watch(flag, (newVal, oldVal) => {
    if (newVal === true) {
      console.log('自习室', bg.value)
      bg.value.style.backgroundImage = 'url(/src/assets/images/zxs.webp)'
    } else {
      console.log('许愿墙', bg.value)
      bg.value.style.backgroundImage = 'url(/src/assets/images/3.jpeg)'
    }
  })
  // 许愿
  const dialogVisible = ref(false)
  const currentType = ref('wish')

  const handleWishAction = type => {
    currentType.value = type
    dialogVisible.value = true
  }
  // 许愿弹幕
  // 模拟后台数据（替换为实际API调用）
  const danmuList = ref([
    { user: '考研党小王', content: '希望今年能考上理想的院校！' },
    { user: '用户_123', content: '还愿：感谢通过英语四级！' },
    { user: '留学小白', content: '许愿雅思7分顺利达成！' },
    { user: '求职者Mike', content: '还愿：终于拿到心仪offer！' },
    { user: '法考备战中', content: '希望法律资格考试一次过！' },
    { user: '小美同学', content: '还愿：教资面试顺利通过！' },
    { user: '考公大军01', content: '许愿省考笔试第一名！' },
    { user: '转码新人', content: '还愿：成功拿到实习机会！' },
    { user: '医学生', content: '希望考研复试顺利通过！' },
    { user: '设计狮', content: '还愿：作品集获得好评！' },
    { user: '博士候选人', content: '许愿论文盲审顺利！' },
    { user: '转专业生', content: '还愿：成功转入计算机系！' },
    { user: '二战考生', content: '希望今年数学能上120！' },
    { user: '留学党', content: '还愿：顺利拿到签证！' },
    { user: '宝妈考生', content: '许愿在职研究生顺利毕业！' },
    { user: '转行小白', content: '还愿：成功通过职业认证！' },
    { user: '竞赛选手', content: '希望数学建模拿国奖！' },
    { user: '创业者', content: '还愿：项目获得天使投资！' },
    { user: '艺术生', content: '许愿校考专业排名前三！' },
    { user: '科研狗', content: '还愿：实验数据终于达标！' },
    { user: '外语学习者', content: '希望N1考试顺利通过！' },
    { user: '实习生', content: '还愿：顺利拿到return offer！' },
    { user: '高考生', content: '许愿考上985院校！' },
    { user: '产品新人', content: '还愿：原型设计通过评审！' },
    { user: '转正员工', content: '希望试用期顺利通过！' },
    { user: '留学生', content: '还愿：论文顺利发表！' },
    { user: '考编大军', content: '许愿教师编制考试成功！' },
    { user: '程序员', content: '还愿：成功修复重大bug！' },
    { user: '跨考生', content: '希望专业课突破130！' },
    { user: '毕业生', content: '还愿：三方协议顺利签订！' },
  ])

  // 弹幕样式生成函数
  const getRandomTop = () => `${Math.random() * 70}%` // 保留底部空间
  const getRandomDuration = () => `${8 + Math.random() * 8}s` // 8-16秒随机速度
  const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead', '#ff9999']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // 自动更新弹幕数据（示例）
  onMounted(() => {
    setInterval(() => {
      // 实际应用中应调用API获取最新数据
      danmuList.value = [...danmuList.value] // 强制更新
    }, 30000)
  })
  // 处理提交逻辑
  const handleSubmit = ({ type, content }) => {
    console.log(`提交类型：${type}，内容：`, content)
    // 这里调用你的API接口
  }
</script>
<template>
  <div class="bg" ref="bg">
    <div class="tab-bar">
      <el-button-group>
        <el-button
          type="primary"
          @click="
            () => {
              flag = true
            }
          "
          >自习室</el-button
        >
        <el-button
          type="primary"
          @click="
            () => {
              flag = false
            }
          "
        >
          许愿墙
        </el-button>
      </el-button-group>
    </div>
    <div class="content" v-if="flag">
      <el-button style="width: 200px; height: 200px; font-size: large" type="primary" circle>加入自习室</el-button
      ><el-button style="width: 200px; height: 200px; font-size: large" type="success" circle>创建自习室</el-button>
    </div>
    <div class="xuyuan" v-else>
      <el-dropdown @command="handleWishAction">
        <el-button round>我要许愿 | 还愿<arrow-down /></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="wish">我要许愿</el-dropdown-item>
            <el-dropdown-item command="repay">我要还愿</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="danmu-container">
        <div
          v-for="(msg, index) in danmuList"
          :key="index"
          class="danmu-item"
          :style="{
            top: getRandomTop(),
            'animation-duration': getRandomDuration(),
            color: getRandomColor(),
          }"
        >
          {{ msg.user }}：{{ msg.content }}
        </div>
      </div>
    </div>
    <WishDialog v-model:visible="dialogVisible" :type="currentType" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
  .bg {
    text-align: center;
    background-image: url(/src/assets/images/zxs.webp);
    background-size: cover;
  }
  .tab-bar {
    height: 200px;
    line-height: 200px;
  }
  .content {
    margin-top: 8em;
    display: flex;
    gap: 10em;
    justify-content: center;
  }
  /* 下拉菜单 */
  .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  /* 许愿弹幕 */
  .danmu-container {
    position: fixed;
    top: 30%;
    left: 0;
    width: 100%;
    height: 50vh;
    pointer-events: none;
    overflow: hidden;
  }

  .danmu-item {
    position: absolute;
    white-space: nowrap;
    font-size: 18px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    animation: danmu linear infinite;
    will-change: transform;
  }

  @keyframes danmu {
    from {
      transform: translateX(100vw);
    }
    to {
      transform: translateX(-100%);
    }
  }
</style>
