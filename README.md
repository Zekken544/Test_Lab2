# Лаб 02 — k6 Load Testing B222270046 М. Билгүүн-Эрдэнэ

## Орчин
```
k6.exe v2.2.0 (commit/00a9a1b7f5, go1.26.5, windows/amd64)
```

## Тест хийсэн сервер
`https://test.k6.io`

## Тестийн скрипт
```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1, // 1 → 5 → 30 → 100 болгож тус тусад нь ажиллуулсан
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<332'], // baseline p95 (221.59ms) × 1.5
  },
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}
```

## Ачааллын харьцуулалт (1 → 5 → 30 → 100 VU)

| VU | p90 (ms) | p95 (ms) | max (ms) | Requests | Throughput (req/s) | Error rate |
|----|----------|----------|----------|----------|---------------------|------------|
| 1   | 221.48 | 221.59 | 221.83 | 46   | 1.52   | 0.00% |
| 5   | 225.55 | 226.29 | 229.75 | 230  | 7.57   | 0.00% |
| 30  | 226.19 | 226.59 | 473.93 | 1380 | 44.96  | 0.00% |
| 100 | 226.18 | 226.85 | 238.44 | 4626 | 147.94 | 0.00% |

Файлууд: `results/run-01vu.txt`, `results/run-05vu.txt`, `results/run-30vu.txt`, `results/run-100vu.txt`

## SLO (Threshold) тохиргоо ба тайлбар

`p(95)<332ms` гэсэн threshold-ыг зааврын дагуу санамсаргүй тоо биш, харин **1 VU-ийн baseline** дээр үндэслэн сонгосон:

- Baseline (1 VU) p95 = 221.59ms
- SLO = baseline × 1.5 ≈ **332ms**

### PASS тест
`results/run-threshold-pass.txt` — 1 VU дээр p(95)=224.09ms < 332ms → **PASS**

### FAIL тест
`results/run-threshold-fail.txt` — санаатайгаар хатуу threshold (`p(95)<50`) тавихад p(95)=223.96ms → **FAIL**, k6 `ERRO[...] thresholds on metrics 'http_req_duration' have been crossed` гэж алдаа буцаасан.

