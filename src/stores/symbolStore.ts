import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DEFAULT_SYMBOL_LIBRARY } from '@core/symbols/defaultSymbolLibrary';
import type { SymbolDefinition } from '@core/symbols/symbolTypes';

export const useSymbolStore = defineStore('symbols', () => {
  const symbols = ref<SymbolDefinition[]>([...DEFAULT_SYMBOL_LIBRARY]);

  const byCategory = computed(() => {
    const grouped: Record<string, SymbolDefinition[]> = {};
    for (const s of symbols.value) {
      (grouped[s.category] ||= []).push(s);
    }
    return grouped;
  });

  function getById(id: string): SymbolDefinition | undefined {
    return symbols.value.find((s) => s.id === id);
  }

  function getByShortcut(key: string): SymbolDefinition | undefined {
    const upper = key.toUpperCase();
    return symbols.value.find((s) => s.defaultShortcut?.toUpperCase() === upper);
  }

  return { symbols, byCategory, getById, getByShortcut };
});
