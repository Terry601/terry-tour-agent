<script setup>
import { useRouter } from 'vue-router'
import CartoonIcons from '../components/CartoonIcons.vue'

const router = useRouter()

const apps = [
  {
    key: 'love',
    title: 'AI 旅游规划大师',
    desc: '支持 chatId 会话隔离，SSE 流式输出。',
    path: '/love',
    icon: 'travel',
  },
  {
    key: 'manus',
    title: 'AI 超级智能体',
    desc: 'SSE 流式输出（SseEmitter）。',
    path: '/manus',
    icon: 'agent',
  },
]
</script>

<template>
  <div class="page">
    <div class="hero">
      <div class="badge">Vue3 + SSE</div>
      <h1 class="h1">AI 应用入口</h1>
      <p class="sub">选择一个应用开始对话。</p>
    </div>

    <div class="grid">
      <button
        v-for="a in apps"
        :key="a.key"
        class="card"
        type="button"
        @click="router.push(a.path)"
      >
        <div class="cardTop">
          <CartoonIcons :name="a.icon" :size="52" />
          <div class="cardTitle">{{ a.title }}</div>
        </div>
        <div class="cardDesc">{{ a.desc }}</div>
        <div class="cardGo">进入 →</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
}

.hero {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background:
    radial-gradient(1000px 400px at 10% 0%, rgba(139, 146, 255, 0.28), transparent 60%),
    radial-gradient(900px 360px at 100% 0%, rgba(34, 211, 238, 0.22), transparent 60%),
    radial-gradient(900px 360px at 50% 120%, rgba(251, 113, 133, 0.12), transparent 65%),
    rgba(255, 255, 255, 0.035);
  box-shadow: var(--shadowSoft);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(139, 146, 255, 0.16),
    rgba(34, 211, 238, 0.12),
    transparent
  );
  transform: translateX(-35%);
  animation: sweep 8s linear infinite;
  pointer-events: none;
  mix-blend-mode: screen;
}

.badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
  font-size: 12px;
  backdrop-filter: blur(12px);
}

.h1 {
  margin: 10px 0 0;
  font-size: 28px;
  letter-spacing: 0.2px;
}

.sub {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.035);
  padding: 16px;
  cursor: pointer;
  color: var(--text);
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease,
    box-shadow 0.18s ease, filter 0.18s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(14px);
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(600px 220px at 10% 10%, rgba(139, 146, 255, 0.18), transparent 60%),
    radial-gradient(520px 220px at 90% 20%, rgba(34, 211, 238, 0.14), transparent 60%),
    radial-gradient(520px 220px at 40% 120%, rgba(251, 113, 133, 0.12), transparent 60%);
  opacity: 0.9;
  pointer-events: none;
}

.card::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.16),
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-60%) skewX(-18deg);
  opacity: 0;
  transition: opacity 0.18s ease;
  pointer-events: none;
  mix-blend-mode: screen;
}

.card:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 146, 255, 0.5);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
  filter: saturate(1.06);
}

.card:hover::after {
  opacity: 1;
  animation: shine 1.2s ease both;
}

.cardTitle {
  font-weight: 800;
  letter-spacing: 0.2px;
  position: relative;
}

.cardTop {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.cardDesc {
  margin-top: 8px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
  position: relative;
}

.cardGo {
  margin-top: 14px;
  color: var(--brand);
  font-weight: 700;
  font-size: 13px;
  position: relative;
}

@keyframes shine {
  from {
    transform: translateX(-60%) skewX(-18deg);
  }
  to {
    transform: translateX(60%) skewX(-18deg);
  }
}

@keyframes sweep {
  0% {
    transform: translateX(-35%);
  }
  100% {
    transform: translateX(35%);
  }
}
</style>

