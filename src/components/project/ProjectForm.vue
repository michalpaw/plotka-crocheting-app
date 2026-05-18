<template>
  <form @submit.prevent="onSubmit">
    <ion-segment v-model="type" class="ion-margin-bottom">
      <ion-segment-button value="symbol_pattern">
        <ion-label>Symbol pattern</ion-label>
      </ion-segment-button>
      <ion-segment-button value="grid_pattern">
        <ion-label>Color grid</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-item lines="full">
      <ion-label position="stacked">Name</ion-label>
      <ion-input v-model="name" required placeholder="e.g. Spring scarf" />
    </ion-item>
    <ion-item lines="full">
      <ion-label position="stacked">Description (optional)</ion-label>
      <ion-textarea v-model="description" :rows="3" placeholder="Short note about this pattern" />
    </ion-item>

    <template v-if="type === 'grid_pattern'">
      <div class="cpd-row" style="margin-top: 12px">
        <ion-item lines="full" style="flex: 1">
          <ion-label position="stacked">Rows</ion-label>
          <ion-input v-model.number="rows" type="number" min="2" max="500" />
        </ion-item>
        <ion-item lines="full" style="flex: 1">
          <ion-label position="stacked">Columns</ion-label>
          <ion-input v-model.number="columns" type="number" min="2" max="500" />
        </ion-item>
      </div>
    </template>

    <ion-button type="submit" expand="block" :disabled="!name.trim() || saving" class="ion-margin-top">
      <span v-if="!saving">Create project</span>
      <ion-spinner v-else name="dots" />
    </ion-button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonSpinner
} from '@ionic/vue';
import type { ProjectType } from '@core/model/project';

const props = defineProps<{ initialType?: ProjectType }>();

const emit = defineEmits<{
  (
    e: 'submit',
    payload: { name: string; description: string; type: ProjectType; rows: number; columns: number }
  ): void;
}>();

const type = ref<ProjectType>(props.initialType ?? 'symbol_pattern');
const name = ref('');
const description = ref('');
const rows = ref(50);
const columns = ref(50);
const saving = ref(false);

async function onSubmit() {
  saving.value = true;
  try {
    emit('submit', {
      name: name.value.trim(),
      description: description.value.trim(),
      type: type.value,
      rows: rows.value,
      columns: columns.value
    });
  } finally {
    saving.value = false;
  }
}
</script>
