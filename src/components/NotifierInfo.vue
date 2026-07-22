<template>
  <div class="card notifier-card">
    <div class="card-title">What is a notifier?</div>
    <div class="notifier-grid">
      <div class="notifier-block">
        <h3>Notifier</h3>
        <p>A <b class="bright">notifier</b> is a block position that acts as the <em>source</em> of a neighbor update. When <code class="amber">level.updateNeighborsAt(notifier, wireBlock)</code> is called, it triggers updates on all 6 faces of the notifier in a <b class="bright">fixed, constant order</b>: <span class="amber">−X, +X, −Y, +Y, −Z, +Z</span>.</p>
        <p>This per-notifier order is always the same regardless of world position. The coordinate dependence comes entirely from <em>which position becomes the notifier, and in what sequence the 7 notifiers fire</em>.</p>
      </div>

      <div class="notifier-block">
        <h3>Where the coordinate dependence enters</h3>
        <p>The 7 candidate notifiers (wire + 6 neighbours) are stored in a <code class="amber">HashSet</code>. Iteration order over a <code class="amber">HashSet</code> follows bucket index, and each bucket index is derived from <code class="amber">(hashCode ^ (hashCode &gt;&gt;&gt; 16)) &amp; 15</code>. Because <code class="amber">hashCode</code> is a function of absolute world coordinates, the firing order of the 7 notifiers — and therefore the sequence of all resulting neighbor updates — is <b class="bright">coordinate-dependent</b>.</p>
      </div>

      <div class="notifier-block notifier-full">
        <h3>Summary of the update sequence</h3>
        <div class="notifier-flow">
          <div class="nf-step">
            <span class="nf-num">1</span>
            <span class="nf-text">Wire's power changes → <code>updatePowerStrength()</code> called</span>
          </div>
          <div class="nf-arrow">↓</div>
          <div class="nf-step">
            <span class="nf-num">2</span>
            <span class="nf-text">7 positions (self + ±X/Y/Z) placed into <code>HashSet</code> — order determined by <code>hashCode</code> of each absolute position</span>
          </div>
          <div class="nf-arrow">↓</div>
          <div class="nf-step">
            <span class="nf-num">3</span>
            <span class="nf-text">Each position fires as a <b>notifier</b> in HashSet iteration order <span class="dim">(coordinate-dependent)</span></span>
          </div>
          <div class="nf-arrow">↓</div>
          <div class="nf-step">
            <span class="nf-num">4</span>
            <span class="nf-text">Each notifier updates its 6 faces in <b>fixed order</b>: <span class="amber">−X, +X, −Y, +Y, −Z, +Z</span> <span class="dim">(always constant)</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifier-card { padding: 28px; }
.notifier-card .card-title { margin-bottom: 20px; }
.notifier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) {
  .notifier-grid { grid-template-columns: 1fr; }
}
.notifier-block {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 16px;
}
.notifier-full { grid-column: 1 / -1; }
.notifier-block h3 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--pink);
  margin-bottom: 10px;
}
.notifier-block p {
  font-size: 0.72rem;
  color: var(--text-mid);
  line-height: 1.8;
  margin-bottom: 8px;
}
.notifier-block p:last-child { margin-bottom: 0; }
.amber { color: var(--amber); }
.bright { color: var(--text); }
.dim { color: var(--text-dim); }

.notifier-flow {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.nf-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 12px 14px;
}
.nf-num {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--pink-subtle);
  border: 1px solid var(--pink-dim);
  color: var(--pink);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.nf-text {
  font-size: 0.72rem;
  color: var(--text-mid);
  line-height: 1.75;
}
.nf-text code { color: var(--amber); }
.nf-arrow {
  text-align: center;
  color: var(--border);
  font-size: 1rem;
  line-height: 1.2;
  padding: 2px 0;
}
</style>
