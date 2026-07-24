<script setup lang="ts">
import PatternTable from "./components/PatternTable.vue"
</script>

<template>
  <header>
    <h1>All <span>60</span> Notifier Patterns</h1>
    <p>Java Edition 1.21.11 · exact counts over the full 2<sup>20</sup>-block period</p>
    <a class="back-link" href="../">← back to tool</a>
  </header>
  <div class="container">
    <div class="card docs-card">
      <div class="card-title">Pattern reference</div>
      <div class="note">
        Direction labels: <b>O</b> = wire itself, <b>±X/Y/Z</b> = neighbours.<br />
        Because the order depends only on <code>h = x + 31y + 961z</code>, and one step in Z shifts <code>h</code> by 961, every pattern — including the rare ones — is reachable within a few hundred blocks of spawn. All example coords below are given at <b>y = 0</b>, within |x| ≤ 418 and |z| ≤ 546.<br />
        <b>Periodicity along each axis.</b> A bucket is <code>(h &amp; 15) ^ ((h &gt;&gt;&gt; 16) &amp; 15)</code>, so it depends only on bits 0–3 and 16–19 of <code>h</code> — i.e. on <code>h mod 2<sup>20</sup></code>. All 7 offsets shift <code>h</code> by a constant, so the whole update order is a function of <code>h mod 2<sup>20</sup></code> alone. One step in X / Y / Z shifts <code>h</code> by 1 / 31 / 961, and 31 and 961 are odd (coprime to 2<sup>20</sup>), so along <b>every axis</b> the order repeats with the same minimal period:<br />
        &nbsp;&nbsp;<code>s = 2<sup>20</sup> = 1,048,576</code> blocks in X, &nbsp;<code>t = 2<sup>20</sup> = 1,048,576</code> blocks in Y, &nbsp;<code>u = 2<sup>20</sup> = 1,048,576</code> blocks in Z.<br />
        So any block <code>(x, y, z)</code> has the <b>identical</b> update order at every <code>(x + a·s, y + b·t, z + c·u)</code>, for all integers <code>a, b, c</code> — e.g. <code>(+1s, +2t, +3u)</code> is the same order as the origin. (The single <em>smallest</em> same-order shift is diagonal rather than axis-aligned — e.g. <code>(+31, −1, 0)</code> or <code>(0, +31, −1)</code>, since a 31-block move in one axis exactly cancels a 1-block move in the next.)<br />
        <b>Probabilities are exact, not sampled.</b> Exhaustively enumerating that single 2<sup>20</sup>-block period gives each order's exact count, shown as a fraction under the percentage (hover for the reduced form). The 60 counts sum to exactly 2<sup>20</sup>, and match <a class="pink-link" href="https://gist.github.com/Earthcomputer/0dba0fa93549eff694a6d17f1dbbd511">Earthcomputer's 2<sup>32</sup> brute force</a> exactly — every count there is 4096× the count here.
      </div>
      <PatternTable />
    </div>
  </div>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 44px;
}
header h1 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 900;
}
header h1 span { color: var(--pink); }
header p {
  margin-top: 8px;
  color: var(--text-dim);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}
.back-link {
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
.back-link:hover { background: var(--pink-subtle); }

.container {
  max-width: 960px;
  margin: 0 auto;
}
.docs-card { padding: 24px; }
.docs-card .card-title { margin-bottom: 16px; }

.note {
  font-size: 0.7rem;
  color: var(--text-mid);
  line-height: 1.75;
  margin-bottom: 20px;
  padding: 12px 14px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
}
.note b { color: var(--amber); }
.pink-link { color: var(--pink); }
</style>
