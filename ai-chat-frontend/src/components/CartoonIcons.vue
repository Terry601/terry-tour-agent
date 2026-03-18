<script setup>
defineProps({
  name: { type: String, required: true }, // 'travel' | 'agent'
  size: { type: [Number, String], default: 46 },
})
</script>

<template>
  <span class="icon" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <!-- Travel: cute rocket + map pin -->
    <svg
      v-if="name === 'travel'"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="8" y1="10" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8B92FF" />
          <stop offset="0.55" stop-color="#22D3EE" />
          <stop offset="1" stop-color="#FB7185" />
        </linearGradient>
        <linearGradient id="g2" x1="18" y1="8" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(255,255,255,0.95)" />
          <stop offset="1" stop-color="rgba(255,255,255,0.2)" />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0.1  0 1 0 0 0.2  0 0 1 0 0.6  0 0 0 0.7 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.06)" />
      <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.16)" />

      <!-- pin -->
      <path
        d="M19 29c0-7.2 5.8-13 13-13s13 5.8 13 13c0 8.8-13 21-13 21S19 37.8 19 29Z"
        fill="url(#g1)"
        filter="url(#glow)"
        opacity="0.95"
      />
      <circle cx="32" cy="29" r="4.6" fill="rgba(10,16,48,0.7)" stroke="rgba(255,255,255,0.35)" />

      <!-- rocket -->
      <path
        d="M45.8 16.3c-7.6.6-14.3 6-16.9 13.2l-3.6 1.8a2.2 2.2 0 0 0-1 2.9l2.1 4.2a2.2 2.2 0 0 0 2.9 1l3.5-1.7c6.8 2.2 14.6.1 19.6-5.7 3.4-4 4.8-9.1 4-14.3-.1-.7-.7-1.2-1.4-1.1l-9.2.7Z"
        fill="url(#g2)"
        opacity="0.95"
      />
      <path
        d="M30.2 38.1l-1.6 7.4c-.2.9.7 1.6 1.5 1.1l6.8-4.2"
        stroke="rgba(34,211,238,0.65)"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M47.2 18.8c1.7 4.4 1.1 9.5-2 13.1-3.9 4.5-9.8 5.3-13.7 3.1"
        stroke="rgba(139,146,255,0.65)"
        stroke-width="2.2"
        stroke-linecap="round"
      />
      <circle cx="43.6" cy="26.4" r="3.6" fill="rgba(34,211,238,0.25)" stroke="rgba(255,255,255,0.35)" />
    </svg>

    <!-- Agent: cute bot head -->
    <svg
      v-else-if="name === 'agent'"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="b1" x1="10" y1="14" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stop-color="#22D3EE" />
          <stop offset="0.5" stop-color="#8B92FF" />
          <stop offset="1" stop-color="#4ADE80" />
        </linearGradient>
        <filter id="glow2" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0.1  0 1 0 0 0.45  0 0 1 0 0.3  0 0 0 0.75 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.06)" />
      <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.16)" />

      <path
        d="M22 26c0-6.1 4.9-11 11-11h-2c6.1 0 11 4.9 11 11v2.2c3.7 1.3 6.2 4.8 6.2 8.8 0 5.2-4.2 9.4-9.4 9.4H25.2c-5.2 0-9.4-4.2-9.4-9.4 0-4 2.5-7.5 6.2-8.8V26Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
      />
      <path
        d="M32 12v4.6"
        stroke="rgba(255,255,255,0.35)"
        stroke-width="2.2"
        stroke-linecap="round"
      />
      <circle cx="32" cy="10.2" r="2.4" fill="url(#b1)" filter="url(#glow2)" />

      <rect
        x="22"
        y="27"
        width="20"
        height="14"
        rx="7"
        fill="rgba(7,10,20,0.55)"
        stroke="rgba(255,255,255,0.18)"
      />
      <circle cx="28.5" cy="34" r="2.7" fill="url(#b1)" filter="url(#glow2)" />
      <circle cx="35.5" cy="34" r="2.7" fill="url(#b1)" filter="url(#glow2)" />
      <path
        d="M26.8 40.5c1.5 1.7 3.4 2.6 5.2 2.6s3.7-.9 5.2-2.6"
        stroke="rgba(255,255,255,0.42)"
        stroke-width="2.2"
        stroke-linecap="round"
      />
      <path
        d="M20.8 45.4c2.8 3.2 6.8 5.2 11.2 5.2s8.4-2 11.2-5.2"
        stroke="rgba(34,211,238,0.18)"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

