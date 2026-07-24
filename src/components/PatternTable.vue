<script setup lang="ts">
import { PATTERNS } from "../data/patterns"
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Update order</th>
        <th>Probability</th>
        <th>Example coord</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in PATTERNS" :key="p.rank" class="pat-row">
        <td class="rank">{{ p.rank }}</td>
        <td><span class="order-str">{{ p.order }}</span></td>
        <td class="pct-cell">
          <div class="bar-wrap"><div class="bar" :style="{ width: p.barWidth + '%' }"></div></div>
          <span class="pct-val">{{ p.pct }}%</span>
          <span class="frac" :title="`reduced: ${p.fraction.reducedNum}/${p.fraction.reducedDen}`">
            {{ p.fraction.num }}<span class="frac-sl">/</span>{{ p.fraction.den }}
          </span>
        </td>
        <td class="ex-cell">
          <code>({{ p.example.x }}, {{ p.example.y }}, {{ p.example.z }})</code>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
thead tr { border-bottom: 1px solid var(--border); }
th {
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  padding: 8px 10px;
  text-align: left;
  font-weight: 400;
}
td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--bg3);
  vertical-align: middle;
}
tr:last-child td { border-bottom: none; }
tr.pat-row:hover td { background: rgba(255, 255, 255, 0.02); }

.rank {
  color: var(--text-dim);
  font-size: 0.7rem;
  min-width: 28px;
}
.order-str {
  font-size: 0.8rem;
  color: var(--text);
  letter-spacing: 0.04em;
}
.pct-cell { min-width: 190px; }
.bar-wrap {
  height: 3px;
  background: var(--bg3);
  border-radius: 2px;
  margin-bottom: 4px;
  width: 120px;
}
.bar {
  height: 3px;
  background: var(--pink);
  border-radius: 2px;
}
.pct-val {
  font-size: 0.7rem;
  color: var(--text-mid);
}
.frac {
  display: block;
  margin-top: 2px;
  font-size: 0.62rem;
  color: var(--text-dim);
  letter-spacing: 0.02em;
  cursor: help;
}
.frac-sl {
  color: var(--pink-dim);
  padding: 0 1px;
}
.ex-cell code {
  color: var(--green);
  font-size: 0.72rem;
}

@media (max-width: 600px) {
  .ex-cell { display: none; }
  .bar-wrap { width: 80px; }
  .pct-cell { min-width: 0; }
  th,
  td { padding: 8px 6px; }
  .frac { font-size: 0.58rem; }
}
</style>
