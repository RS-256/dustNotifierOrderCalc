<script setup lang="ts">
import type { Coord, OrderEntry } from '../lib/notifier'

defineProps<{
  order: OrderEntry[]
  coord: Coord
}>()
</script>

<template>
  <div class="result-label">
    Notifier update order for ({{ coord.x }}, {{ coord.y }}, {{ coord.z }})
  </div>
  <div class="sequence">
    <div
      v-for="(e, i) in order"
      :key="e.label"
      class="seq-item"
      :class="{ highlight: e.label === 'O' }"
    >
      <span class="step-num">{{ i + 1 }}</span>
      <span class="dir-label">{{ e.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.sequence {
  display: flex;
  gap: 0;
  align-items: stretch;
}
.seq-item {
  flex: 1;
  min-width: 0;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-right: none;
  padding: 14px 8px;
  text-align: center;
  position: relative;
}
.seq-item:last-child {
  border-right: 1px solid var(--border);
  border-radius: 0 3px 3px 0;
}
.seq-item:first-child { border-radius: 3px 0 0 3px; }
.step-num {
  font-size: 0.55rem;
  color: var(--text-dim);
  display: block;
  margin-bottom: 6px;
}
.dir-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}
.seq-item.highlight {
  background: var(--pink-subtle);
  border-color: var(--pink-dim);
}
.seq-item.highlight .dir-label { color: var(--pink); }

@media (max-width: 500px) {
  .sequence { flex-wrap: wrap; }
  .seq-item {
    flex: 0 0 calc(25% - 6px);
    border-right: 1px solid var(--border) !important;
    border-radius: 3px !important;
    margin: 2px;
  }
}
</style>
