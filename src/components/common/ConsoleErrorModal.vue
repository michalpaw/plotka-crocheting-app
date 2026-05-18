<template>
  <Teleport to="body">
    <!-- floating badge when modal is closed but errors exist -->
    <button
      v-if="!isVisible && entries.length > 0"
      class="cerr-badge"
      @click="show"
      :title="`${entries.length} błąd(ów) konsoli`"
    >
      ⚠ {{ entries.length }}
    </button>

    <!-- error modal -->
    <div v-if="isVisible" class="cerr-overlay" @click.self="hide">
      <div class="cerr-dialog" role="dialog" aria-modal="true" aria-label="Błędy konsoli">
        <div class="cerr-header">
          <span class="cerr-title">⚠ Błędy konsoli ({{ entries.length }})</span>
          <button class="cerr-close" @click="hide" aria-label="Zamknij">✕</button>
        </div>

        <textarea
          class="cerr-body"
          readonly
          :value="errorsText"
          spellcheck="false"
        />

        <div class="cerr-footer">
          <button class="cerr-btn" @click="clear">Wyczyść</button>
          <button class="cerr-btn cerr-btn--primary" @click="hide">Zamknij</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConsoleErrors } from '@/utils/useConsoleErrors';

const { entries, isVisible, clear, show, hide } = useConsoleErrors();

const LEVEL_LABEL: Record<string, string> = {
  error: 'ERROR',
  warn:  'WARN ',
  unhandled: 'UNHDL',
};

const errorsText = computed(() =>
  entries.value
    .map(e => `[${e.timestamp}] [${LEVEL_LABEL[e.level]}] ${e.message}`)
    .join('\n\n')
);
</script>

<style scoped>
.cerr-badge {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9998;
  padding: 6px 12px;
  background: var(--cpd-color-danger, #b13838);
  color: #fff;
  border: none;
  border-radius: var(--cpd-radius-md, 12px);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--cpd-shadow-md);
  transition: opacity 0.15s;
}
.cerr-badge:hover { opacity: 0.88; }

.cerr-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(43, 37, 64, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.cerr-dialog {
  background: var(--cpd-color-surface, #fff);
  border: 1px solid var(--cpd-color-border, #ecd1d1);
  border-radius: var(--cpd-radius-lg, 18px);
  box-shadow: var(--cpd-shadow-md);
  display: flex;
  flex-direction: column;
  width: min(720px, 100%);
  max-height: 80vh;
  overflow: hidden;
}

.cerr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--cpd-color-border, #ecd1d1);
  background: var(--cpd-color-surface-soft, #fce8e8);
}

.cerr-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--cpd-color-danger, #b13838);
}

.cerr-close {
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: var(--cpd-color-text-soft, #8a5566);
  padding: 2px 6px;
  border-radius: var(--cpd-radius-sm, 6px);
  transition: background 0.12s;
}
.cerr-close:hover { background: var(--cpd-color-border, #ecd1d1); }

.cerr-body {
  flex: 1;
  min-height: 200px;
  padding: 14px 16px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--cpd-color-text, #3d2030);
  background: var(--cpd-color-bg, #fdf6f3);
  border: none;
  resize: none;
  overflow-y: auto;
  outline: none;
  white-space: pre;
}

.cerr-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--cpd-color-border, #ecd1d1);
}

.cerr-btn {
  padding: 7px 18px;
  border-radius: var(--cpd-radius-md, 12px);
  border: 1px solid var(--cpd-color-border, #ecd1d1);
  background: var(--cpd-color-surface, #fff);
  color: var(--cpd-color-text, #3d2030);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;
}
.cerr-btn:hover { background: var(--cpd-color-surface-soft, #fce8e8); }

.cerr-btn--primary {
  background: var(--cpd-color-primary, #da62b0);
  color: #fff;
  border-color: var(--cpd-color-primary, #da62b0);
}
.cerr-btn--primary:hover { background: var(--cpd-color-primary-hover, #c44f9c); }
</style>
