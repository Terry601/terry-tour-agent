<template>
  <div class="app">
    <div class="shell">
      <main class="content">
        <RouterView />
      </main>

      <footer class="footer">
        <span>© {{ new Date().getFullYear() }} AI Chat. All rights reserved.</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 22px;
  display: flex;
  justify-content: center;
}

.shell {
  width: min(1100px, 100%);
  height: calc(100vh - 44px);
  min-height: 640px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

.content {
  flex: 1;
  min-height: 0;
}

.footer {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.06));
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.2px;
}
</style>
