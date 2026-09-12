import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,  //<---- VU uurcilj turshih bol ene
  duration: '30s', 
  thresholds: {
    http_req_duration: ['p(95)<332'], //<---- Threshold uurcluh bol ene
  },
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}