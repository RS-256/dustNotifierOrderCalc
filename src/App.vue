<script setup lang="ts">
import { computed, ref } from 'vue'
import CandidateList from './components/CandidateList.vue'
import HowItWorks from './components/HowItWorks.vue'
import IsoViz from './components/IsoViz.vue'
import NotifierInfo from './components/NotifierInfo.vue'
import ReversePicker from './components/ReversePicker.vue'
import SequenceView from './components/SequenceView.vue'
import { DIRS, findCandidates, getOrder } from './lib/notifier'
import type { Coord } from './lib/notifier'

type Mode = 'forward' | 'reverse'

const mode = ref<Mode>('forward')
const inX = ref<number | null>(0)
const inY = ref<number | null>(64)
const inZ = ref<number | null>(0)
const selected = ref<number[]>([])

const coord = computed<Coord>(() => ({
  x: inX.value ?? 0,
  y: inY.value ?? 0,
  z: inZ.value ?? 0,
}))

const forwardOrder = computed(() => getOrder(coord.value.x, coord.value.y, coord.value.z))

const reverseResult = computed(() => {
  if (selected.value.length < 7) return null
  return findCandidates(selected.value.map((i) => DIRS[i]!))
})

const reverseOrderStr = computed(() => selected.value.map((i) => DIRS[i]!.label).join(', '))

/** Coordinate whose order is drawn in the viz: input coord (forward) or nearest candidate (reverse) */
const vizCoord = computed<Coord | null>(() => {
  if (mode.value === 'forward') return coord.value
  return reverseResult.value?.matches[0]?.example ?? null
})

function setMode(m: Mode) {
  mode.value = m
  selected.value = []
}
</script>

<template>
  <header>
    <h1>Redstone <span>Notifier</span> Order</h1>
    <p>Java Edition 1.21.11・redstone dust update order analysis</p>
    <a class="docs-link" href="docs/">All 60 patterns &amp; probabilities →</a>
  </header>

  <div class="container">
    <div class="card main-card">
      <div class="card-title">Mode</div>
      <div class="tabs">
        <button class="tab" :class="{ active: mode === 'forward' }" @click="setMode('forward')">
          Coord → Order
        </button>
        <button class="tab" :class="{ active: mode === 'reverse' }" @click="setMode('reverse')">
          Order → Coord candidates
        </button>
      </div>

      <div v-if="mode === 'forward'" class="coord-row">
        <div class="coord-field">
          <label for="inX">X</label><input id="inX" v-model.number="inX" type="number" />
        </div>
        <div class="coord-field">
          <label for="inY">Y</label><input id="inY" v-model.number="inY" type="number" />
        </div>
        <div class="coord-field">
          <label for="inZ">Z</label><input id="inZ" v-model.number="inZ" type="number" />
        </div>
      </div>

      <ReversePicker v-else v-model="selected" />

      <div v-if="mode === 'forward' || reverseResult" class="result-area">
        <SequenceView v-if="mode === 'forward'" :order="forwardOrder" :coord="coord" />
        <CandidateList
          v-else-if="reverseResult"
          :result="reverseResult"
          :order-str="reverseOrderStr"
        />
        <div v-if="vizCoord" class="viz-wrap">
          <IsoViz :coord="vizCoord" />
        </div>
      </div>
    </div>

    <HowItWorks />
    <NotifierInfo />
  </div>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 52px;
}
header h1 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: clamp(1.7rem, 4.5vw, 2.8rem);
  font-weight: 900;
  letter-spacing: 0.01em;
  line-height: 1.1;
}
header h1 span { color: var(--pink); }
header p {
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}
.docs-link {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.7rem;
  color: var(--pink);
  text-decoration: none;
  border: 1px solid var(--pink-dim);
  border-radius: 3px;
  padding: 4px 14px;
  letter-spacing: 0.08em;
  transition: background 0.15s;
}
.docs-link:hover { background: var(--pink-subtle); }

.container {
  max-width: 920px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
}
.main-card { padding: 28px; }
.main-card .card-title { margin-bottom: 20px; }

.tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 3px;
}
.tab {
  flex: 1;
  padding: 9px;
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.15s;
  letter-spacing: 0.04em;
}
.tab.active {
  background: var(--pink);
  color: white;
}

.coord-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.coord-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 80px;
}
.coord-field label {
  font-size: 0.68rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
}
.coord-field input {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.coord-field input:focus { border-color: var(--pink); }

.result-area { margin-top: 24px; }
.viz-wrap {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
