<script setup lang="ts">
import { formatPercent } from '../lib/notifier'
import type { ReverseResult } from '../lib/notifier'

defineProps<{
  result: ReverseResult
  orderStr: string
}>()
</script>

<template>
  <div class="result-label">Candidates for order: {{ orderStr }}</div>

  <div v-if="!result.count" class="no-result">
    No candidates found. This order may not occur in vanilla Minecraft.
  </div>

  <template v-else>
    <div class="info-bar">
      <span>
        Exact match: <b>{{ result.count.toLocaleString('en-US') }}</b> / 1,048,576 h-classes
        ({{ formatPercent(result.count) }}% of all positions)
      </span>
      <span>
        equivalent shifts: <b>±(31, −1, 0)</b>, <b>±(0, 31, −1)</b>,
        <b>±(2<sup>20</sup>, 0, 0)</b>
      </span>
    </div>
    <div class="candidate-list">
      <div v-for="(m, i) in result.matches" :key="m.h" class="candidate-item">
        <span class="candidate-idx">#{{ i + 1 }}</span>
        <code>({{ m.example.x }}, {{ m.example.y }}, {{ m.example.z }})</code>
        <span class="region-tag">h ≡ {{ m.h }} (mod 2<sup>20</sup>)</span>
      </div>
    </div>
    <div v-if="result.matches.length < result.count" class="more-note">
      showing the {{ result.matches.length }} nearest of {{ result.count.toLocaleString('en-US') }}
      h-classes — every listed coord extends via the equivalent shifts above
    </div>
  </template>
</template>

<style scoped>
.info-bar {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 10px 14px;
  font-size: 0.7rem;
  color: var(--text-mid);
  margin-bottom: 12px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.info-bar span b { color: var(--amber); }
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 340px;
  overflow-y: auto;
}
.candidate-list::-webkit-scrollbar { width: 4px; }
.candidate-list::-webkit-scrollbar-track { background: var(--bg); }
.candidate-list::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.candidate-item {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 9px 14px;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.1s;
}
.candidate-item:hover { border-color: var(--pink-dim); }
.candidate-idx {
  color: var(--text-dim);
  font-size: 0.62rem;
  min-width: 24px;
}
.candidate-item code {
  color: var(--green);
  flex: 1;
}
.region-tag {
  font-size: 0.58rem;
  padding: 2px 6px;
  border-radius: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-dim);
}
.more-note {
  margin-top: 8px;
  font-size: 0.62rem;
  color: var(--text-dim);
  letter-spacing: 0.04em;
}
.no-result {
  color: var(--text-dim);
  font-size: 0.85rem;
  padding: 20px 0;
  text-align: center;
}
</style>
