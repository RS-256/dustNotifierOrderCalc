import { PERIOD, formatPercent, getOrder } from '../lib/notifier'

/**
 * The 60 notifier-order patterns, ranked by frequency.
 *
 * Stored data is only [exact count over the 2^20-block period, example x, example z]
 * (all examples at y = 0). Everything shown in the table — the order string,
 * percentage, bar width and reduced fraction — is derived from these via the same
 * lib the calculator uses, so the table can never drift out of sync with the model.
 *
 * Counts match Earthcomputer's 2^32 brute force exactly (each is 1/4096 of it):
 * https://gist.github.com/Earthcomputer/0dba0fa93549eff694a6d17f1dbbd511
 */
const RAW: readonly (readonly [count: number, x: number, z: number])[] = [
  [254456, 0, -2],
  [254456, 0, 1],
  [127228, -3, 2],
  [127228, 2, -2],
  [127228, -2, 2],
  [127228, 1, -2],
  [1920, -1, -68],
  [1920, 0, 68],
  [1920, 0, 69],
  [1920, -1, -69],
  [1860, 0, -69],
  [1860, 0, -68],
  [1860, -1, 69],
  [1860, -1, 68],
  [1280, -8, 0],
  [1280, 7, 0],
  [1277, -2, 1],
  [1277, 1, -1],
  [1277, -1, 1],
  [1277, 0, -1],
  [1160, -3, 1],
  [1160, 2, -1],
  [717, 8, -1],
  [717, -9, 1],
  [600, -1, -136],
  [600, 0, 136],
  [583, 0, -137],
  [583, -1, 137],
  [583, 0, -136],
  [583, -1, 136],
  [60, 171, 68],
  [60, 157, 68],
  [60, -172, -68],
  [60, -158, -68],
  [43, -16, 0],
  [43, 15, 0],
  [43, 16, 0],
  [43, -17, 0],
  [40, 9, 0],
  [40, -2, 0],
  [40, 1, 0],
  [40, -10, 0],
  [17, 184, -273],
  [17, -193, 273],
  [17, -185, 273],
  [17, 192, -273],
  [4, 187, 68],
  [4, -189, -68],
  [4, -188, -68],
  [4, 188, 68],
  [3, 8, 0],
  [3, -210, 273],
  [3, -209, 273],
  [3, -9, 0],
  [3, 209, -273],
  [3, 208, -273],
  [1, 418, -546],
  [1, 417, -546],
  [1, 0, 0],
  [1, -1, 0],
]

export interface Pattern {
  rank: number
  order: string
  count: number
  /** Percentage of all wire positions, formatted like the reference table */
  pct: string
  /** Bar width relative to the most common pattern, in % */
  barWidth: string
  fraction: { num: string; den: string; reducedNum: number; reducedDen: number }
  example: { x: number; y: number; z: number }
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

const maxCount = Math.max(...RAW.map(([c]) => c))

export const PATTERNS: readonly Pattern[] = RAW.map(([count, x, z], i) => {
  const g = gcd(count, PERIOD)
  return {
    rank: i + 1,
    order: getOrder(x, 0, z)
      .map((d) => d.label)
      .join(' '),
    count,
    pct: formatPercent(count),
    barWidth: ((count / maxCount) * 100).toFixed(2),
    fraction: {
      num: count.toLocaleString('en-US'),
      den: PERIOD.toLocaleString('en-US'),
      reducedNum: count / g,
      reducedDen: PERIOD / g,
    },
    example: { x, y: 0, z },
  }
})
