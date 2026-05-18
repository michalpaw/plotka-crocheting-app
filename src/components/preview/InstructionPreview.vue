<template>
  <div class="instructions">
    <header>
      <h3>{{ instructions.patternName }}</h3>
      <span class="cpd-pill">{{ instructions.summary.totalRows }} rows · {{ instructions.summary.totalStitches }} sts</span>
    </header>
    <p v-if="instructions.rows.length === 0" class="muted">
      Place some symbols and a row-by-row recipe will appear here.
    </p>
    <section v-for="row in instructions.rows" :key="row.rowNumber" class="row-block">
      <h4>{{ row.label }} <small>({{ row.stitchCount }} sts)</small></h4>
      <ol>
        <li v-for="line in row.lines" :key="line.index">{{ line.text }}</li>
      </ol>
    </section>
    <div class="export-row">
      <ion-button size="small" fill="outline" @click="print">
        <ion-icon slot="start" :icon="printOutline" />
        Print / PDF
      </ion-button>
      <ion-button size="small" fill="outline" @click="copyText">
        <ion-icon slot="start" :icon="copyOutline" />
        Copy
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, toastController } from '@ionic/vue';
import { printOutline, copyOutline } from 'ionicons/icons';
import type { GeneratedInstructions } from '@core/instructions/instructionGenerator';
import { formatAsPlainText } from '@core/instructions/instructionFormatter';
import { pdfExportService } from '@/services/export/pdfExportService';

const props = defineProps<{ instructions: GeneratedInstructions }>();

function print() {
  pdfExportService.printInstructions(props.instructions);
}

async function copyText() {
  const text = formatAsPlainText(props.instructions);
  try {
    await navigator.clipboard.writeText(text);
    (await toastController.create({ message: 'Instructions copied', duration: 1200 })).present();
  } catch {
    (await toastController.create({ message: 'Copy failed', duration: 1200, color: 'danger' })).present();
  }
}
</script>

<style scoped>
.instructions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
h3 {
  margin: 0;
}
.row-block {
  background: var(--cpd-color-surface-soft);
  padding: 8px 12px;
  border-radius: var(--cpd-radius-sm);
}
.row-block h4 {
  margin: 0 0 4px;
  color: var(--cpd-color-primary);
}
.row-block small {
  color: var(--cpd-color-text-soft);
  font-weight: normal;
}
ol {
  margin: 0;
  padding-left: 18px;
}
ol li {
  padding: 2px 0;
}
.muted {
  color: var(--cpd-color-text-soft);
}
.export-row {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
</style>
