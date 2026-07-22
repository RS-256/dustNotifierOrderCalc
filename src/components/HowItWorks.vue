<template>
  <div class="card how-card">
    <div class="card-title">How it works</div>
    <div class="how-grid">
      <div class="how-block">
        <h3>1 · Vec3i.hashCode()</h3>
        <p><code class="amber">BlockPos</code> extends <code class="amber">Vec3i</code> and inherits its hash. The formula encodes all three axes into a single 32-bit integer.</p>
        <pre><span class="cm">// net.minecraft.core.Vec3i</span>
<span class="kw">public int</span> <span class="fn">hashCode</span>() {
  <span class="kw">return</span> (<span class="fn">getY</span>() + <span class="fn">getZ</span>() * <span class="num">31</span>) * <span class="num">31</span>
       + <span class="fn">getX</span>();
}</pre>
      </div>

      <div class="how-block">
        <h3>2 · HashMap internal spread</h3>
        <p>Java's <code class="amber">HashMap</code> applies an XOR-spread before assigning a bucket. This code is <em>inside the JDK</em>, invisible in Minecraft source.</p>
        <pre><span class="cm">// java.util.HashMap  (JDK internal)</span>
<span class="kw">static final int</span> <span class="fn">hash</span>(<span class="cls">Object</span> key) {
  <span class="kw">int</span> h = key.<span class="fn">hashCode</span>();
  <span class="kw">return</span> h ^ (h >>> <span class="num">16</span>);
}
<span class="cm">// bucket = hash(key) &amp; (capacity−1)
//        = hash(key) &amp; 15</span></pre>
      </div>

      <div class="how-block how-full">
        <h3>3 · DefaultRedstoneWireEvaluator.updatePowerStrength()</h3>
        <p>When power changes, a <code class="amber">HashSet&lt;BlockPos&gt;</code> (initial capacity 16) is built by inserting <b>SELF</b> then <code class="amber">Direction.values()</code> in enum order: <b>DOWN, UP, NORTH, SOUTH, WEST, EAST</b>. Iterating the set — bucket 0→15, ties broken by insertion order — drives the <code class="amber">updateNeighborsAt()</code> calls.</p>
        <pre><span class="cm">// net.minecraft.world.level.redstone.DefaultRedstoneWireEvaluator</span>
<span class="kw">public void</span> <span class="fn">updatePowerStrength</span>(<span class="cls">Level</span> level, <span class="cls">BlockPos</span> pos,
    <span class="cls">BlockState</span> state, <span class="cls">Orientation</span> orientation, <span class="kw">boolean</span> added) {

  <span class="kw">int</span> i = <span class="fn">calculateTargetStrength</span>(level, pos);
  <span class="kw">if</span> (state.<span class="fn">getValue</span>(<span class="cls">RedStoneWireBlock</span>.POWER) != i) {
    <span class="kw">if</span> (level.<span class="fn">getBlockState</span>(pos) == state)
      level.<span class="fn">setBlock</span>(pos, state.<span class="fn">setValue</span>(<span class="cls">RedStoneWireBlock</span>.POWER, i), <span class="num">2</span>);

    <span class="cm">// Insertion order: SELF, DOWN, UP, NORTH, SOUTH, WEST, EAST</span>
    <span class="cls">HashSet</span>&lt;<span class="cls">BlockPos</span>&gt; set = <span class="cls">Sets</span>.<span class="fn">newHashSet</span>();
    set.<span class="fn">add</span>(pos);
    <span class="kw">for</span> (<span class="cls">Direction</span> dir : <span class="cls">Direction</span>.<span class="fn">values</span>())
      set.<span class="fn">add</span>(pos.<span class="fn">relative</span>(dir));

    <span class="cm">// Iteration order = bucket order = coordinate-dependent</span>
    <span class="kw">for</span> (<span class="cls">BlockPos</span> p : set)
      level.<span class="fn">updateNeighborsAt</span>(p, wireBlock);
  }
}</pre>
      </div>

      <div class="how-block how-full">
        <h3>4 · Why 60 patterns across the world</h3>
        <p>Near the origin where <code class="amber">|hashCode| &lt; 65536</code>, the term <code class="amber">h &gt;&gt;&gt; 16</code> is zero and the XOR has no effect, producing 26 distinct patterns that repeat with period 16. For large coordinates where <code class="amber">|hashCode| ≥ 65536</code>, upper bits bleed into the lower 16 via XOR, unlocking 34 additional rare patterns — totalling <b>60</b>. About 97% of all wire positions share just 6 patterns; the rarest appears in only ~0.005% of locations.</p>
        <p>→ <a class="pink-link" href="docs/">See all 60 patterns with exact probabilities.</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.how-card { padding: 28px; }
.how-card .card-title { margin-bottom: 20px; }
.how-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) {
  .how-grid { grid-template-columns: 1fr; }
}
.how-block {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 16px;
}
.how-full { grid-column: 1 / -1; }
.how-block h3 {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--pink);
  margin-bottom: 10px;
}
.how-block p {
  font-size: 0.72rem;
  color: var(--text-mid);
  line-height: 1.8;
  margin-bottom: 10px;
}
.how-block p:last-child { margin-bottom: 0; }
.amber { color: var(--amber); }
.pink-link { color: var(--pink); }
pre {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.67rem;
  color: var(--text-mid);
  line-height: 1.75;
  overflow-x: auto;
  margin-top: 8px;
}
pre .kw { color: #c792ea; }
pre .cls { color: var(--amber); }
pre .fn { color: #82aaff; }
pre .cm { color: #4a5568; font-style: italic; }
pre .num { color: #f78c6c; }
</style>
