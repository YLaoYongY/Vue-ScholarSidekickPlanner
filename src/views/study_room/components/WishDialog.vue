<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    width="30%"
  >
    <!-- 内容区插槽 -->
    <slot name="content">
      <el-input v-model="content" type="textarea" :placeholder="placeholderText" :autosize="{ minRows: 4 }" />
      <div class="tip-text">通过审核后，将会随机进行展示</div>
    </slot>

    <!-- 底部按钮区插槽 -->
    <template #footer>
      <slot name="footer">
        <el-button type="primary" @click="handleSubmit">
          {{ buttonText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue'

  const props = defineProps({
    visible: Boolean,
    type: {
      type: String,
      default: 'wish', // 'wish' | 'repay'
      validator: v => ['wish', 'repay'].includes(v),
    },
  })

  const emit = defineEmits(['update:visible', 'submit'])

  const content = ref('')
  const placeholderText = computed(() => (props.type === 'wish' ? '请输入你的愿望...' : '请输入还愿内容...'))
  const buttonText = computed(() => (props.type === 'wish' ? '许下愿望' : '提交还愿'))

  const handleSubmit = () => {
    emit('submit', { type: props.type, content: content.value })
    emit('update:visible', false)
    content.value = ''
  }
</script>

<style scoped>
  .tip-text {
    color: #999;
    font-size: 12px;
    margin-top: 8px;
  }
</style>
