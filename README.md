# Redstone Notifier Order

**Live site: <https://rs-256.github.io/dustNotifierOrderCalc/>**

A calculator for Minecraft Java Edition's **coordinate-dependent redstone dust update order**.

When a redstone wire's power changes, `DefaultRedstoneWireEvaluator.updatePowerStrength()` inserts 7 `BlockPos` (the wire itself + its 6 neighbours) into a `HashSet` with initial capacity 16. The iteration order of that set — bucket `0→15`, ties broken by insertion order — determines the sequence of `updateNeighborsAt()` calls. Since the bucket comes from `Vec3i.hashCode()`, the update order depends on the wire's **absolute coordinates**, shit behavior.

## Features

- **Coord → Order** — enter a block position, see the exact 7-step notifier firing order, with an isometric visualization.
- **Order → Coord candidates** — enter an observed 7-step sequence, get every position class that produces it, plus its exact probability.
- **[All 60 patterns](https://rs-256.github.io/dustNotifierOrderCalc/docs/)** — a reference table of every possible order with exact counts over the full period.

## How it works

The whole order is a function of `h = x + 31y + 961z mod 2²⁰` alone:

- `Vec3i.hashCode()` is `(y + 31z)·31 + x` with Java int32 overflow.
- `HashMap.hash()` spreads it as `h ^ (h >>> 16)`, and the bucket at capacity 16 is `hash & 15` — so only bits 0–3 and 16–19 of `h` matter.
- Every neighbour shifts `h` by a constant (`±1`, `±31`, `±961`).

Enumerating all 2²⁰ residues therefore gives the **exact** answer — probabilities are counted, not sampled. The 60 pattern counts sum to exactly 2²⁰ and agree with [Earthcomputer's 2³² brute force](https://gist.github.com/Earthcomputer/0dba0fa93549eff694a6d17f1dbbd511) (every count there is 4096× the count here).

The update order repeats with period 2²⁰ = 1,048,576 blocks along each axis; the smallest same-order shifts are diagonal, e.g. `(+31, −1, 0)` and `(0, +31, −1)`.

## Development

Vue 3 + TypeScript + Vite. Two-page site: the main calculator ([index.html](index.html)) and the pattern reference ([docs/index.html](docs/index.html)).

```bash
npm install
npm run dev       # dev server
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build
```

## License

[MIT](LICENSE)
