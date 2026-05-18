<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding auth-bg">
      <div class="auth-shell">
        <div class="auth-brand">
          <div class="auth-brand-mark">
            <svg viewBox="0 0 64 64" width="56" height="56">
              <circle cx="32" cy="32" r="30" fill="#da62b0" />
              <path
                d="M16 38c4-10 10-14 16-14s12 4 16 14"
                fill="none"
                stroke="#fff"
                stroke-width="3"
                stroke-linecap="round"
              />
              <circle cx="32" cy="24" r="3" fill="#fff" />
            </svg>
          </div>
          <h1>Crochet Pattern Designer</h1>
          <p>Design, validate and preview crochet patterns — locally on every device.</p>
        </div>
        <div class="auth-panel">
          <router-view />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>

<style scoped>
.auth-bg {
  --background: linear-gradient(160deg, #fdf6f3 0%, #ffffff 50%, #fadcdc 100%);
}
.auth-shell {
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 40px;
  align-items: center;
  min-height: 80vh;
  padding: 24px;
}
@media (max-width: 820px) {
  .auth-shell {
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 24px;
  }
}
.auth-brand h1 {
  font-family: var(--cpd-font-heading);
  font-size: 2.4rem;
  margin: 16px 0 8px;
  color: var(--cpd-color-text);
  letter-spacing: -0.01em;
}
.auth-brand p {
  color: var(--cpd-color-text-soft);
  font-size: 1.05rem;
  max-width: 460px;
  line-height: 1.6;
}
.auth-brand-mark {
  background: var(--cpd-color-surface);
  display: inline-flex;
  padding: 10px;
  border-radius: var(--cpd-radius-lg);
  box-shadow: var(--cpd-shadow-md);
  border: 1px solid var(--cpd-color-border);
}
.auth-panel {
  background: var(--cpd-color-surface);
  padding: 32px;
  border-radius: var(--cpd-radius-lg);
  box-shadow: var(--cpd-shadow-lg);
  border: 1px solid var(--cpd-color-border);
}
</style>
