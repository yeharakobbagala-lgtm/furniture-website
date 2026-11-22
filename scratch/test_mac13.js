const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const port = 9349;
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=' + port,
  '--window-size=1280,800'
]);

function tryConnect(retries) {
  http.get('http://127.0.0.1:' + port + '/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const page = JSON.parse(data).find(t => t.type === 'page');
      const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      function send(m, p) {
        return new Promise(r => {
          const i = id++;
          const fn = (e) => {
            const res = JSON.parse(e.data);
            if (res.id === i) { ws.removeEventListener('message', fn); r(res.result); }
          };
          ws.addEventListener('message', fn);
          ws.send(JSON.stringify({ id: i, method: m, params: p }));
        });
      }

      ws.addEventListener('open', async () => {
        await send('Page.enable');
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 800,
          deviceScaleFactor: 2,
          mobile: false
        });
        await send('Page.navigate', { url: 'http://localhost:3002' });
        await new Promise(r => setTimeout(r, 2500));

        // 1. Screenshot Hero at 1280x800
        const shotHero = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/mac13_hero_1280.png', Buffer.from(shotHero.data, 'base64'));
        console.log('Saved mac13_hero_1280.png');

        // 2. Scroll down to category section
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 850)' });
        await new Promise(r => setTimeout(r, 1200));
        const shotCat = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/mac13_category_1280.png', Buffer.from(shotCat.data, 'base64'));
        console.log('Saved mac13_category_1280.png');

        ws.close();
        chrome.kill();
        process.exit(0);
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => tryConnect(retries - 1), 300);
    else { console.error('Failed to connect'); process.exit(1); }
  });
}

tryConnect(15);
