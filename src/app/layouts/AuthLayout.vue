<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding auth-bg">
      <div class="auth-shell">
        <div class="auth-brand">
          <div class="auth-brand-mark">
            <svg viewBox="0 0 64 64" width="56" height="56">
              <circle cx="32" cy="32" r="30" fill="#7a4ec9" />
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
  --background: linear-gradient(160deg, #f6f1ff 0%, #fdfbff 50%, #fbe8df 100%);
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
  font-size: 2.4rem;
  margin: 16px 0 8px;
  color: #2b2540;
}
.auth-brand p {
  color: #5b5375;
  font-size: 1.05rem;
  max-width: 460px;
}
.auth-brand-mark {
  background: #fff;
  display: inline-flex;
  padding: 8px;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(43, 37, 64, 0.08);
}
.auth-panel {
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(43, 37, 64, 0.08);
  border: 1px solid #ece6f5;
}
</style>
