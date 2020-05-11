const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const http = require('http');

const babelConfig = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, './.babelrc')
  )
);
// const babelConfig =  {
//   "presets": [
//     "es2015",
//     "react",
//     "stage-0",
//   ],
//   "plugins": [],
// };

function transform(codeStr) {
  return babel.transform(codeStr, babelConfig).code;
}

const server = http.createServer((req, res) => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    try {
      if (!body || body.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json;charset:utf-8' });
        res.end(JSON.stringify({ code: '没有请求体' }));
        return;
      }
      const bodyJson = JSON.parse(body.toString());
      if (!bodyJson.code) {
        res.writeHead(400, { 'Content-Type': 'application/json;charset:utf-8' });
        // res.statusCode = 400;
        res.end(JSON.stringify({
          msg: '请求体缺少code参数',
        }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json;charset:utf-8' });
      res.end(JSON.stringify({
        code: transform(bodyJson.code),
      }));
    } catch(err) {
      // res.writeHead(400, contentTypeHeader);
      res.writeHead(400, { 'Content-Type': 'application/json;charset:utf-8' });
      res.end(JSON.stringify({ code: err.toString() }));
      console.error(err);
    }
  });
});

server.listen(8090);

server.on('listening',function(){
  console.log('ok, server is running');
});

console.info('Code transform server start success!');
