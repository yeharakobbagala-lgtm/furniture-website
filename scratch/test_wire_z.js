const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const port = 9325;
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
        
        // Test setting pendant z-index to 50
        await send('Runtime.evaluate', {
          expression: `
            const imgs = Array.from(document.querySelectorAll('img'));
            const pendant = imgs.find(img => img.src.includes('New%20Project%20(21)') || img.src.includes('New Project (21)'));
            if (pendant) {
              pendant.style.zIndex = '50';
              // parent also needs high z-index
              let p = pendant.parentElement;
              while (p && p.tagName !== 'SECTION') {
                p.style.zIndex = '50';
                p = p.parentElement;
              }
            }
          `
        });
        await new Promise(r => setTimeout(r, 500));
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('scratch/test_wire_z50.png', Buffer.from(shot.data, 'base64'));
        console.log('Saved scratch/test_wire_z50.png');
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
