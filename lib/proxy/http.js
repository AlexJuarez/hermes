'use strict';

const http = require('http');
const net = require('net');

function createServer(app, config){
  const port = config.httpPort;
  const httpsPort = config.httpsPort;
  const server = http.createServer(app).listen(port);

  server.on('connect', (req, cltSocket, head) => {
    var srvSocket = net.connect(httpsPort, 'localhost', () => {
      cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-agent: Node.js-Proxy\r\n' +
        '\r\n');
      srvSocket.write(head);
      srvSocket.pipe(cltSocket);
      cltSocket.pipe(srvSocket);
    });
  });

  return server;
}

module.exports = createServer;
