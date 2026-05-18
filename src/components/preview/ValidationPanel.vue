<template>
  <div class="validation">
    <h4>Validation</h4>
    <p v-if="messages.length === 0" class="ok">Looks good — no warnings.</p>
    <ul v-else>
      <li v-for="(m, i) in messages" :key="i" :class="m.severity">
        <span class="dot" />
        <span>{{ m.message }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ValidationMessage } from '@core/validation/patternValidator';
defineProps<{ messages: ValidationMessage[] }>();
</script>

<style scoped>
.validation h4 {
  margin: 0 0 6px;
  color: var(--cpd-color-primary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ok {
  color: var(--cpd-color-accent);
  margin: 0;
  font-size: 0.9rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--cpd-color-surface-soft);
}
li.error { background: #fdecec; color: #8b1f1f; }
li.warning { background: #fff4e0; color: #874a05; }
li.info { background: #eef4ff; color: #1f3a8a; }
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  background: currentColor;
  flex: none;
}
</style>
