import http from 'k6/http';
import { check, sleep } from 'k6';

const p95Limit = Number(__ENV.P95_MS);

if (!Number.isFinite(p95Limit) || p95Limit <= 0) {
  throw new Error('Set P95_MS to baseline p95 * 1.5, or 50 for FAIL.');
}

export const options = {
  vus: 30,
  duration: '1m',
  thresholds: {
    http_req_duration: [`p(95)<${p95Limit}`],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'status 200 байна': (r) => r.status === 200,
  });
  sleep(1);
}