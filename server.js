/**
 * ===============================================
 *  ❗ 로컬 HTTPS 환경 (필요 시 주석 해제)
 * ===============================================
 */

const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

// 개발 모드 여부 확인
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 로컬에서 사용할 인증서 경로
const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('🚀 Next.js running on https://localhost:3000');
  });
});

/**
 * ===============================================
 *  배포 환경 (HTTP) - 현재 활성화
 * ===============================================
 */
// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   }).listen(3000, '0.0.0.0', () => {
//     console.log('🚀 Next.js running on http://0.0.0.0:3000');
//   });
// });
