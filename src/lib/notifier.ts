/**
 * Core model of Minecraft's coordinate-dependent redstone notifier order.
 *
 * When a wire's power changes, DefaultRedstoneWireEvaluator.updatePowerStrength()
 * inserts 7 BlockPos (self + 6 neighbours) into a HashSet with initial capacity 16.
 * Iteration order over that set — bucket 0→15, ties broken by insertion order —
 * determines the sequence of updateNeighborsAt() calls.
 */

export interface Dir {
  readonly label: string
  readonly dx: number
  readonly dy: number
  readonly dz: number
}

export interface OrderEntry extends Dir {
  readonly bucket: number
}

export interface Coord {
  readonly x: number
  readonly y: number
  readonly z: number
}

/** HashSet insertion order: SELF, then Direction.values() = DOWN, UP, NORTH, SOUTH, WEST, EAST */
export const DIRS: readonly Dir[] = [
  { label: 'O', dx: 0, dy: 0, dz: 0 },
  { label: '-Y', dx: 0, dy: -1, dz: 0 },
  { label: '+Y', dx: 0, dy: 1, dz: 0 },
  { label: '-Z', dx: 0, dy: 0, dz: -1 },
  { label: '+Z', dx: 0, dy: 0, dz: 1 },
  { label: '-X', dx: -1, dy: 0, dz: 0 },
  { label: '+X', dx: 1, dy: 0, dz: 0 },
]

/** Vec3i.hashCode(): (y + z*31)*31 + x, with Java int32 overflow semantics */
export function hashcode(x: number, y: number, z: number): number {
  return (Math.imul(y + Math.imul(z, 31), 31) + x) | 0
}

/** java.util.HashMap.hash(): h ^ (h >>> 16) */
export function mapHash(h: number): number {
  const u = h >>> 0
  return (u ^ (u >>> 16)) | 0
}

/** HashMap bucket index at initial capacity 16: hash(key) & 15 */
export function bucket(x: number, y: number, z: number): number {
  return (mapHash(hashcode(x, y, z)) >>> 0) & 15
}

/** Notifier firing order for the wire at (bx, by, bz): buckets 0→15, insertion order within a bucket */
export function getOrder(bx: number, by: number, bz: number): OrderEntry[] {
  const buckets: OrderEntry[][] = Array.from({ length: 16 }, () => [])
  for (const d of DIRS) {
    const b = bucket(bx + d.dx, by + d.dy, bz + d.dz)
    buckets[b]!.push({ ...d, bucket: b })
  }
  return buckets.flat()
}

/**
 * The whole update order is a function of h = x + 31y + 961z modulo 2^20 alone:
 * a bucket is (h & 15) ^ ((h >>> 16) & 15), which reads only bits 0–3 and 16–19,
 * and every neighbour shifts h by a constant. So enumerating the 2^20 residues
 * gives the exact, complete answer to the reverse question.
 */
export const PERIOD = 1 << 20

/** Hash shift per direction, in DIRS order: dx + 31·dy + 961·dz */
const DELTAS = DIRS.map((d) => d.dx + 31 * d.dy + 961 * d.dz)

/** How many h-classes to surface in the UI (nearest examples first) */
const MAX_MATCHES_SHOWN = 100

export interface ReverseMatch {
  /** Signed representative of the h-class: h ≡ this value (mod 2^20) */
  h: number
  /** Example coordinate at y = 0 with small |x|, |z| solving x + 961z = h */
  example: Coord
}

export interface ReverseResult {
  /** Exact number of matching h-classes out of 2^20 (= exact probability numerator) */
  count: number
  /** Matching classes with nearest examples first, capped at MAX_MATCHES_SHOWN */
  matches: ReverseMatch[]
}

/**
 * Find all positions whose notifier order matches the observed 7-step sequence.
 *
 * A residue matches iff the stable-sort key (bucket, insertion index) is strictly
 * increasing along the observed sequence. Every matching position in the world is
 * example + a·(31,−1,0) + b·(0,31,−1) + c·(2^20,0,0) — the generators of the
 * lattice that keeps h mod 2^20 fixed.
 */
export function findCandidates(observed: readonly Dir[]): ReverseResult {
  // observed dir → its insertion index in DIRS (= HashSet insertion order)
  const obsIdx = observed.map((o) =>
    DIRS.findIndex((d) => d.dx === o.dx && d.dy === o.dy && d.dz === o.dz),
  )

  const residues: number[] = []
  for (let hh = 0; hh < PERIOD; hh++) {
    let prev = -1
    let ok = true
    for (let i = 0; i < 7; i++) {
      const di = obsIdx[i]!
      let g = hh + DELTAS[di]!
      if (g < 0) g += PERIOD
      else if (g >= PERIOD) g -= PERIOD
      const key = (((g & 15) ^ ((g >> 16) & 15)) << 3) | di
      if (key <= prev) {
        ok = false
        break
      }
      prev = key
    }
    if (ok) residues.push(hh)
  }

  const matches = residues.map((residue): ReverseMatch => {
    const h = residue > PERIOD / 2 ? residue - PERIOD : residue
    const z = Math.round(h / 961)
    const x = h - 961 * z
    return { h, example: { x, y: 0, z } }
  })
  matches.sort(
    (a, b) =>
      Math.abs(a.example.x) +
      Math.abs(a.example.z) -
      (Math.abs(b.example.x) + Math.abs(b.example.z)),
  )

  return { count: residues.length, matches: matches.slice(0, MAX_MATCHES_SHOWN) }
}

/** Percentage of all positions, formatted like the docs reference table */
export function formatPercent(count: number): string {
  const pct = (count / PERIOD) * 100
  return pct < 0.001 ? pct.toFixed(6) : pct.toFixed(4)
}
