const http = require('http');
const { spawn } = require('child_process');

const port = 9345;
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000'
]);

function tryConnect(retries) {
  http.get(`http://127.0.0.1:${port}/json`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const targets = JSON.parse(data);
      const page = targets.find(t => t.type === 'page');
      const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);

      let id = 1;
      function send(method, params) {
        return new Promise(resolve => {
          const msgId = id++;
          const onMessage = (event) => {
            const result = JSON.parse(event.data);
            if (result.id === msgId) {
              ws.removeEventListener('message', onMessage);
              resolve(result.result);
            }
          };
          ws.addEventListener('message', onMessage);
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });
      }

      ws.addEventListener('open', async () => {
        await send('Page.enable');
        await send('Page.navigate', { url: 'http://localhost:3002' });
        await new Promise(r => setTimeout(r, 2000));
        
        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const imgs = Array.from(document.querySelectorAll('img'));
              return imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                width: img.width,
                height: img.height,
                rect: img.getBoundingClientRect(),
                zIndex: window.getComputedStyle(img).zIndex,
                opacity: window.getComputedStyle(img).opacity,
                display: window.getComputedStyle(img).display
              })).filter(x => x.src.includes('hero') || x.alt.includes('pendant') || x.alt.includes('Armchair'));
            })()
          `,
          returnByValue: true
        });
        console.log('Images in hero:', JSON.stringify(evalRes.result.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => tryConnect(retries - 1), 500);
    else { chrome.kill(); process.exit(1); }
  });
}
setTimeout(() => tryConnect(10), 1000);
