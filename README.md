# Лаб 02 — k6 Load Testing
**B222270046 М. Билгүүн-Эрдэнэ**

## Орчин

```text
k6.exe v2.2.0 (commit/00a9a1b7f5, go1.26.5, windows/amd64)
```

Сервер: https://test.k6.io

Скриптүүд: [Үндсэн](test-basic.js), [Stages](test-stages.js), [Threshold](test-threshold.js). Тестүүдэд `check()` ашиглан status 200 эсэхийг шалгаж, iteration бүрд `sleep(1)` хийсэн.

## Ачааллын харьцуулалт

5, 30, 100 VU тус бүрээр **1 минут** ажиллуулсан.

| VU | p90 (ms) | p95 (ms) | Max (ms) | Requests | Throughput (req/s) | Error rate |
|---|---:|---:|---:|---:|---:|---:|
| 5 | 225.41 | 226.27 | 232.05 | 470 | 7.70 | 0.00% |
| 30 | 226.06 | 226.64 | 232.74 | 2820 | 46.07 | 0.00% |
| 100 | 226.19 | 227.57 | 429.85 | 9358 | 152.69 | 0.00% |

Бүтэн гаралт: [5 VU](results/05vu.txt), [30 VU](results/30vu.txt), [100 VU](results/100vu.txt).

## Stages туршилт

Ачааллыг **30 секундэд 5 → 1 минутад 30 → 30 секундэд 100 → 30 секундэд 0 VU** болгон өөрчилсөн.

Нэгтгэсэн p95 = **226.67 ms**, throughput = **47.08 req/s**, нийт хүсэлт = **7094**, error rate = **0.00%**. Энэ summary-г дээрх тусдаа хэмжилтийн хүснэгтэд ашиглаагүй.

Бүтэн гаралт: [stages.txt](results/stages.txt).

## SLO ба PASS / FAIL

**5 VU / 30 секундийн baseline** p95 = **226.70 ms**. Ачаалал өсөхөд baseline-аас 50% өсөх зай өгч, SLO-г **226.70 × 1.5 = 340.05 ms** гэж сонгосон.

Baseline гаралт: [run-05vu-baseline.txt](results/run-05vu-baseline.txt).

Threshold тестүүдийг тус бүр **30 VU / 1 минут** ажиллуулж, `http_req_failed: ['rate<0.01']` шаардлага нэмсэн.

| Тест | Latency threshold | Бодит p95 | Error rate | Үр дүн |
|------|-------------------|-----------|------------|--------|
| PASS | `p(95)<340.05` | 226.12 ms | 0.00% | Хоёр threshold биелсэн |
| FAIL | `p(95)<50` | 227.03 ms | 0.00% | Latency threshold зөрчигдсөн |

FAIL тестэд `thresholds on metrics 'http_req_duration' have been crossed` гэсэн алдаа гарсан.

Бүтэн гаралт: [PASS](results/threshold-pass.txt), [FAIL](results/threshold-fail.txt).

## Screemshot зургууд

- [Baseline](results/screenshots/baseline-05vu.png)
- [5 VU](results/screenshots/05vu.png), [30 VU](results/screenshots/30vu.png), [100 VU](results/screenshots/100vu.png)
- [Stages](results/screenshots/stages.png)
- [PASS](results/screenshots/threshold-pass.png), [FAIL](results/screenshots/threshold-fail.png)

## Дүгнэлт

Энэ лабораториор k6 ашиглан latency, throughput болон error rate хэмжсэн. Ачааллыг 5-аас 100 VU болгоход p95 нь 226.27 ms-ээс 227.57 ms болж бага өөрчлөгдсөн. Throughput нь 7.70-аас 152.69 req/s болж, VU тоотой ойролцоогоор пропорциональ өссөн. HTTP error rate бүх туршилтад 0.00% байсан бөгөөд status 200 check-үүд амжилттай болсон. 100 VU дээр max latency 429.85 ms хүрсэн нь p95-аас гадна хамгийн удаан хүсэлтийг мөн анхаарах хэрэгтэйг харуулсан. Stages туршилтын нийт p95 нь 226.67 ms байсан. 5 VU baseline-аас тооцсон 340.05 ms SLO болон 1%-аас бага error rate-ийн шаардлага PASS тестэд биелсэн. Харин 50 ms босготой тест HTTP алдаагүй байсан ч latency шаардлага зөрчигдөж FAIL болсон. Ингэснээр threshold нь CI pipeline-д гүйцэтгэлийн quality gate болж болохыг ойлгосон. Туршсан ачааллын хүрээнд p95 мэдэгдэхүйц муудаагүй боловч эдгээр богино тестээр серверийн дээд хүчин чадлыг тогтоох боломжгүй.