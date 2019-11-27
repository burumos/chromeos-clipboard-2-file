const http = require('http');
const fs = require('fs');

const fileName = 'clipboard.txt';

const serve = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk)
      .on('end', () => {
        console.log('post', body, ';;');
        fs.writeFile(__dirname + '/' + fileName, JSON.parse(body).text, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log('success Writeing file!');
          }
        })
      })
  }
  res.writeHeader(200, {'Context-Type': 'text/plain'});
  res.write('ok');
  res.end();
})

serve.listen(8123);
console.log('server start');
