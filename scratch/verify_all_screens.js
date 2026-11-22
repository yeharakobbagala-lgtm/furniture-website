const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const port = 9360;
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=' + port,
  '--window-size=1600,1000'
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
        await send('Page.navigate', { url: 'http://localhost:3002' });
        await new Promise(r => setTimeout(r, 2000));

        // Test 1: 1280x800 (13" MacBook)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1280,
          height: 800,
          deviceScaleFactor: 2,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1200));
        let shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/mac13_final_1280.png', Buffer.from(shot.data, 'base64'));

        // Scroll to category at 1280
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 680)' });
        await new Promise(r => setTimeout(r, 1000));
        shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/mac13_cat_final_1280.png', Buffer.from(shot.data, 'base64'));

        // Test 2: 1536x864 (Reference Windows Laptop)
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1536,
          height: 864,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1200));
        shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/laptop_final_1536.png', Buffer.from(shot.data, 'base64'));

        console.log('All comparison screenshots captured successfully.');
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
