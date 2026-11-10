// Order-preserving best-score alignment (weighted LCS) of two word sequences.

/**
 * Returns, for each index of `src`, the matched index in `dst` or -1.
 * `score(i, j)` gives a match score; pairs below `min` are never matched.
 */
export function align(n, m, score, min = 0.6) {
  const S = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  const memo = Array.from({ length: n }, () => new Float64Array(m));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
      const s = (memo[i - 1][j - 1] = score(i - 1, j - 1));
      const diag = s >= min ? S[i - 1][j - 1] + s : -Infinity;
      S[i][j] = Math.max(S[i - 1][j], S[i][j - 1], diag);
    }

  const out = new Array(n).fill(-1);
  for (let i = n, j = m; i > 0 && j > 0; ) {
    const s = memo[i - 1][j - 1];
    if (s >= min && S[i][j] === S[i - 1][j - 1] + s) {
      out[i - 1] = j - 1;
      i--;
      j--;
    } else if (S[i][j] === S[i - 1][j]) i--;
    else j--;
  }
  return out;
}
