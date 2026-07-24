<script setup lang="ts">
import { DIRS } from "../lib/notifier"

/** Indices into DIRS, in the observed firing order */
const selected = defineModel< number[] >( { required: true } )

function addDir( idx: number ) {
  if ( selected.value.length >= 7 || selected.value.includes( idx ) ) return
  selected.value = [ ...selected.value, idx ]
}

function removeSlot( i: number ) {
  if ( i >= selected.value.length ) return
  selected.value = selected.value.filter( ( _, j ) => j !== i )
}

function clearOrder() {
  selected.value = []
}
</script>

<template>
  <div class="result-label">Click directions in observed order (1 → 7)</div>
  <div class="order-slots">
    <div
      v-for="i in 7"
      :key="i"
      class="slot"
      :class="{ filled: i - 1 < selected.length }"
      @click="removeSlot(i - 1)"
    >
      <span class="slot-num">{{ i }}</span>
      <template v-if="i - 1 < selected.length">{{ DIRS[selected[i - 1]!]!.label }}</template>
    </div>
  </div>
  <div class="dir-palette">
    <button
      v-for="(d, i) in DIRS"
      :key="d.label"
      class="dir-btn"
      :disabled="selected.includes(i)"
      @click="addDir(i)"
    >
      {{ d.label }}
    </button>
  </div>
  <button class="btn-clear" @click="clearOrder">clear</button>
</template>

<style scoped>
.order-slots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.slot {
  width: 52px;
  height: 52px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  user-select: none;
}
.slot.filled {
  border-color: var(--pink);
  color: var(--text);
}
.slot-num {
  position: absolute;
  top: 3px;
  left: 5px;
  font-size: 0.55rem;
  color: var(--text-dim);
}
.dir-palette {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.dir-btn {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  padding: 6px 12px;
  transition: all 0.15s;
}
.dir-btn:hover:not(:disabled) {
  border-color: var(--pink);
  color: var(--pink);
}
.dir-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.btn-clear {
  background: var(--bg3);
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  padding: 6px 14px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.btn-clear:hover { border-color: var(--pink-dim); }
</style>
