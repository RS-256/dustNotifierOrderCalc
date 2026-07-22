<script setup lang="ts">
import { computed } from 'vue'
import { getOrder } from '../lib/notifier'
import type { Coord } from '../lib/notifier'

const props = defineProps<{ coord: Coord }>()

const W = 320
const H = 300
const CX = W / 2
const CY = H / 2 + 10

// isometric projection: X→right-down, Y→up, Z→left-down
const SX = 36 // horizontal step x
const SY = 20 // horizontal step z
const SYV = 32 // vertical step y

function iso(dx: number, dy: number, dz: number) {
  return {
    x: CX + (dx - dz) * SX,
    y: CY + (dx + dz) * SY - dy * SYV,
  }
}

const AXES = [
  { to: iso(1.6, 0, 0), label: '+X', at: iso(1.75, 0, 0) },
  { to: iso(0, 1.6, 0), label: '+Y', at: iso(0, 1.75, 0) },
  { to: iso(0, 0, 1.6), label: '+Z', at: iso(0, 0, 1.75) },
]
const ORIGIN = iso(0, 0, 0)

const order = computed(() => getOrder(props.coord.x, props.coord.y, props.coord.z))

const edges = computed(() =>
  order.value.filter((e) => e.dx || e.dy || e.dz).map((e) => iso(e.dx, e.dy, e.dz)),
)

// nodes sorted back-to-front for painter's algorithm
const nodes = computed(() =>
  order.value
    .map((e, i) => {
      const isCenter = !e.dx && !e.dy && !e.dz
      return {
        step: i + 1,
        label: e.label,
        depth: e.dx + e.dz - e.dy,
        pos: iso(e.dx, e.dy, e.dz),
        isCenter,
        r: isCenter ? 14 : 11,
      }
    })
    .sort((a, b) => a.depth - b.depth),
)
</script>

<template>
  <svg class="iso-viz" :width="W" :height="H">
    <!-- axes -->
    <g v-for="a in AXES" :key="a.label">
      <line
        :x1="ORIGIN.x" :y1="ORIGIN.y" :x2="a.to.x" :y2="a.to.y"
        stroke="#333" stroke-width="1" stroke-dasharray="3,3"
      />
      <text
        :x="a.at.x" :y="a.at.y"
        text-anchor="middle" dominant-baseline="middle"
        fill="#444" font-size="9" font-family="JetBrains Mono, monospace"
      >{{ a.label }}</text>
    </g>

    <!-- edges from center to each neighbour (faint) -->
    <line
      v-for="(p, i) in edges" :key="i"
      :x1="ORIGIN.x" :y1="ORIGIN.y" :x2="p.x" :y2="p.y"
      stroke="#2c2c36" stroke-width="1.5"
    />

    <!-- nodes -->
    <g v-for="n in nodes" :key="n.label">
      <!-- glow for early steps -->
      <circle
        v-if="n.step <= 3"
        :cx="n.pos.x" :cy="n.pos.y" :r="n.r + 5"
        fill="none" stroke="rgba(232,85,154,0.15)" stroke-width="4"
      />
      <circle
        :cx="n.pos.x" :cy="n.pos.y" :r="n.r"
        :fill="n.isCenter ? 'rgba(232,85,154,0.15)' : '#1a1a22'"
        :stroke="n.isCenter ? '#e8559a' : '#3a3a4a'"
        :stroke-width="n.isCenter ? 1.5 : 1"
      />
      <text
        :x="n.pos.x" :y="n.pos.y - 1"
        text-anchor="middle" dominant-baseline="middle"
        :fill="n.isCenter ? '#e8559a' : '#e0e0e8'"
        :font-size="n.isCenter ? 11 : 10"
        font-weight="700" font-family="JetBrains Mono, monospace"
      >{{ n.step }}</text>
      <text
        :x="n.pos.x" :y="n.pos.y + n.r + 9"
        text-anchor="middle"
        :fill="n.isCenter ? '#e8559a' : '#666'"
        font-size="8" font-family="JetBrains Mono, monospace"
      >{{ n.label }}</text>
    </g>

    <!-- coordinate label -->
    <text :x="8" :y="H - 10" fill="#333" font-size="8" font-family="JetBrains Mono, monospace">
      ({{ coord.x }}, {{ coord.y }}, {{ coord.z }})
    </text>
  </svg>
</template>

<style scoped>
.iso-viz {
  border: 1px solid var(--border);
  border-radius: 3px;
  background: var(--bg);
  display: block;
}
</style>
