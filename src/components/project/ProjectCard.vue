<template>
  <a class="cpd-project-card" :href="href" @click.prevent="onOpen">
    <div class="card-top">
      <span class="cpd-pill">{{ typeLabel }}</span>
      <span class="muted">{{ updated }}</span>
    </div>
    <h3 class="card-title">{{ project.name }}</h3>
    <p v-if="project.description" class="card-desc">{{ project.description }}</p>
    <div class="card-meta">
      <span class="muted">v{{ project.version }}</span>
      <span class="muted">·</span>
      <span class="muted">{{ project.syncStatus.replace('_', ' ') }}</span>
    </div>
    <div class="card-actions">
      <ion-button size="small" fill="solid" @click.stop="onEdit">Open</ion-button>
      <ion-button size="small" fill="outline" @click.stop="$emit('duplicate', project.id)">Duplicate</ion-button>
      <ion-button size="small" fill="clear" color="medium" @click.stop="$emit('rename', project.id)">Rename</ion-button>
      <ion-button size="small" fill="clear" color="danger" @click.stop="$emit('archive', project.id)">Delete</ion-button>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton } from '@ionic/vue';
import type { AnyProject } from '@core/model/project';
import { formatRelative } from '@/utils/dates';
import { useRouter } from 'vue-router';

const props = defineProps<{ project: AnyProject }>();
defineEmits<{
  (e: 'duplicate', id: string): void;
  (e: 'rename', id: string): void;
  (e: 'archive', id: string): void;
}>();

const router = useRouter();

const typeLabel = computed(() =>
  props.project.projectType === 'symbol_pattern' ? 'Symbol pattern' : 'Color grid'
);
const updated = computed(() => `Updated ${formatRelative(props.project.updatedAt)}`);
const href = computed(() => `#/projects/${props.project.id}`);

function onOpen() {
  router.push(`/projects/${props.project.id}`);
}
function onEdit() {
  const path = props.project.projectType === 'symbol_pattern' ? 'editor' : 'grid';
  router.push(`/projects/${props.project.id}/${path}`);
}
</script>

<style scoped>
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-title {
  font-size: 1.15rem;
  margin: 0 0 6px;
}
.card-desc {
  color: var(--cpd-color-text-soft);
  margin: 0 0 12px;
  font-size: 0.9rem;
  min-height: 1.2em;
}
.card-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.muted {
  color: var(--cpd-color-text-soft);
  font-size: 0.8rem;
}
</style>
