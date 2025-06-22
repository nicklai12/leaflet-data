// api/sse.js
export default function handler(req, res) {
  // 允許跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  // SSE 相關 headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  // 模擬 N 輛車的初始座標
  const cars = [
    { carId: 'car-1', lat: 25.038,    lng: 121.5645 },
    { carId: 'car-2', lat: 25.040,    lng: 121.5650 },
    { carId: 'car-3', lat: 25.0365,   lng: 121.5630 },
    // ……可以再新增更多車輛
  ];

  // 每秒隨機更新每輛車的座標，並推送整個陣列
  const sendData = () => {
    const updated = cars.map(c => ({
      carId: c.carId,
      lat: c.lat + (Math.random() - 0.5) * 0.005,
      lng: c.lng + (Math.random() - 0.5) * 0.005
    }));
    res.write(`data: ${JSON.stringify(updated)}\n\n`);
  };

  const timer = setInterval(sendData, 1000);

  req.on('close', () => {
    clearInterval(timer);
  });
}
