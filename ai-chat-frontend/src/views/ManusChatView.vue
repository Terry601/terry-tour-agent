<script setup>
import { useRouter } from 'vue-router'
import ChatRoom from '../components/ChatRoom.vue'
import CartoonIcons from '../components/CartoonIcons.vue'

const router = useRouter()

const ssePath = '/ai/manus/chat'
const buildParams = (message) => ({ message })
</script>

<template>
  <div class="page">
    <div class="bar">
      <div class="left">
        <button class="back" type="button" @click="router.push('/')">← 返回主页</button>
        <div class="title">
          <CartoonIcons name="agent" :size="34" />
          <span>AI 超级智能体</span>
        </div>
      </div>
      <div class="tip">接口：GET /ai/manus/chat（SSE，需 message）</div>
    </div>

    <div class="room">
      <ChatRoom
        title="AI 超级智能体"
        :sse-path="ssePath"
        :build-params="buildParams"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.back {
  border: none;
  background: transparent;
  color: var(--brand);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: rgba(139, 146, 255, 0.35);
  text-underline-offset: 3px;
}

.tip {
  color: var(--muted);
  font-size: 12px;
  text-align: right;
}

.room {
  flex: 1;
  min-height: 0;
}
</style>

