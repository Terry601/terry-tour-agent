<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { buildSseUrl, createEventSource } from '../utils/sse'

const props = defineProps({
  title: { type: String, required: true },
  ssePath: { type: String, required: true },
  buildParams: { type: Function, required: true }, // (message: string, chatId: string) => Record<string, any>
  initialChatId: { type: String, default: '' },
  showChatId: { type: Boolean, default: false },
})

const chatId = ref(props.initialChatId || '')
watch(
  () => props.initialChatId,
  (v) => {
    if (!chatId.value) chatId.value = v || ''
  },
)

const messages = ref([])
const input = ref('')
const isStreaming = ref(false)
const streamError = ref('')
const scrollEl = ref(null)

let es = null

const canSend = computed(() => input.value.trim().length > 0 && !isStreaming.value)

function makeChatId() {
  if (chatId.value) return
  if (globalThis.crypto?.randomUUID) chatId.value = globalThis.crypto.randomUUID()
  else chatId.value = `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

async function safeScroll() {
  await nextTick()
  scrollToBottom()
}

function stopStream() {
  isStreaming.value = false
  if (es) {
    es.close()
    es = null
  }
}

function resetChat() {
  stopStream()
  streamError.value = ''
  messages.value = []
  if (props.showChatId) {
    chatId.value = ''
    makeChatId()
  }
}

async function copyChatId() {
  if (!chatId.value) return
  try {
    await navigator.clipboard.writeText(chatId.value)
  } catch {
    // ignore
  }
}

function normalizeChunk(raw) {
  const chunk = typeof raw === 'string' ? raw : String(raw ?? '')
  const trimmed = chunk.trim()
  if (!trimmed) return ''
  if (trimmed === '[DONE]' || trimmed === '[done]' || trimmed === '__DONE__') return ''
  return chunk
}

async function send() {
  const text = input.value.trim()
  if (!text || isStreaming.value) return

  streamError.value = ''
  if (props.showChatId) makeChatId()

  messages.value.push({ id: `${Date.now()}-u`, role: 'user', content: text })
  const aiMsg = { id: `${Date.now()}-a`, role: 'ai', content: '' }
  messages.value.push(aiMsg)
  input.value = ''
  await safeScroll()

  stopStream()
  isStreaming.value = true

  const url = buildSseUrl(props.ssePath, props.buildParams(text, chatId.value))
  es = createEventSource(url)

  es.onmessage = async (evt) => {
    const chunk = normalizeChunk(evt?.data)
    if (!chunk) return
    aiMsg.content += chunk
    await safeScroll()
  }

  es.onerror = () => {
    streamError.value = '连接中断或后端返回错误（SSE）。请检查后端是否启动、接口是否可访问。'
    stopStream()
  }
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

onMounted(() => {
  if (props.showChatId) makeChatId()
})

onBeforeUnmount(() => {
  stopStream()
})
</script>

<template>
  <div class="chatShell">
    <header class="topBar">
      <div class="title">
        <div class="name">{{ title }}</div>
        <div v-if="showChatId" class="meta">
          <span class="label">chatId</span>
          <span class="value">{{ chatId }}</span>
          <button class="linkBtn" type="button" @click="copyChatId">复制</button>
          <button class="linkBtn" type="button" @click="resetChat">新会话</button>
        </div>
      </div>

      <div class="actions">
        <button v-if="isStreaming" class="btn danger" type="button" @click="stopStream">
          停止生成
        </button>
        <button v-else class="btn ghost" type="button" @click="resetChat">清空</button>
      </div>
    </header>

    <main ref="scrollEl" class="chatHistory">
      <div v-if="messages.length === 0" class="empty">
        请输入你的问题开始对话。
      </div>

      <div v-for="m in messages" :key="m.id" class="row" :class="m.role">
        <div class="tag" :class="m.role">{{ m.role === 'user' ? 'YOU' : 'AI' }}</div>
        <div class="bubble">
          <pre class="text">{{ m.content }}</pre>
        </div>
      </div>
    </main>

    <footer class="composer">
      <div v-if="streamError" class="error">{{ streamError }}</div>
      <textarea
        v-model="input"
        class="input"
        placeholder="输入消息，Enter 发送，Shift+Enter 换行"
        rows="2"
        :disabled="isStreaming"
        @keydown="onKeydown"
      />
      <button class="btn primary" type="button" :disabled="!canSend" @click="send">
        发送
      </button>
    </footer>
  </div>
</template>

<style scoped>
.chatShell {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadowSoft);
  backdrop-filter: blur(14px);
}

.topBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0));
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  gap: 12px;
  position: relative;
}

.topBar::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(139, 146, 255, 0.18),
    rgba(34, 211, 238, 0.12),
    transparent
  );
  transform: translateX(-55%);
  animation: sweep 10s linear infinite;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.65;
}

.title .name {
  font-weight: 850;
  letter-spacing: 0.25px;
  text-shadow: 0 0 18px rgba(139, 146, 255, 0.18);
}

.meta {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.meta .label {
  opacity: 0.8;
}

.meta .value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  color: var(--text);
  opacity: 0.9;
}

.linkBtn {
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
  padding: 0;
  font-size: 12px;
  text-decoration: underline;
  text-decoration-color: rgba(139, 146, 255, 0.4);
  text-underline-offset: 3px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chatHistory {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(139, 146, 255, 0.18), transparent 55%),
    radial-gradient(900px 500px at 100% 0%, rgba(34, 211, 238, 0.16), transparent 55%),
    radial-gradient(900px 600px at 40% 120%, rgba(251, 113, 133, 0.1), transparent 60%);
  position: relative;
}

.chatHistory::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.05) 1px,
    transparent 1px
  );
  background-size: 100% 28px;
  opacity: 0.07;
  pointer-events: none;
  mask-image: radial-gradient(circle at 30% 0%, rgba(0, 0, 0, 1), transparent 70%);
}

.empty {
  color: var(--muted);
  font-size: 14px;
  padding: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.row {
  display: flex;
  margin: 10px 0;
  gap: 8px;
  align-items: flex-start;
  position: relative;
}

.row.ai {
  justify-content: flex-start;
}
.row.user {
  justify-content: flex-end;
}

.tag {
  font-size: 10px;
  letter-spacing: 0.35px;
  font-weight: 850;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  user-select: none;
  margin-top: 4px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
}

.tag.ai {
  border-color: rgba(34, 211, 238, 0.28);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.12), 0 14px 34px rgba(0, 0, 0, 0.28);
}
.tag.user {
  border-color: rgba(139, 146, 255, 0.34);
  box-shadow: 0 0 0 1px rgba(139, 146, 255, 0.14), 0 14px 34px rgba(0, 0, 0, 0.28);
}

.bubble {
  max-width: min(720px, 90%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 10px 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.07),
    rgba(255, 255, 255, 0.045)
  );
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;
}

.bubble::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: radial-gradient(600px 220px at 10% 20%, rgba(34, 211, 238, 0.14), transparent 60%),
    radial-gradient(620px 240px at 80% 10%, rgba(139, 146, 255, 0.18), transparent 60%);
  opacity: 0.75;
  pointer-events: none;
}

.row.user .bubble {
  background: linear-gradient(
    180deg,
    rgba(139, 146, 255, 0.22),
    rgba(139, 146, 255, 0.12)
  );
  border-color: rgba(139, 146, 255, 0.38);
  box-shadow: 0 0 0 1px rgba(139, 146, 255, 0.12), 0 18px 55px rgba(0, 0, 0, 0.42);
}

.text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  position: relative;
}

.composer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.04));
  backdrop-filter: blur(14px);
}

.error {
  grid-column: 1 / -1;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fecaca;
  font-size: 13px;
}

.input {
  width: 100%;
  resize: none;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.055);
  color: var(--text);
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
}

.input:focus {
  border-color: rgba(34, 211, 238, 0.38);
  box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.12), 0 0 0 4px rgba(34, 211, 238, 0.08);
}

.input:disabled {
  opacity: 0.7;
}

.btn {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 0.2px;
  background: rgba(255, 255, 255, 0.055);
  color: var(--text);
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease,
    filter 0.16s ease;
}
.btn:hover:not(:disabled) {
  border-color: rgba(139, 146, 255, 0.45);
  transform: translateY(-1px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  filter: saturate(1.05);
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, rgba(139, 146, 255, 0.26), rgba(34, 211, 238, 0.14));
  border-color: rgba(139, 146, 255, 0.44);
  box-shadow: 0 0 0 1px rgba(139, 146, 255, 0.12), 0 18px 55px rgba(0, 0, 0, 0.42);
}
.btn.ghost {
  background: transparent;
}
.btn.danger {
  background: rgba(239, 68, 68, 0.14);
  border-color: rgba(239, 68, 68, 0.3);
}

@keyframes sweep {
  0% {
    transform: translateX(-55%);
  }
  100% {
    transform: translateX(55%);
  }
}
</style>

